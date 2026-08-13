# image-media-engine

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio <fabio@example.com>

## Overview

`image-media-engine` is a supreme Antigravity skill for complete digital image processing, color engineering, corporate branding identity systems (logos, Brandbooks, Pantone/CMYK/OKLCH matrices, corporate stationery, apparel/uniforms, tote bags, keepsakes, 16:9 presentation slide templates, graphic press die-lines), Product Strategy & Business Vision alignment, AI generative manipulation, portrait/model retouching, print preflight (CMYK, 3mm bleed, PDF/X), web media optimization (AVIF/WebP, DPR scaling), and seamless UI/UX component synergy with `/frontend-architect`.

## When to Use

- Creating corporate visual identity systems, logo thesis defenses, brand guidelines manuals (Brandbooks), clear space rules, stationery (business cards, letterheads, ID badges), merchandising & apparel specs (tote bags, t-shirts, silkscreen Pantone spot separations), PowerPoint 16:9 presentation templates, graphic press die-lines (facas de corte), and multi-format delivery packages (SVG, EPS, PDF, PNG @1x/@2x/@3x, WebP, CMYK TIFF).
- Building or optimizing image pipelines for web apps, e-commerce, real estate booking platforms, or marketing landing pages.
- Preparing digital artworks, catalogs, folders, flyers, and outdoor banners for commercial print or offset press.
- Performing professional photo retouching (skin frequency separation, dodge & burn, hair matting, background replacement).
- Executing AI-driven image workflows (Segment Anything/SAM, inpainting, generative fill, super-resolution upscaling, relighting, depth map rendering).
- Translating color spaces (sRGB, Display P3, CMYK, Pantone, OKLCH, HSL), working with LUTs, and preventing gamut clipping or banding.
- Integrating optimized visual assets into front-end design systems alongside `/frontend-architect`.

## Installation

### Local (workspace-scoped)

```bash
npx antigravity install image-media-engine
```

### Global (available everywhere)

```bash
npx antigravity install image-media-engine --global
```

## Usage & Triggers

This skill activates automatically on phrases such as:
- *"processamento de imagem"*
- *"branding de logomarcas"*
- *"criar brandbook manual de marca"*
- *"design de merchandising e vestimentas"*
- *"template powerpoint apresentacao de marca"*
- *"facas de corte die-line grafica"*
- *"otimizar imagem web avif webp"*
- *"preparar impressao cmyk sangria dpi"*
- *"tratamento de cor hsl oklch lut pantone"*
- *"image media engine"*

## Included Parametric Scripts

The skill includes 4 pre-built, parametric CLI scripts in `scripts/`:

```bash
# 1. Export Corporate Brand Package, Merchandising Specs, PowerPoint Master & Brandbook Manual
python .agents/skills/image-media-engine/scripts/generate-brandbook-assets.py --input logo_master.png --brand-name "Acme Corp" --primary-color "#0A2864" --accent-color "#FF6400" --output-dir ./brand_delivery

# 2. Process web assets with multi-format, DPR, and responsive breakpoints
node .agents/skills/image-media-engine/scripts/process-web-image.js --input product.jpg --output-dir ./public/assets --widths 320,640,1024,1920 --formats webp,avif --dpr 1,2

# 3. Audit and convert image for print press preflight (CMYK, 3mm bleed, PPI check)
python .agents/skills/image-media-engine/scripts/print-preflight-convert.py --input brochure.png --output-dir ./dist-print --target-ppi 300 --bleed-mm 3 --cmyk-profile FOGRA39

# 4. Batch process e-commerce packshots (auto exposure, background mask, LUT, resize)
python .agents/skills/image-media-engine/scripts/batch-image-processor.py --input-dir ./raw_products --output-dir ./processed --target-size 1080x1080
```

## Modular References

- `references/branding-identity-brandbook.md`: Corporate brand identity standards, logo design thesis defense, clear space ($X$), Pantone/CMYK/OKLCH matrices, stationery, merchandising/apparel specs, PowerPoint 16:9 templates, press die-lines (facas de corte), Brandbook PDF structure.
- `references/fundamentals-color-math.md`: Color spaces, gamma, bit depth, curves, levels, histograms, LUTs.
- `references/retouching-composition-ai.md`: Retouching, frequency separation, hair matting, AI models, depth maps, relighting.
- `references/web-performance-frontend.md`: Web formats, DPR, responsive images, `/frontend-architect` synergy.
- `references/print-preflight-production.md`: DPI/PPI, sangria/bleed 3mm, CMYK profiles, rich black, PDF/X export.
- `references/software-pipelines-code.md`: Sharp, OpenCV, Pillow, non-destructive JSON configs, OCR workflows.

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## License

[MIT](../../LICENSE)
