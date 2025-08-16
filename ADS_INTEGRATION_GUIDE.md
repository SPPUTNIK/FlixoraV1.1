# 🎯 FLIXORA Ad Networks Integration

Complete integration of **ExoClick**, **Adsterra**, **PopAds**, and **Monetag** ad networks with environment-based configuration for maximum revenue and optimal UX.

## 🚀 Quick Setup

### 1. Environment Configuration

Add your ad network credentials to `.env.local` (development) and production environment:

```bash
# ExoClick
NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID=your_exoclick_publisher_id
NEXT_PUBLIC_EXOCLICK_BANNER_ZONE=your_banner_zone_id
NEXT_PUBLIC_EXOCLICK_POPUNDER_ZONE=your_popunder_zone_id
NEXT_PUBLIC_EXOCLICK_NATIVE_ZONE=your_native_zone_id
NEXT_PUBLIC_EXOCLICK_VIDEO_ZONE=your_video_zone_id

# Adsterra
NEXT_PUBLIC_ADSTERRA_PUBLISHER_ID=your_adsterra_publisher_id
NEXT_PUBLIC_ADSTERRA_BANNER_ZONE=your_banner_zone_id
NEXT_PUBLIC_ADSTERRA_POPUNDER_ZONE=your_popunder_zone_id
NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ZONE=your_social_bar_zone_id
NEXT_PUBLIC_ADSTERRA_PUSH_ZONE=your_push_zone_id

# PopAds
NEXT_PUBLIC_POPADS_SITE_ID=your_popads_site_id

# Monetag
NEXT_PUBLIC_MONETAG_PUBLISHER_ID=your_monetag_publisher_id
NEXT_PUBLIC_MONETAG_BANNER_ZONE=your_banner_zone_id
NEXT_PUBLIC_MONETAG_POPUNDER_ZONE=your_popunder_zone_id
NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE=your_vignette_zone_id
NEXT_PUBLIC_MONETAG_PUSH_ZONE=your_push_zone_id

# Settings
NEXT_PUBLIC_ADS_ENABLED=true
NEXT_PUBLIC_ADS_DEBUG=false
NEXT_PUBLIC_ADS_DELAY=3000
```

### 2. Global Ad Manager (Already Configured)

The `AdManager` is already added to your layout and handles:
- ✅ **Popunders** from all networks
- ✅ **Push notifications** from Adsterra & Monetag
- ❌ **Social bar** (disabled for better UX)
- ❌ **Vignette** (disabled for better UX)

## 🎨 Using Ads in Your Pages

### Recommended: Unified Ad Component

```tsx
import { UnifiedAd } from '@/components/ads';

export default function MoviePage() {
  return (
    <div>
      <h1>Movie Content</h1>
      
      {/* Banner ad - rotates between networks */}
      <UnifiedAd 
        type="banner" 
        width={728} 
        height={90}
        className="my-8"
        maxNetworks={2}
        rotateNetworks={true}
      />
      
      <div>Your movie content...</div>
      
      {/* Native ad */}
      <UnifiedAd 
        type="native" 
        width={300} 
        height={250}
        className="my-4"
      />
    </div>
  );
}
```

### Individual Network Components

```tsx
import { ExoClickAd, AdsterraAd, MonetagAd } from '@/components/ads';

export default function LibraryPage() {
  return (
    <div>
      {/* ExoClick banner */}
      <ExoClickAd type="banner" width={300} height={250} />
      
      {/* Adsterra banner */}
      <AdsterraAd type="banner" width={728} height={90} />
      
      {/* Monetag banner */}
      <MonetagAd type="banner" width={300} height={250} />
    </div>
  );
}
```

## 🎯 Ad Types & Networks

| Ad Type | ExoClick | Adsterra | PopAds | Monetag |
|---------|----------|----------|---------|---------|
| Banner | ✅ | ✅ | ❌ | ✅ |
| Popunder | ✅ | ✅ | ✅ | ✅ |
| Native | ✅ | ❌ | ❌ | ❌ |
| Video | ✅ | ❌ | ❌ | ❌ |
| Push | ❌ | ✅ | ❌ | ✅ |
| Social Bar | ❌ | ✅ | ❌ | ❌ |
| Vignette | ❌ | ❌ | ❌ | ✅ |

## 💰 Revenue Optimization Features

### 1. **Smart Network Rotation**
- Rotates banner ads between networks every 30 seconds
- Improves competition and increases CPM
- Prevents ad fatigue

### 2. **Multiple Popunder Networks**
- Loads popunders from all available networks
- Maximizes popunder revenue
- Respects frequency capping

### 3. **Intelligent Fallbacks**
- If one network fails, others continue working
- Better fill rates across all geos
- Reduced revenue loss

### 4. **UX-Optimized Loading**
- 3-second delay before ad loading
- Prevents blocking page content
- Better Core Web Vitals scores

## 🔧 Configuration Options

### Environment Variables

```bash
# Enable/disable all ads
NEXT_PUBLIC_ADS_ENABLED=true

# Debug mode (shows ad info)
NEXT_PUBLIC_ADS_DEBUG=false

# Delay before loading ads (milliseconds)
NEXT_PUBLIC_ADS_DELAY=3000
```

### AdManager Configuration

```tsx
<AdManager 
  enablePopunders={true}          // Enable popunder ads
  enablePushNotifications={true}  // Enable push notifications
  enableSocialBar={false}         // Social bar (not recommended)
  enableVignette={false}          // Interstitial ads (not recommended)
/>
```

### UnifiedAd Configuration

```tsx
<UnifiedAd 
  type="banner"           // Ad type
  width={728}             // Ad width
  height={90}             // Ad height
  maxNetworks={2}         // Max networks to use
  rotateNetworks={true}   // Enable rotation
  className="my-4"        // CSS classes
/>
```

## 📊 Best Practices for Flixora

### 1. **Home Page**
```tsx
// Header banner
<UnifiedAd type="banner" width={728} height={90} className="mb-4" />

// After hero section
<UnifiedAd type="banner" width={300} height={250} className="my-8" />
```

### 2. **Movie Library**
```tsx
// Top of page
<UnifiedAd type="banner" width={728} height={90} className="mb-6" />

// Between movie rows (every 10-15 movies)
<UnifiedAd type="banner" width={300} height={250} className="my-8" />
```

### 3. **Movie Detail Pages**
```tsx
// Above movie player
<UnifiedAd type="banner" width={728} height={90} className="mb-4" />

// Sidebar
<UnifiedAd type="banner" width={300} height={250} className="my-4" />

// Below movie info
<UnifiedAd type="native" width={300} height={250} className="mt-8" />
```

## 🛡️ Security & Performance

### ✅ **Environment-Based Config**
- No hardcoded API keys in code
- Easy credential management
- Secure production deployment

### ✅ **Optimized Loading**
- Lazy loading with delays
- Non-blocking ad scripts
- Better page performance

### ✅ **Error Handling**
- Graceful fallbacks
- No broken ad containers
- Debug logging available

### ✅ **UX Focused**
- Minimal intrusive ads
- Configurable delays
- Responsive ad sizes

## 🚀 Deployment

1. **Update your VPS environment variables**
2. **Replace placeholder values with real zone IDs**
3. **Enable ads: `NEXT_PUBLIC_ADS_ENABLED=true`**
4. **Deploy to production**

Your Flixora website will now have **premium ad monetization** with optimal UX! 💰🎬
