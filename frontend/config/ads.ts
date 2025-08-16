// Ad Networks Configuration
// All configuration comes from environment variables

export interface AdConfig {
  enabled: boolean;
  debug: boolean;
  delay: number;
  networks: {
    exoclick: {
      publisherId: string;
      zones: {
        banner: string;
        popunder: string;
        native: string;
        video: string;
      };
    };
    adsterra: {
      publisherId: string;
      zones: {
        banner: string;
        popunder: string;
        socialBar: string;
        push: string;
      };
    };
    popads: {
      siteId: string;
    };
    monetag: {
      publisherId: string;
      zones: {
        banner: string;
        popunder: string;
        vignette: string;
        push: string;
      };
    };
  };
}

export const adConfig: AdConfig = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
  debug: process.env.NEXT_PUBLIC_ADS_DEBUG === 'true',
  delay: parseInt(process.env.NEXT_PUBLIC_ADS_DELAY || '3000'),
  
  networks: {
    exoclick: {
      publisherId: process.env.NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID || '',
      zones: {
        banner: process.env.NEXT_PUBLIC_EXOCLICK_BANNER_ZONE || '',
        popunder: process.env.NEXT_PUBLIC_EXOCLICK_POPUNDER_ZONE || '',
        native: process.env.NEXT_PUBLIC_EXOCLICK_NATIVE_ZONE || '',
        video: process.env.NEXT_PUBLIC_EXOCLICK_VIDEO_ZONE || '',
      },
    },
    adsterra: {
      publisherId: process.env.NEXT_PUBLIC_ADSTERRA_PUBLISHER_ID || '',
      zones: {
        banner: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_ZONE || '',
        popunder: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_ZONE || '',
        socialBar: process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ZONE || '',
        push: process.env.NEXT_PUBLIC_ADSTERRA_PUSH_ZONE || '',
      },
    },
    popads: {
      siteId: process.env.NEXT_PUBLIC_POPADS_SITE_ID || '',
    },
    monetag: {
      publisherId: process.env.NEXT_PUBLIC_MONETAG_PUBLISHER_ID || '',
      zones: {
        banner: process.env.NEXT_PUBLIC_MONETAG_BANNER_ZONE || '',
        popunder: process.env.NEXT_PUBLIC_MONETAG_POPUNDER_ZONE || '',
        vignette: process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE || '',
        push: process.env.NEXT_PUBLIC_MONETAG_PUSH_ZONE || '',
      },
    },
  },
};

// Utility functions
export const isAdNetworkEnabled = (network: keyof AdConfig['networks']): boolean => {
  if (!adConfig.enabled) return false;
  
  switch (network) {
    case 'exoclick':
      return !!adConfig.networks.exoclick.publisherId;
    case 'adsterra':
      return !!adConfig.networks.adsterra.publisherId;
    case 'popads':
      return !!adConfig.networks.popads.siteId;
    case 'monetag':
      return !!adConfig.networks.monetag.publisherId;
    default:
      return false;
  }
};

export const getAdZone = (network: keyof AdConfig['networks'], type: string): string => {
  if (!isAdNetworkEnabled(network)) return '';
  
  const networkConfig = adConfig.networks[network] as any;
  
  // Handle PopAds which doesn't have zones
  if (network === 'popads') {
    return networkConfig.siteId || '';
  }
  
  // Handle other networks with zones
  return networkConfig.zones?.[type] || '';
};

export const logAd = (network: string, type: string, action: string) => {
  if (adConfig.debug) {
    console.log(`[ADS] ${network.toUpperCase()} - ${type} - ${action}`);
  }
};
