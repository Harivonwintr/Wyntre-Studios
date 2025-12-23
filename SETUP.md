# Setup Instructions

## Asset Migration

Your existing `assets/` folder needs to be copied to the `public/` directory in the Next.js project.

### Required Structure:

```
public/
  assets/
    logo.svg
    hero/
      hero-placeholder.png
    case1.png
    case2.png
    campaign1.png
    campaign2.png
    campaign3.png
    campaign4.png
    campaign5.png
    campaign6.png
    clients/
      nivea.png
      starbucks.png
      spotify.png
      nescafe.png
      realmadrid.png
      subway.png
      visa.png
      donjulio.png
      pmi.png
      mcdonalds.png
      ibis.png
      comfort.png
      tork.png
      publicis.png
      discovery.png
      oldmutual.png
      fnb.png
      mtn.png
      springboks.png
      playgirl.png
    what-drives-photo.png
```

### Steps:

1. Copy your entire `assets/` folder to `public/assets/` in the Next.js project
2. Ensure all image paths match (case-sensitive)
3. Update video URLs in `data/workItems.ts` with actual video URLs

## Video URLs

Update the `videoUrl` field in `data/workItems.ts` with your actual video URLs. These can be:
- Direct MP4 URLs
- YouTube/Vimeo embed URLs
- Any video hosting service URLs

The modal will handle HTML5 video playback or you can extend it to support embeds.

## Running the Project

1. Install dependencies: `npm install`
2. Copy assets to `public/assets/`
3. Update video URLs in `data/workItems.ts`
4. Run dev server: `npm run dev`
5. Open http://localhost:3000

## Notes

- All CSS is preserved exactly as-is
- Images use Next/Image for optimization
- Videos lazy-load only when modal opens
- Deep links work: `/work/[slug]` opens modal automatically
- Keyboard navigation: ESC closes, arrows navigate

