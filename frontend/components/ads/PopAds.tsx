'use client';

import { useEffect, useRef } from 'react';
import { adConfig, isAdNetworkEnabled, getAdZone, logAd } from '@/config/ads';

interface PopAdsProps {
  className?: string;
}

export default function PopAds({ className = '' }: PopAdsProps) {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!isAdNetworkEnabled('popads') || loadedRef.current) return;

    const siteId = getAdZone('popads', 'site');
    if (!siteId) {
      logAd('popads', 'popunder', 'No site ID configured');
      return;
    }

    logAd('popads', 'popunder', `Loading site ID: ${siteId}`);

    const loadAd = () => {
      // PopAds popunder
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        var _pop = _pop || [];
        _pop.push(['siteId', ${siteId}]);
        _pop.push(['minBid', 0]);
        _pop.push(['popundersPerIP', 2]);
        _pop.push(['delayBetween', 0]);
        _pop.push(['default', false]);
        _pop.push(['defaultPerDay', 1]);
        _pop.push(['topmostLayer', !1]);
        (function() {
          var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.async = true;
          var s = ('https:' == document.location.protocol ? 'https:' : 'http:') + '//c1.popads.net/pop.js';
          pa.src = s; var tag = document.getElementsByTagName('script')[0];
          tag.parentNode.insertBefore(pa, tag);
        })();
      `;
      document.head.appendChild(script);
      logAd('popads', 'popunder', 'PopAds loaded');
    };

    // Delay ad loading for better UX
    const timer = setTimeout(() => {
      loadAd();
      loadedRef.current = true;
    }, adConfig.delay);

    return () => clearTimeout(timer);
  }, []);

  if (!isAdNetworkEnabled('popads')) {
    return adConfig.debug ? (
      <div className={`bg-gray-200 dark:bg-gray-700 p-4 rounded ${className}`}>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          PopAds (disabled)
        </p>
      </div>
    ) : null;
  }

  // PopAds doesn't render any visible component
  return adConfig.debug ? (
    <div className={`bg-orange-100 border border-orange-300 p-2 rounded text-xs text-orange-700 ${className}`}>
      PopAds Active - Site ID: {getAdZone('popads', 'site')}
    </div>
  ) : null;
}
