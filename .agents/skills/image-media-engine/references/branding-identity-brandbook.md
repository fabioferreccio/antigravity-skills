# Brand Identity Systems, Logo Geometry & Corporate Brandbook Standards

## 0. Discovery Interview & Strategic Alignment Framework
Before creating any brand identity, retouching photos, setting up press preflight, or building digital presentation decks, the agent MUST perform an interactive Discovery interview to align on expectations and avoid arbitrary assumptions:

### Discovery Pillars & Questions (PT-BR):
1. **Visão de Produto, Negócio & Modelo de Mercado**:
   - *"Qual é o modelo de negócio da empresa (B2B Enterprise, B2C Retail, SaaS, FinTech, Marketplace) e qual a proposta de valor que o produto/serviço entrega ao cliente final?"*
2. **Diferenciação Competitiva & Posicionamento**:
   - *"Como a marca deve se posicionar em relação aos concorrentes diretos (ex: mais confiável, mais veloz, mais exclusiva, mais acessível)?"*
3. **Público-Alvo & Canais de Distribuição**:
   - *"Onde esta identidade/imagem será exibida com maior frequência (ex: Aplicativo Mobile, E-commerce, Redes Sociais, Impressão Gráfica Offset, Uniformes/Eventos, Pitch Decks para Investidores)?"*
4. **Diretrizes & Restrições Pré-Existentes**:
   - *"Existem cores institucionais obrigatórias (códigos Pantone/HEX), tipografias de marca ou manual de aplicação anterior que deva ser respeitado?"*
5. **Acabamentos Gráficos & Entregáveis Finais**:
   - *"Se houver impressão/produtos físicos: há necessidade de verniz UV localizado, hot stamping ou facas de corte (die-lines)? Quais os formatos finais esperados no pacote de entrega (SVG vetorial, PNG transparente Retina, manual Brandbook em PDF, slide deck 16:9)?"*

---

## 1. Corporate Brand Identity Framework (Top-Agency Standards)
Top-tier identity agencies (Pentagram, Landor, Chermayeff & Geismar & Haviv) follow a structured methodology for brand visual identity design and brandbook delivery:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. BRAND STRATEGY & THESIS: Core positioning, archetype   │
├─────────────────────────────────────────────────────────────┤
│ 2. SYMBOLISM & LOGO GEOMETRY: Grid construction, Bézier curves│
├─────────────────────────────────────────────────────────────┤
│ 3. COLOR SYSTEM MATRIX: Pantone, CMYK, sRGB, OKLCH Tokens   │
├─────────────────────────────────────────────────────────────┤
│ 4. TYPOGRAPHY HIERARCHY: Primary font, web stack, fallback  │
├─────────────────────────────────────────────────────────────┤
│ 5. CLEAR SPACE & USAGE RULES: Minimum size, forbidden uses  │
├─────────────────────────────────────────────────────────────┤
│ 6. MULTI-CHANNEL APPLICATIONS: Web, Mobile, Print, Merch    │
├─────────────────────────────────────────────────────────────┤
│ 7. ASSET DELIVERY & BRANDBOOK EXPORT: SVG, EPS, PNG, PDF    │
└─────────────────────────────────────────────────────────────┘
```

## 2. Logo Rationale & Design Thesis Defense
When presenting a brand identity to stakeholders or clients, articulate the design thesis across 4 pillars:
1. **Symbolic Narrative**: The conceptual link between the mark's geometry and the brand's core mission (e.g. interlocking lines representing unity, ascending angle representing growth).
2. **Geometric Precision & Grid**: Construction lines using Golden Ratio ($\phi \approx 1.618$), concentric circles, grid units ($X$), and optical alignment rather than pure mechanical centering.
3. **Versatility & Scalability**: Demonstration that the mark retains legibility from a $16\times16\text{px}$ browser favicon up to a $10\text{-meter}$ outdoor billboard banner.
4. **Color Psychology & Adaptability**: Rationale behind chosen primary palette and performance across light mode, dark mode, high-contrast monochrome, and embossed physical print.

## 3. Comprehensive Color System Matrix
Every corporate brand system MUST declare exact color equivalence across 5 standard color spaces:

| Color Role | Color Name | Pantone / PMS | CMYK (Offset) | sRGB (Web) | HEX | OKLCH (Tokens) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | Royal Navy | PMS 288 C | C100 M80 Y10 K40 | R10 G40 B100 | `#0A2864` | `oklch(0.28 0.12 255)` |
| **Accent / Action** | Kinetic Orange | PMS 1505 C | C0 M65 Y100 K0 | R255 G100 B0 | `#FF6400` | `oklch(0.68 0.22 42)` |
| **Secondary** | Deep Slate | PMS 432 C | C65 M45 Y35 K75 | R30 B40 G45 | `#1E282D` | `oklch(0.24 0.03 210)` |
| **Neutral Light** | Clean Studio | Neutral 1 C | C2 M2 Y4 K0 | R245 G245 B242| `#F5F5F2` | `oklch(0.96 0.005 90)` |
| **Neutral Dark** | Charcoal Ink | PMS Black 6 C| C60 M50 Y40 K100 | R15 G15 B18 | `#0F0F12` | `oklch(0.12 0.005 270)` |

### Color Rules:
- **Pantone Spot Color (PMS)**: Mandatory for exact corporate color matching in silkscreen, offset stationery, and merchandise.
- **CMYK Total Ink Limit**: Verify TAC $\le 280\%$ for coated stock (`C100 M80 Y10 K40` = 230%).
- **OKLCH Design Tokens**: Use OKLCH in CSS design systems to ensure predictable lightness and contrast compliance in UI components with `/frontend-architect`.

## 4. Logo Clear Space (Respiro) & Minimum Scale
- **Clear Space Unit ($X$)**:
  - Define $X$ as the height or width of an iconic element in the logo (e.g. the height of the symbol or lettermark 'O').
  - Enforce a minimum clear space of $1X$ or $1.5X$ around all sides of the logo where no other graphics, typography, or edges may enter.
- **Minimum Legibility Size**:
  - *Digital (Web/Mobile)*: Full Logo with Tagline $\ge 120\text{px}$ width; Primary Logo $\ge 80\text{px}$ width; Symbol Icon $\ge 16\times16\text{px}$ favicon.
  - *Print Press*: Full Logo $\ge 25\text{ mm}$ width; Symbol Icon $\ge 8\text{ mm}$ width.

## 5. Correct & Incorrect Logo Applications (Do's & Don'ts)
- **Approved Variants**:
  1. *Primary Full Color*: For white/light backgrounds.
  2. *Reverse White*: For dark backgrounds or dark imagery.
  3. *Monochrome Black*: For single-ink print, receipts, or fax documents.
  4. *Monochrome White*: For solid dark surfaces, laser engraving, or embossing.
- **Forbidden Practices (Don'ts)**:
  - ❌ NEVER stretch, distort, or alter aspect ratio.
  - ❌ NEVER change designated brand colors or assign unapproved gradients.
  - ❌ NEVER place logo over busy or low-contrast photographic backgrounds without a scrim.
  - ❌ NEVER add drop shadows, outer glows, bevels, or outlines to the logo mark.
  - ❌ NEVER rearrange or alter the spatial distance between symbol and logotype.

## 6. Corporate Collateral, Merchandise & Apparel Standards
A professional identity system extends to physical corporate items, employee apparel, and promotional keepsakes:

### 6.1 Corporate Stationery System
- **Business Cards (Cartão de Visita)**:
  - Standard format: $90\times 50\text{ mm}$ or $85\times 55\text{ mm}$ + 3mm bleed. Paper stock: 350g Matte/Couché with soft-touch lamination.
  - Front: Minimalist logo symbol + primary brand background. Back: Employee name ($10\text{pt}$ bold), title ($8\text{pt}$), contact details ($7.5\text{pt}$ K=100%).
- **Letterhead (Papel Timbrado)**:
  - Standard format: A4 ($210\times 297\text{ mm}$) with $15\text{mm}$ margins. Logo placed top-left ($35\text{mm}$ wide). Footer contains legal company registration + address in $7\text{pt}$ neutral gray.
- **Envelopes (DL, C5, C4)**:
  - Return address and logo positioned top-left with $10\text{mm}$ clear space margin.
- **ID Badges & Lanyards (Crachás & Cordões)**:
  - Vertical card: $54\times 86\text{ mm}$. Photo size: $25\times 30\text{ mm}$. Lanyard woven text: repeated logo mark with $2X$ spacing.

### 6.2 Apparel & Merchandise (Vestimentas, Bolsas & Brindes)
- **Tote Bags & Fabric Bags (Bolsas de Pano)**:
  - Screen printing (Silkscreen) application. Single-color or 2-color spot Pantone ink (PMS). Vector logo centered at $180\text{mm}$ width.
- **T-Shirts & Uniforms (Camisetas & Uniformes)**:
  - Chest pocket mark: $45\text{mm}$ width on left chest. Back print: $220\text{mm}$ width centered.
  - Embroidery specs: Minimum line weight $1.2\text{mm}$, minimum text height $5\text{mm}$ to prevent thread distortion.
- **Corporate Keepsakes (Mugs, Pens, Water Bottles)**:
  - Water Bottles / Mugs: Laser engraving or Pad Printing (Tampografia). Single-color monochrome vector.
  - Pens: Pad printing on barrel with maximum height of $4.5\text{mm}$.

## 7. Digital Presentation Templates (PowerPoint / Keynote / Google Slides)
Every brand system MUST provide a 16:9 master slide template deck:

- **Aspect Ratio**: 16:9 Widescreen ($1920\times 1080\text{px}$ or $38.1\times 21.33\text{ cm}$).
- **Master Slide Layouts**:
  1. *Title Slide (Capa)*: Primary brand color background, large $48\text{pt}$ bold title, $24\text{pt}$ subtitle, top-left logo.
  2. *Section Divider (Divisor)*: Accent color background or dark neutral, centered single key phrase.
  3. *Content & Bullets (Conteúdo)*: Light neutral background, header title ($28\text{pt}$), 2-column or 3-card grid container, footer logo ($20\text{mm}$ width) + slide page number.
  4. *Data & Graph Slide (Gráficos)*: Chart colors strictly mapped to brand color palette sequence (Primary $\rightarrow$ Accent $\rightarrow$ Secondary $\rightarrow$ Neutral).
  5. *Closing / Thank You Slide*: Central logo + contact channels + website URL.

## 8. Technical Press & Supplier Specifications (Instruções para Gráfica)
Provide graphic suppliers with production-ready vector layers and finishing guides:

- **Die-Lines / Facas de Corte & Vincos**:
  - Store cutting lines on a separate layer named `DIE-LINE` / `FACA DE CORTE` set to a $100\%$ Magenta Spot Color assigned to `Overprint Stroke`.
  - Differentiate Fold/Crease lines (dashed line) from Cut lines (solid line).
- **Spot UV Varnish & Hot Stamping (Verniz Localizado & Foil Stamping)**:
  - Store foil or UV varnish shapes on an isolated vector layer named `HOT STAMPING` or `SPOT UV`.
  - Color set to $100\%$ K Black assigned to `Overprint Fill`.
- **Silkscreen Color Separations**:
  - Output individual vector spot color channels (100% K per screen pass) with crosshair registration marks on all 4 corners.

## 9. Standard Corporate Brandbook Structure (PDF Generation Blueprint)
A complete client-facing Brand Identity Manual should contain the following section breakdown:

1. **Cover & Introduction**: Brand Name, Version 1.0, Release Date, Table of Contents.
2. **Brand Story & Strategy**: Mission, Vision, Tone of Voice, Design Rationale.
3. **Primary & Secondary Logos**: Mark construction grid, clear space ($X$), minimum size.
4. **Logo Variations**: Full-color, Reverse, Monochrome Black/White, Symbol Icon.
5. **Color System & Palette**: Pantone, CMYK, sRGB, HEX, OKLCH, contrast accessibility matrix.
6. **Typography System**: Primary brand typeface, web font stack, font hierarchy ($H1-H6$, Body, Caption).
7. **Corporate Stationery**: Business cards, letterheads, envelopes, ID badges.
8. **Apparel & Merchandise**: Tote bags, uniforms, mugs, pens, silkscreen specs.
9. **Presentation Templates**: PowerPoint/Keynote 16:9 master slides & layout grids.
10. **Technical Press Specs**: Die-lines, spot UV, hot stamping, silkscreen spot color rules.
11. **Incorrect Usage (Don'ts)**: Visual examples of forbidden logo mutations.
12. **Asset Deliverables Index**: File format directory guide for client teams.

## 10. Asset Master Delivery Package Matrix

Every logo project delivery MUST provide the client with a structured directory of asset formats:

```text
brand-identity-delivery/
├── 01_Vector_Master/            (Editable vector formats)
│   ├── logo_primary.svg          (Clean SVG for Web/Code)
│   ├── logo_primary.pdf          (Vector PDF for Print)
│   └── logo_primary.eps          (Vector EPS for Press/Illustrator)
├── 02_Digital_Web_App/          (RGB Lossless & Compressed)
│   ├── logo_primary_transparent.png  (@1x, @2x, @3x Retina)
│   ├── logo_reverse_transparent.png  (@1x, @2x, @3x Retina)
│   ├── logo_primary.webp             (Web Optimized)
│   └── favicon_symbol.svg            (Icon Favicon)
├── 03_Print_Production/         (CMYK High Resolution 300 PPI & Die-Lines)
│   ├── logo_cmyk_primary.tif     (Uncompressed CMYK TIFF)
│   ├── logo_cmyk_monochrome.pdf  (Single Ink K=100%)
│   └── business_card_dieline.pdf (Vector Die-Line Spot Layer)
├── 04_Stationery_Merchandise/   (Mockup & Production Vector Guides)
│   ├── business_card_master.pdf  (Ready for press 90x50mm + 3mm bleed)
│   ├── letterhead_a4_master.pdf  (Ready for print A4)
│   └── apparel_silkscreen_spec.pdf (Spot Pantone color separations)
├── 05_Presentation_Templates/   (PowerPoint & Master Slides)
│   └── brand_presentation_master_16x9.pptx (or HTML/SVG slides)
└── 06_Brandbook/                (Client Documentation)
    └── Brand_Guidelines_Manual.pdf (Complete PDF Manual)
```
