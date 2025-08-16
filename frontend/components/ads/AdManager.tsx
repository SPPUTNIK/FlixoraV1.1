'use client';

import { useEffect } from 'react';
import PopAds from './PopAds';
import ExoClickAd from './ExoClickAd';
import AdsterraAd from './AdsterraAd';
import MonetagAd from './MonetagAd';
import { adConfig, isAdNetworkEnabled, logAd } from '@/config/ads';

interface AdManagerProps {
  enablePopunders?: boolean;
  enablePushNotifications?: boolean;
  enableSocialBar?: boolean;
  enableVignette?: boolean;
}

export default function AdManager({ 
  enablePopunders = true,
  enablePushNotifications = true,
  enableSocialBar = false,
  enableVignette = false 
}: AdManagerProps) {
  
  useEffect(() => {
    if (!adConfig.enabled) {
      logAd('manager', 'init', 'Ads disabled');
      return;
    }

    logAd('manager', 'init', 'Initializing ad networks');

    // Small delay before loading ads for better UX
    const timer = setTimeout(() => {
      logAd('manager', 'init', 'Loading global ads');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!adConfig.enabled) {
    return adConfig.debug ? (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 p-2 rounded text-xs text-red-700 z-50">
        Ad Manager: Disabled
      </div>
    ) : null;
  }

  return (
    <>
      {/* PopAds - Global popunder */}
      {enablePopunders && isAdNetworkEnabled('popads') && <PopAds />}
      
      {/* ExoClick - Popunder */}
      {enablePopunders && isAdNetworkEnabled('exoclick') && (
        <ExoClickAd type="popunder" />
      )}
      
      {/* Adsterra - Popunder */}
      {enablePopunders && isAdNetworkEnabled('adsterra') && (
        <AdsterraAd type="popunder" />
      )}
      
      {/* Monetag - Popunder */}
      {enablePopunders && isAdNetworkEnabled('monetag') && (
        <MonetagAd type="popunder" />
      )}
      
      {/* Push Notifications */}
      {enablePushNotifications && isAdNetworkEnabled('adsterra') && (
        <AdsterraAd type="push" />
      )}
      
      {enablePushNotifications && isAdNetworkEnabled('monetag') && (
        <MonetagAd type="push" />
      )}
      
      {/* Social Bar */}
      {enableSocialBar && isAdNetworkEnabled('adsterra') && (
        <AdsterraAd type="socialBar" />
      )}
      
      {/* Vignette/Interstitial */}
      {enableVignette && isAdNetworkEnabled('monetag') && (
        <MonetagAd type="vignette" />
      )}
      
      {/* Debug Info */}
      {adConfig.debug && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 p-2 rounded text-xs text-green-700 z-50">
          <div>Ad Manager Active</div>
          <div>Networks: {Object.keys(adConfig.networks).filter(network => isAdNetworkEnabled(network as any)).join(', ')}</div>
          <div>Popunders: {enablePopunders ? 'ON' : 'OFF'}</div>
          <div>Push: {enablePushNotifications ? 'ON' : 'OFF'}</div>
        </div>
      )}
    </>
  );
}
