# ExoClick Setup Guide

## 1. Configure Zone IDs

From your ExoClick dashboard, copy your zone IDs and update your `.env.local` file:

```bash
# ExoClick Configuration
NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID=your_actual_publisher_id
NEXT_PUBLIC_EXOCLICK_BANNER_ZONE=your_actual_banner_zone_id  # ← Replace this with your real banner zone ID
NEXT_PUBLIC_EXOCLICK_POPUNDER_ZONE=your_actual_popunder_zone_id
NEXT_PUBLIC_EXOCLICK_NATIVE_ZONE=your_actual_native_zone_id
NEXT_PUBLIC_EXOCLICK_VIDEO_ZONE=your_actual_video_zone_id
```

## 2. Client Hints Meta Tag

✅ **Already Added**: The Client Hints meta tag for ExoClick's ad serving domain (`https://s.magsrv.com`) has been added to the layout.tsx file.

## 3. Zone Tag Types

For ExoClick banner zones, our integration uses:
- **Asynchronous Script** (Recommended) ✅
- **Ad serving domain**: `https://s.magsrv.com` ✅
- **Client Hints enabled** ✅

## 4. Testing

To test your ExoClick ads:

1. Update your `.env.local` with real zone IDs
2. Enable debug mode: `NEXT_PUBLIC_ADS_DEBUG=true`
3. Restart your development server: `npm run dev`
4. Check browser console for ad loading logs
5. Verify ads appear on pages (home, library, movie details)

## 5. Current Ad Placements

ExoClick banner ads are currently placed on:
- **Home page**: After hero section and before CTA
- **Library page**: After search/filter section and between movie grids
- **Movie detail page**: After movie header and in sidebar

## 6. Zone Configuration Notes

- **Banner zones**: Use the main banner zone ID for 728x90, 300x250, and other banner formats
- **Popunder zones**: Separate zone ID for popunder ads
- **Native zones**: For native content-style ads
- **Video zones**: For video advertisement content

## 7. Revenue Optimization

- Enable multiple ad types (banner + popunder) for maximum revenue
- Test different ad placements and frequencies
- Monitor performance in ExoClick dashboard
- Consider A/B testing different zone configurations
