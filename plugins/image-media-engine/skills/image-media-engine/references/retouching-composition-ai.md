# High-End Retouching, Composition, Hair Matting & AI Workflows

## 1. Professional Portrait & Model Retouching
- **Frequency Separation**:
  - *Low Frequency Layer*: Contains color, tone, and smooth transitions (Gaussian Blur applied).
  - *High Frequency Layer*: Contains texture, pores, fine hair, and sharp details (High Pass filter or subtract method).
  - *Workflow*: Tweak tone and smooth blotchiness on the Low Frequency layer without blurring skin pores or texture on High Frequency layer.
- **Dodge & Burn (D&B)**:
  - Localized lightening (Dodge) and darkening (Burn) using non-destructive curves or 50% gray overlay layers.
  - Used to contour facial anatomy, pop cheekbones, smooth skin transitions, and carve highlights on clothing folds.
- **Liquify & Body Contour**:
  - Subtle anatomical adjustments (posture alignment, hair volume boost, clothing crease reduction).
  - *Constraint*: Avoid distorting straight background lines, architectural pillars, or facial features that define personal identity.
- **Blemish Removal**:
  - Remove temporary acne, stray hairs, and sensor dust using Healing Brush or Spot Healing. Preserve permanent beauty marks, moles, and structural facial lines unless explicitly instructed.

## 2. Background Removal & Alpha Matting
- **Alpha Channel Formats**:
  - Straight Alpha: Color RGB values are stored independently of Alpha.
  - Premultiplied Alpha: RGB values are pre-multiplied by the Alpha value ($RGB_{stored} = RGB_{color} \times A$). Can cause dark or light fringes/halos if composited incorrectly.
- **Hair Matting & Edge Decontamination**:
  - Fine hair fibers hold mixed pixels ($Color_{hair} + Color_{background}$).
  - *Decontamination*: Replace background color fringing along boundary pixels with surrounding hair color while preserving delicate alpha transparency transitions.
  - *Testing Protocol*: ALWAYS test transparent cutouts against pure white (`#FFFFFF`) and pure black (`#000000`) backgrounds to verify zero edge haloing.

## 3. Photographic Composition & Lighting Match
- **Lighting Integration Checklist**:
  1. *Light Direction*: Align key light, fill light, and rim light angles between subject and new background.
  2. *Light Hardness/Softness*: Match shadow edge sharpness (hard sun vs soft ambient diffusion).
  3. *Color Temperature*: Match White Balance / Kelvin degrees ($\Delta K$) across all foreground elements and background.
  4. *Shadow Construction*:
     - *Contact Shadow*: Very dark, sharp, narrow shadow where subject meets surface.
     - *Cast/Projected Shadow*: Softer, fading shadow directional with key light source.
- **Perspective Warp & Depth**:
  - Align horizon line and vanishing points of subjects, mockups, billboards, real estate rooms, or product packshots.
  - *Depth Map & Simulated Bokeh*: Render a depth pass (foreground clear, background gradient blur) using depth-guided Gaussian or Lens Blur to match lens aperture ($f/1.4 - f/2.8$).
  - *Noise/Grain Matching*: Add controlled film grain/monochrome noise to composited subjects so noise floor matches background sensor noise.

## 4. AI-Driven Visual Workflows
- **SAM (Segment Anything Model)**: Precise promptable zero-shot semantic segmentation for subjects, hair, garments, products, and backgrounds.
- **Inpainting & Object Removal**: Reconstruct removed areas using diffusion-based context synthesis.
- **Generative Expand / Outpainting**: Extend canvas aspect ratios (e.g. 1:1 square to 9:16 vertical story) while synthesizing plausible background continuation.
- **Super-Resolution / Upscaling**: AI detail inference (e.g. Real-ESRGAN, SwinIR). *Requirement*: Inspect output at 100% zoom to verify absence of hallucinatory artifacts, teeth distortion, or unnatural skin patterns.
- **Relighting**: Depth-guided lighting synthesis to alter key light placement, intensity, and specular highlights dynamically.
- **Stylization & Vectorization**:
  - *Cartoonization & Cel Shading*: Quantize color tones, apply edge detection (Sobel/Canny), posterize levels, and outline vectors.
  - *Bézier Vectorization*: Convert high-contrast raster logos into clean Bézier path nodes with proper anti-aliasing control.
