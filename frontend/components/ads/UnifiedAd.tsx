'use client';

import { useState, useEffect } from 'react';
import ExoClickAd from './ExoClickAd';
import AdsterraAd from './AdsterraAd';
import PopAds from './PopAds';
import MonetagAd from './MonetagAd';
import { adConfig, isAdNetworkEnabled, logAd } from '@/config/ads';

interface UnifiedAdProps {
  type: 'banner' | 'popunder' | 'native' | 'video' | 'socialBar' | 'vignette' | 'push';
  className?: string;
  width?: number;
  height?: number;
  maxNetworks?: number; // Limit number of networks to show
  rotateNetworks?: boolean; // Rotate between networks
}

export default function UnifiedAd({ 
  type, 
  className = '', 
  width = 300, 
  height = 250,
  maxNetworks = 2,
  rotateNetworks = true 
}: UnifiedAdProps) {
  const [activeNetworks, setActiveNetworks] = useState<string[]>([]);
  const [currentNetworkIndex, setCurrentNetworkIndex] = useState(0);

  useEffect(() => {
    // Determine which networks can show this ad type
    const availableNetworks: string[] = [];

    // Check each network for the specific ad type
    if (isAdNetworkEnabled('exoclick')) {
      const supportedTypes = ['banner', 'popunder', 'native', 'video'];
      if (supportedTypes.includes(type)) {
        availableNetworks.push('exoclick');
      }
    }

    if (isAdNetworkEnabled('adsterra')) {
      const supportedTypes = ['banner', 'popunder', 'socialBar', 'push'];
      if (supportedTypes.includes(type)) {
        availableNetworks.push('adsterra');
      }
    }

    if (isAdNetworkEnabled('popads') && type === 'popunder') {
      availableNetworks.push('popads');
    }

    if (isAdNetworkEnabled('monetag')) {
      const supportedTypes = ['banner', 'popunder', 'vignette', 'push'];
      if (supportedTypes.includes(type)) {
        availableNetworks.push('monetag');
      }
    }

    // Shuffle networks for better distribution
    const shuffledNetworks = availableNetworks.sort(() => Math.random() - 0.5);
    
    // Limit to maxNetworks
    const selectedNetworks = shuffledNetworks.slice(0, maxNetworks);
    
    setActiveNetworks(selectedNetworks);
    logAd('unified', type, `Selected networks: ${selectedNetworks.join(', ')}`);

    // Set up rotation if enabled
    if (rotateNetworks && selectedNetworks.length > 1 && type === 'banner') {
      const interval = setInterval(() => {
        setCurrentNetworkIndex(prev => (prev + 1) % selectedNetworks.length);
      }, 30000); // Rotate every 30 seconds

      return () => clearInterval(interval);
    }
  }, [type, maxNetworks, rotateNetworks]);

  if (!adConfig.enabled || activeNetworks.length === 0) {
    return adConfig.debug ? (
      <div className={`bg-gray-200 dark:bg-gray-700 p-4 rounded ${className}`}>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          No ad networks available for {type}
        </p>
      </div>
    ) : null;
  }

  // For popunder types, load all available networks
  if (type === 'popunder' || type === 'push' || type === 'socialBar' || type === 'vignette') {
    return (
      <>
        {activeNetworks.includes('exoclick') && type === 'popunder' && (
          <ExoClickAd type="popunder" />
        )}
        {activeNetworks.includes('adsterra') && (type === 'popunder' || type === 'push' || type === 'socialBar') && (
          <AdsterraAd 
            type={type as 'popunder' | 'push' | 'socialBar'} 
          />
        )}
        {activeNetworks.includes('popads') && type === 'popunder' && (
          <PopAds />
        )}
        {activeNetworks.includes('monetag') && (type === 'popunder' || type === 'push' || type === 'vignette') && (
          <MonetagAd 
            type={type as 'popunder' | 'push' | 'vignette'} 
          />
        )}
      </>
    );
  }

  // For banner types, show based on rotation or just the first one
  const currentNetwork = rotateNetworks ? activeNetworks[currentNetworkIndex] : activeNetworks[0];

  const renderNetworkAd = (network: string) => {
    switch (network) {
      case 'exoclick':
        return (
          <ExoClickAd 
            type={type as 'banner' | 'native' | 'video'} 
            className={className}
            width={width}
            height={height}
          />
        );
      case 'adsterra':
        return (
          <AdsterraAd 
            type="banner" 
            className={className}
            width={width}
            height={height}
          />
        );
      case 'monetag':
        return (
          <MonetagAd 
            type="banner" 
            className={className}
            width={width}
            height={height}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`unified-ad ${className}`}>
      {renderNetworkAd(currentNetwork)}
      
      {adConfig.debug && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Active: {currentNetwork} | Available: {activeNetworks.join(', ')}
          {rotateNetworks && activeNetworks.length > 1 && ' | Rotating every 30s'}
        </div>
      )}
    </div>
  );
}
