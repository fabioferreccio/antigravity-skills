# Example 1: Web E-Commerce Packshot Pipeline & Synergy with `/frontend-architect`

## Scenario
An e-commerce clothing brand requires processing 500 raw product photos into responsive web assets (WebP/AVIF), normalized on a 1:1 canvas with 10% whitespace padding, and building a React product card component integrated with `/frontend-architect` standards.

## 1. Batch Asset Processing Execution

Run the skill's built-in parametric script to normalize and export multi-format responsive assets:

```bash
# Step A: Batch normalize raw packshots to 1080x1080 1:1 canvas
python .agents/skills/image-media-engine/scripts/batch-image-processor.py \
  --input-dir ./raw_packshots \
  --output-dir ./public/assets/products \
  --target-size 1080x1080 \
  --padding-pct 10 \
  --bg-color "#FFFFFF"

# Step B: Generate WebP and AVIF responsive breakpoints with DPR @1x, @2x
node .agents/skills/image-media-engine/scripts/process-web-image.js \
  --input ./public/assets/products/shirt_01.jpg \
  --output-dir ./public/assets/products/optimized \
  --widths 320,640,1024 \
  --formats webp,avif \
  --dpr 1,2 \
  --quality 80
```

## 2. React UI Component (Integrated with `/frontend-architect`)

```tsx
import React from 'react';

interface ProductCardProps {
  id: string;
  title: string;
  priceFormatted: string;
  badgeText?: string;
  baseAssetPath: string; // e.g. "/assets/products/optimized/shirt_01"
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  priceFormatted,
  badgeText,
  baseAssetPath,
}) => {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-zinc-900">
      {/* Aspect 1:1 Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <picture>
          <source
            type="image/avif"
            srcSet={`
              ${baseAssetPath}-320w.avif 320w,
              ${baseAssetPath}-320w@2x.avif 640w,
              ${baseAssetPath}-640w.avif 640w,
              ${baseAssetPath}-640w@2x.avif 1280w
            `}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          />
          <source
            type="image/webp"
            srcSet={`
              ${baseAssetPath}-320w.webp 320w,
              ${baseAssetPath}-320w@2x.webp 640w,
              ${baseAssetPath}-640w.webp 640w,
              ${baseAssetPath}-640w@2x.webp 1280w
            `}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          />
          <img
            src={`${baseAssetPath}-320w.jpg`}
            alt={title}
            width={320}
            height={320}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </picture>

        {badgeText && (
          <span className="absolute top-3 left-3 rounded-full bg-zinc-900/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm dark:bg-white/90 dark:text-zinc-900">
            {badgeText}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-4 flex flex-col justify-between gap-1">
        <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">
          {title}
        </h3>
        <p className="text-base font-bold text-zinc-900 dark:text-white">
          {priceFormatted}
        </p>
      </div>
    </article>
  );
};
```
