# Pentagram/Landor Agency Standard: 10-Page PDF Brandbook & Digital Ecosystem Manual

## 1. Overview & Architectural Blueprint
This reference guide defines the 10-page 16:9 Widescreen Pentagram/Landor Agency Standard for Brandbook presentation manuals. All PDF exports MUST be compiled programmatically using `python scripts/export-brandbook-pdf.py` with 300 DPI high resolution without requiring any manual browser "Ctrl+P" steps.

```
┌─────────────────────────────────────────────────────────────┐
│ PAGE 01: COVER SLIDE (Dark Navy, Title, Tagline, Manual)   │
├─────────────────────────────────────────────────────────────┤
│ PAGE 02: BRAND STRATEGY & COLORS (White, Positioning, Hex)  │
├─────────────────────────────────────────────────────────────┤
│ PAGE 03: BUSINESS CARDS MOCKUP & SPECS (Hot Stamping Foil)  │
├─────────────────────────────────────────────────────────────┤
│ PAGE 04: CORPORATE STATIONERY MOCKUP & SPECS (Folder/Note)  │
├─────────────────────────────────────────────────────────────┤
│ PAGE 05: MERCHANDISE & KEEPSAKES (Leather Keychain)         │
├─────────────────────────────────────────────────────────────┤
│ PAGE 06: DIGITAL ECOSYSTEM FUNNEL (5-Stage Marketing Funnel)│
├─────────────────────────────────────────────────────────────┤
│ PAGE 07: WEBSITE PROTOTYPE MOCKUP (Desktop Workstation)     │
├─────────────────────────────────────────────────────────────┤
│ PAGE 08: INSTAGRAM PROTOTYPE MOCKUP (iPhone 15 Pro Feed)    │
├─────────────────────────────────────────────────────────────┤
│ PAGE 09: MEETING SLIDE DECK TEMPLATE (16:9 Laptop Widescreen│
├─────────────────────────────────────────────────────────────┤
│ PAGE 10: PRODUCTION APPROVAL & CLOSING (Copyright 2026)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 10-Page Structure Breakdown

### Page 01: Cover Slide
- **Background**: Primary Brand Color (e.g. Dark Navy `#0A192F`).
- **Typography**: Large bold white title, Gold accent tagline, "Brandbook & Ecossistema Digital - Manual Corporativo para Investidores".
- **Master Logo**: Embedded approved vector mark.

### Page 02: Brand Strategy & Official Colors
- **Background**: Pristine White (`#FFFFFF`).
- **Section Header**: "1. A Estratégia da Marca".
- **Color Cards Grid**: 4 color swatch cards showing Primary Navy, Secondary Slate, Accent Gold, and Monochrome Black with exact HEX, sRGB, and CMYK codes.

### Page 03: Business Cards Mockup & Specifications
- **Split Layout**:
  - *Left Panel*: Specifications (350g imported matte paper, Hot Stamping Silver/Gold foil application, 90x50mm + 3mm bleed, UV spot varnish).
  - *Right Panel*: Photorealistic 3D mockup of business card with foil stamping on stone/leather background.

### Page 04: Corporate Stationery (Papelaria Corporativa)
- **Split Layout**:
  - *Left Panel*: Specifications (Textured folders with fold lines, A4 120g letterheads, custom envelopes).
  - *Right Panel*: Photorealistic 3D mockup of leather folder, hardbound notebook, and metal pen.

### Page 05: Merchandise & Closing Keepsakes (Brindes & Fechamento)
- **Split Layout**:
  - *Left Panel*: Specifications (Genuine stitched leather keychains, chrome metal hardware, laser/embossed branding).
  - *Right Panel*: Photorealistic 3D mockup of leather keychain with key ring.

### Page 06: Digital Ecosystem Funnel (Ecossistema Web)
- **Background**: Pristine White (`#FFFFFF`).
- **5-Stage Conversion Funnel**:
  1. Home Hero Banner (Authority promise).
  2. Portfolio (Curated filters & ROI calculation).
  3. Relocation & Visas (International investor focus).
  4. About & Authority (Track record & team).
  5. VIP Contact (Conciergerie lead qualification).

### Page 07: Website Prototype Mockup
- **Split Layout**:
  - *Left Panel*: Website specifications & `/frontend-architect` synergy.
  - *Right Panel*: Photorealistic 3D desktop monitor mockup displaying the luxury web prototype.

### Page 08: Instagram Profile & Feed Mockup
- **Split Layout**:
  - *Left Panel*: Social strategy & editorial line (High-yield ROI & lifestyle focus).
  - *Right Panel*: Photorealistic 3D iPhone 15 Pro mockup displaying the official Instagram grid feed.

### Page 09: Meeting Deck Presentation Template
- **Split Layout**:
  - *Left Panel*: 16:9 Widescreen slide deck specifications.
  - *Right Panel*: Photorealistic 3D laptop mockup displaying executive meeting slides.

### Page 10: Production Approval & Copyright Closing
- **Background**: Secondary Slate/Light Grey (`#E2E8F0`).
- **Typography**: "Aprovado para Produção", Brand Copyright 2026, closing tagline.

---

## 3. Programmatic PDF Compilation Command

To compile this 10-page PDF automatically:

```bash
python scripts/export-brandbook-pdf.py --brand-name "Manuela" --tagline "Corretora de Imóveis" --logo 01_Vector_Master/logo_primary.svg --output-pdf 06_Brandbook/Brandbook_Guidelines_Manual.pdf
```
