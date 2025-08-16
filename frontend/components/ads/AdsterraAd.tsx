'use client';

import { useEffect, useRef } from 'react';
import { adConfig, isAdNetworkEnabled, getAdZone, logAd } from '@/config/ads';

interface AdsterraAdProps {
  type: 'banner' | 'popunder' | 'socialBar' | 'push';
  className?: string;
  width?: number;
  height?: number;
}

export default function AdsterraAd({ type, className = '', width = 300, height = 250 }: AdsterraAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!isAdNetworkEnabled('adsterra') || loadedRef.current) return;

    const zone = getAdZone('adsterra', type);
    if (!zone) {
      logAd('adsterra', type, 'No zone configured');
      return;
    }

    logAd('adsterra', type, `Loading zone: ${zone}`);

    const loadAd = () => {
      if (type === 'popunder') {
        // Adsterra Popunder
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          atOptions = {
            'key': '${zone}',
            'format': 'iframe',
            'height': 50,
            'width': 320,
            'params': {}
          };
          var script = document.createElement('script');
          script.src = '//www.highperformanceformat.com/${zone}/invoke.js';
          document.head.appendChild(script);
        `;
        document.head.appendChild(script);
        logAd('adsterra', type, 'Popunder loaded');
      } else if (type === 'banner') {
        // Adsterra Banner
        if (adRef.current) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `
            atOptions = {
              'key': '${zone}',
              'format': 'iframe',
              'height': ${height},
              'width': ${width},
              'params': {}
            };
          `;
          adRef.current.appendChild(script);

          const invokeScript = document.createElement('script');
          invokeScript.type = 'text/javascript';
          invokeScript.src = `//www.highperformanceformat.com/${zone}/invoke.js`;
          adRef.current.appendChild(invokeScript);
          logAd('adsterra', type, 'Banner loaded');
        }
      } else if (type === 'socialBar') {
        // Adsterra Social Bar
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          atOptions = {
            'key': '${zone}',
            'format': 'iframe',
            'height': 90,
            'width': 728,
            'params': {}
          };
          var script = document.createElement('script');
          script.src = '//www.highperformanceformat.com/${zone}/invoke.js';
          document.body.appendChild(script);
        `;
        document.head.appendChild(script);
        logAd('adsterra', type, 'Social bar loaded');
      } else if (type === 'push') {
        // Adsterra Push Notifications
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          (function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://iclickcdn.com/tag.min.js','${zone}',document.head);
        `;
        document.head.appendChild(script);
        logAd('adsterra', type, 'Push notifications loaded');
      }
    };

    // Delay ad loading for better UX
    const timer = setTimeout(() => {
      loadAd();
      loadedRef.current = true;
    }, adConfig.delay);

    return () => clearTimeout(timer);
  }, [type, width, height]);

  if (!isAdNetworkEnabled('adsterra')) {
    return adConfig.debug ? (
      <div className={`bg-gray-200 dark:bg-gray-700 p-4 rounded ${className}`}>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Adsterra {type} ad (disabled)
        </p>
      </div>
    ) : null;
  }

  // Don't render container for popunder, socialBar, or push
  if (type === 'popunder' || type === 'socialBar' || type === 'push') {
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={`adsterra-ad ${className}`}
      style={{ 
        minWidth: width, 
        minHeight: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {adConfig.debug && (
        <div className="bg-green-100 border border-green-300 p-2 rounded text-xs text-green-700">
          Adsterra {type} - Zone: {getAdZone('adsterra', type)}
        </div>
      )}
    </div>
  );
}
