# Wyntre Studios Website

A Next.js rebuild of the Wyntre Studios website, preserving the exact design and CSS from the original HTML/CSS implementation.

## Features

- **Next.js App Router** - Modern React framework with server components
- **Pixel-perfect design** - Preserves exact CSS and layout from original
- **Work Grid & Video Modal** - Interactive work showcase with modal popups
- **Deep linking** - Each work item has its own route (`/work/[slug]`)
- **Accessibility** - ESC to close, focus trap, keyboard navigation
- **Performance** - Lazy-loaded videos, Next/Image optimization

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy your assets folder to the `public` directory:
```bash
# Your assets should be in public/assets/
# This includes:
# - public/assets/logo.svg
# - public/assets/hero/hero-placeholder.png
# - public/assets/case1.png, case2.png
# - public/assets/campaign1.png through campaign6.png
# - public/assets/clients/*.png
# - public/assets/what-drives-photo.png
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx             # Home page
│   ├── work/
│   │   ├── page.tsx         # Work listing page
│   │   └── [slug]/
│   │       └── page.tsx     # Individual work item page
│   └── globals.css         # All original CSS preserved
├── components/
│   ├── Nav.tsx              # Navigation component
│   ├── Hero.tsx             # Hero section
│   ├── WorkGrid.tsx         # Work grid with click handlers
│   ├── VideoModalCard.tsx   # Modal with video player
│   └── Footer.tsx           # Footer component
├── data/
│   └── workItems.ts        # Work item metadata
└── hooks/
    ├── useScrollAnimations.ts  # IntersectionObserver animations
    └── useTiltCard.ts          # Tilt card hover effects
```

## Work Items Data

Edit `data/workItems.ts` to update work item metadata. Each item includes:
- Client, campaign, year
- Campaign type, role, scope
- Markets, delivery info
- Challenge description
- Video URL and poster image
- Unique slug for routing

## Notes

- All CSS is preserved exactly as-is in `app/globals.css`
- Images use Next/Image for optimization
- Videos are lazy-loaded only when modal opens
- Modal supports keyboard navigation (arrows, ESC)
- Deep links work: `/work/[slug]` opens the modal automatically

## Build for Production

```bash
npm run build
npm start
```

