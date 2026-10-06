# Print Preflight, Graphic Production & Physical Media Standards

## 1. Resolution & Distance Math (PPI vs DPI)
- **PPI (Pixels Per Inch)**: Digital image pixel density ($PPI = \frac{\text{Pixels}}{\text{Inches}}$).
- **DPI (Dots Per Inch)**: Physical printing press ink droplet density.
- **Viewing Distance Standard Table**:

| Physical Medium | Typical Distance | Target Effective PPI | Minimum Acceptable PPI |
| :--- | :--- | :--- | :--- |
| Business Card, Flyer, Folder | $30\text{ cm} - 50\text{ cm}$ | 300 PPI | 240 PPI |
| Magazine, Catalog, Book | $30\text{ cm} - 60\text{ cm}$ | 300 PPI | 266 PPI |
| Poster, Indoors Banner | $1\text{ m} - 2\text{ m}$ | 150 - 200 PPI | 100 PPI |
| Billboard, OOH Outdoor | $5\text{ m} - 20\text{ m}+$ | 30 - 72 PPI | 18 PPI |

$$\text{Required Pixels} = \text{Dimension (cm)} \div 2.54 \times \text{Target PPI}$$

## 2. Sangria / Bleed & Safety Margins
- **Sangria / Bleed**: Extension of background artwork beyond the final trim line (cut edge) to prevent unprinted white edges caused by mechanical paper shifts.
  - Standard Bleed: **3.0 mm** on all 4 sides (5.0 mm for large format/packaging).
- **Safety Margin (Margem de Segurança)**: Interior boundary keeping text, logos, and critical content inside the trim line.
  - Standard Safety Margin: **3.0 mm to 5.0 mm** inside trim line.

```text
┌──────────────────────────────────────────────────────────┐  ← Bleed Line (Cut + 3mm)
│  Background color/image extends to this outer edge       │
│  ┌────────────────────────────────────────────────────┐  │  ← Trim Line (Final Size)
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────────┐  │  │  ← Safety Line (Text stays inside)
│  │  │ Text, logos, and critical contents here       │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 3. CMYK Color Conversion & Black Management
- **RGB to CMYK Profile Conversion**:
  - NEVER perform naive RGB $\rightarrow$ CMYK conversion without assigning the printing house's specific ICC profile (e.g. `FOGRA39`, `FOGRA51`, `GRACoL2006`, `US Web Coated SWOP v2`).
- **Rich Black vs Simple Black**:
  - **Simple Black (Preto Puro)**: $C=0\%, M=0\%, Y=0\%, K=100\%$. MANDATORY for small typography ($< 14\text{pt}$), fine lines, barcodes, and technical vectors to avoid color fringing from registration misalignments.
  - **Rich Black (Preto Rico/Composto)**: $C=60\%, M=40\%, Y=40\%, K=100\%$ (Total Ink Coverage = 240%). Recommended for large black backgrounds and solid shapes to achieve deep, glossy black density without exceeding total ink limit (TAC $\le 300\%$).

## 4. Preflight Audit Checklist (PDF/X Standard)
Before releasing assets for offset or digital print production, verify:
- [ ] **Physical Dimensions**: Document dimensions match exact specs + 3mm bleed.
- [ ] **Effective PPI**: All raster images exhibit $\ge 300$ PPI at 100% scale.
- [ ] **Color Mode**: All images and vector elements converted to target CMYK ICC profile. Zero RGB or Lab objects remaining.
- [ ] **Typography**: All fonts embedded or converted to vector outlines (curves/Bézier).
- [ ] **Transparency Flattening**: Transparencies flattened or exported using PDF/X-4 standard preserving vector text layers.
- [ ] **Overprint & Knockout**: Black body text set to `Overprint Black` to avoid white gaps underneath.
- [ ] **PDF Export Compliance**: Export target set to `PDF/X-1a:2001` or `PDF/X-4:2010`.
