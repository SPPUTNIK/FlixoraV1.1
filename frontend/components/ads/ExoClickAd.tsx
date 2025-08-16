'use client';

import { useEffect, useRef } from 'react';
import { adConfig, isAdNetworkEnabled, getAdZone, logAd } from '@/config/ads';

interface ExoClickAdProps {
  type: 'banner' | 'popunder' | 'native' | 'video';
  className?: string;
  width?: number;
  height?: number;
}

export default function ExoClickAd({ type, className = '', width = 300, height = 250 }: ExoClickAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!isAdNetworkEnabled('exoclick') || loadedRef.current) return;

    const zone = getAdZone('exoclick', type);
    if (!zone) {
      logAd('exoclick', type, 'No zone configured');
      return;
    }

    logAd('exoclick', type, `Loading zone: ${zone}`);

    const loadAd = () => {
      if (type === 'popunder') {
        // ExoClick Popunder
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          var uid = '${zone}';
          var wid = '${width}';
          var pop_tag = document.createElement('script');
          pop_tag.src = '//cdn.exosrv.com/popunder.js';
          document.head.appendChild(pop_tag);
          
          var pop_passive = true;
          var pop_tag2 = document.createElement('script');
          pop_tag2.src = '//syndication.exosrv.com/popunder.js?zoneid=${zone}';
          document.head.appendChild(pop_tag2);
        `;
        document.head.appendChild(script);
        logAd('exoclick', type, 'Popunder loaded');
      } else if (type === 'banner' || type === 'native') {
        // ExoClick Banner/Native
        if (adRef.current) {
          const adContainer = document.createElement('div');
          adContainer.id = `exoclick-${type}-${Date.now()}`;
          adRef.current.appendChild(adContainer);

          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `
            (function(){
              var div = document.getElementById('${adContainer.id}');
              var script = document.createElement('script');
              script.src = '//syndication.exosrv.com/splash.php?idzone=${zone}&type=${type === 'native' ? 'native' : 'banner'}&w=${width}&h=${height}';
              div.appendChild(script);
            })();
          `;
          document.head.appendChild(script);
          logAd('exoclick', type, `${type} ad loaded in container`);
        }
      } else if (type === 'video') {
        // ExoClick Video Ad
        if (adRef.current) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `
            var exo_video_ad = {
              zone: '${zone}',
              width: ${width},
              height: ${height}
            };
            var script = document.createElement('script');
            script.src = '//syndication.exosrv.com/video.js';
            document.head.appendChild(script);
          `;
          adRef.current.appendChild(script);
          logAd('exoclick', type, 'Video ad loaded');
        }
      }
    };

    // Delay ad loading for better UX
    const timer = setTimeout(() => {
      loadAd();
      loadedRef.current = true;
    }, adConfig.delay);

    return () => clearTimeout(timer);
  }, [type, width, height]);

  if (!isAdNetworkEnabled('exoclick')) {
    return adConfig.debug ? (
      <div className={`bg-gray-200 dark:bg-gray-700 p-4 rounded ${className}`}>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          ExoClick {type} ad (disabled)
        </p>
      </div>
    ) : null;
  }

  // Don't render container for popunder
  if (type === 'popunder') {
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={`exoclick-ad ${className}`}
      style={{ 
        minWidth: width, 
        minHeight: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {adConfig.debug && (
        <div className="bg-blue-100 border border-blue-300 p-2 rounded text-xs text-blue-700">
          ExoClick {type} - Zone: {getAdZone('exoclick', type)}
        </div>
      )}
    </div>
  );
}
