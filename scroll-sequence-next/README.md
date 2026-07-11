# Scroll Sequence Next.js Demo

A minimal Next.js + GSAP ScrollTrigger example that maps scroll progress to a PNG frame sequence rendered to a canvas.

Setup:

```bash
npm install
npm run dev
```

Drop your frames into `/public/sequence/frame_0001.png` ... `frame_0300.png` and update `frameCount` in `app/page.tsx` if needed.

Notes:
- This demo uses a conservative auto-detect method to find available frames. For large sequences consider building a manifest file listing frame count for faster load.
- The canvas renderer uses devicePixelRatio for Retina support and requestAnimationFrame for smooth interpolation.
