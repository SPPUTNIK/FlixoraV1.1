'use client';

import { useEffect, useRef } from 'react';
import { adConfig, isAdNetworkEnabled, getAdZone, logAd } from '@/config/ads';

interface MonetagAdProps {
  type: 'banner' | 'popunder' | 'vignette' | 'push';
  className?: string;
  width?: number;
  height?: number;
}

export default function MonetagAd({ type, className = '', width = 300, height = 250 }: MonetagAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!isAdNetworkEnabled('monetag') || loadedRef.current) return;

    const zone = getAdZone('monetag', type);
    if (!zone) {
      logAd('monetag', type, 'No zone configured');
      return;
    }

    logAd('monetag', type, `Loading zone: ${zone}`);

    const loadAd = () => {
      if (type === 'popunder') {
        // Monetag Popunder
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          (function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gklfothfgh.com','${zone}',document.createElement('script'));
        `;
        document.head.appendChild(script);
        logAd('monetag', type, 'Popunder loaded');
      } else if (type === 'banner') {
        // Monetag Banner
        if (adRef.current) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `
            (function(d,z,s){s.src='https://'+d+'/400/'+z;try{document.getElementById('monetag-${Date.now()}').appendChild(s)}catch(e){}})('gklfothfgh.com','${zone}',document.createElement('script'));
          `;
          
          const container = document.createElement('div');
          container.id = `monetag-${Date.now()}`;
          container.style.width = width + 'px';
          container.style.height = height + 'px';
          container.style.margin = '0 auto';
          
          adRef.current.appendChild(container);
          adRef.current.appendChild(script);
          logAd('monetag', type, 'Banner loaded');
        }
      } else if (type === 'vignette') {
        // Monetag Vignette (Interstitial)
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          (function(d,z,s){s.src='https://'+d+'/402/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gklfothfgh.com','${zone}',document.createElement('script'));
        `;
        document.head.appendChild(script);
        logAd('monetag', type, 'Vignette loaded');
      } else if (type === 'push') {
        // Monetag Push Notifications
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          (function(d,z,s){s.src='https://'+d+'/403/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gklfothfgh.com','${zone}',document.createElement('script'));
        `;
        document.head.appendChild(script);
        logAd('monetag', type, 'Push notifications loaded');
      }
    };

    // Delay ad loading for better UX
    const timer = setTimeout(() => {
      loadAd();
      loadedRef.current = true;
    }, adConfig.delay);

    return () => clearTimeout(timer);
  }, [type, width, height]);

  if (!isAdNetworkEnabled('monetag')) {
    return adConfig.debug ? (
      <div className={`bg-gray-200 dark:bg-gray-700 p-4 rounded ${className}`}>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Monetag {type} ad (disabled)
        </p>
      </div>
    ) : null;
  }

  // Don't render container for popunder, vignette, or push
  if (type === 'popunder' || type === 'vignette' || type === 'push') {
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={`monetag-ad ${className}`}
      style={{ 
        minWidth: width, 
        minHeight: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {adConfig.debug && (
        <div className="bg-purple-100 border border-purple-300 p-2 rounded text-xs text-purple-700">
          Monetag {type} - Zone: {getAdZone('monetag', type)}
        </div>
      )}
    </div>
  );
}
