# Web Media Optimization & Synergy with `/frontend-architect`

## 1. Web Image Formats & Codecs
- **AVIF (AV1 Image Format)**: Next-gen codec offering up to 50% smaller file sizes than WebP at equivalent visual quality. Supports 10/12-bit color, HDR, and alpha channel.
- **WebP**: Modern default web format with universal browser support. Supports lossy, lossless, alpha transparency, and animated assets.
- **PNG**: Lossless format reserved for UI graphics, technical line drawings, stickers, and crisp transparent logos when vector SVG is unavailable.
- **JPEG**: Legacy photography format. Lacks alpha channel transparency and exhibits ringing artifacts around high-contrast text edges.

## 2. Responsive Images & Device Pixel Ratio (DPR)
- **CSS Pixels vs Physical Pixels**:
  - High-density displays (Retina/HiDPI) render 2x or 3x physical pixels per CSS pixel.
  - A card sized `400px` wide on a 2x DPR display requires an image asset of `800px` width to prevent blurriness.
- **Responsive Markup Pattern (`<picture>` and `srcset`)**:
```html
<picture>
  <!-- AVIF next-gen format with DPR srcset -->
  <source
    type="image/avif"
    srcset="product-400w.avif 1x, product-800w.avif 2x, product-1200w.avif 3x"
    sizes="(max-width: 768px) 100vw, 400px"
  />
  <!-- WebP fallback with DPR srcset -->
  <source
    type="image/webp"
    srcset="product-400w.webp 1x, product-800w.webp 2x, product-1200w.webp 3x"
    sizes="(max-width: 768px) 100vw, 400px"
  />
  <!-- Standard fallback image -->
  <img
    src="product-400w.jpg"
    alt="Product packshot"
    width="400"
    height="400"
    loading="lazy"
    decoding="async"
    style="aspect-ratio: 1 / 1; object-fit: cover;"
  />
</picture>
```

## 3. Web Performance & Core Web Vitals
- **LCP (Largest Contentful Paint)**: Hero images MUST NOT use `loading="lazy"`. Use `fetchpriority="high"` and `<link rel="preload">`.
- **CLS (Cumulative Layout Shift)**: ALWAYS specify explicit `width` and `height` attributes or CSS `aspect-ratio` to reserve layout space prior to image download.
- **Color Profile Enforcement**: Convert web images to **sRGB** color profile during export to ensure uniform color rendering across non-wide-gamut browsers and displays.

## 4. Synergy with `/frontend-architect`
- **Design Tokens & OKLCH Color Systems**:
  - Compute overlay text badges and fallback placeholders using OKLCH colors for guaranteed visual harmony.
  - Enforce WCAG 2.2 AA (minimum 4.5:1 ratio) contrast for any text layered over product/hero images using linear gradient scrim overlays (`background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)`).
- **E-Commerce & Real Estate Booking Media Consistency**:
  - Enforce strict aspect ratio standardization (1:1 for product packshots, 4:3 for real estate gallery cards, 16:9 for heroes, 9:16 for mobile stories).
  - Normalize padding around products (e.g. 10% whitespace padding in 1:1 canvas) across all batch items.
