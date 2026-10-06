# Example 3: Corporate Brand Identity, Stationery, Apparel & Brandbook Delivery

## Scenario
A tech startup ("Nexura Systems") requires creating their complete visual brand identity system: defending the logo geometry and design thesis, constructing the color matrix (Pantone, CMYK, sRGB, OKLCH), exporting stationery specs (business cards, letterheads), apparel silkscreen guides (tote bags, t-shirts), 16:9 PowerPoint presentation master templates, and building a client Brandbook manual in PDF/HTML.

## 1. Design Thesis & Symbol Rationale

1. **Symbolic Narrative**:
   - The logo mark combines the letterform 'N' with an ascending $45^\circ$ vector arrow, symbolizing forward momentum and high-performance cloud architecture.
2. **Geometric Grid**:
   - Built on an isometric $60^\circ$ grid with concentric stroke radius of $2X$.
   - Optical alignment applied to center of visual mass rather than bounding box.

## 2. Color System Matrix

- **Primary Brand (Deep Cyber Navy)**: `#0A1931` | `RGB(10, 25, 49)` | `CMYK(100, 85, 35, 60)` | `Pantone 296 C` | `oklch(0.22 0.08 250)`
- **Accent Brand (Vibrant Teal)**: `#00E5FF` | `RGB(0, 229, 255)` | `CMYK(75, 0, 10, 0)` | `Pantone 305 C` | `oklch(0.82 0.18 195)`
- **Neutral Surface**: `#F8FAFC` | `RGB(248, 250, 252)` | `CMYK(2, 1, 0, 0)` | `oklch(0.98 0.005 240)`

## 3. Physical Application Specs (Stationery & Merchandising)

- **Business Card (Cartão de Visita)**: $90\times 50\text{ mm}$ + 3mm bleed. Paper: 350g Couché Matte with soft-touch lamination. Spot UV Varnish layer assigned to Overprint Fill.
- **Tote Bags & Shirts (Bolsas & Camisetas)**: Silkscreen 2-color spot Pantone inks (`PMS 296 C` + `PMS 305 C`). Chest logo: $45\text{mm}$ width. Tote bag logo: $180\text{mm}$ width.
- **Presentation Deck (PowerPoint 16:9)**: Master slides in 16:9 aspect ratio ($1920\times 1080\text{px}$) with dedicated Title, Divider, Content Grid, and Data Chart slide layouts.

## 4. Brand Asset Delivery Pipeline Execution

Run the skill's parametric brand generator script to export all master formats and build the HTML/PDF Brandbook manual:

```bash
python .agents/skills/image-media-engine/scripts/generate-brandbook-assets.py \
  --input ./masters/nexura_logo_master.png \
  --brand-name "Nexura Systems" \
  --primary-color "#0A1931" \
  --accent-color "#00E5FF" \
  --output-dir ./dist/nexura_brand_package
```

## 5. Generated Package Tree

```text
dist/nexura_brand_package/
├── 01_Vector_Master/
│   ├── logo_primary.svg
│   ├── logo_primary.pdf
│   └── logo_primary.eps
├── 02_Digital_Web_App/
│   ├── logo_primary.png
│   ├── logo_primary@2x.png
│   ├── logo_primary@3x.png
│   ├── logo_primary.webp
│   ├── logo_reverse_white.png
│   └── favicon_symbol.svg
├── 03_Print_Production/
│   ├── logo_cmyk_master_300ppi.tif
│   └── logo_monochrome_black.png
├── 04_Stationery_Merchandise/
│   ├── business_card_spec.pdf
│   └── apparel_silkscreen_spec.pdf
├── 05_Presentation_Templates/
│   └── master_presentation_template_16x9.html
└── 06_Brandbook/
    └── Brandbook_Guidelines_Manual.html
```
