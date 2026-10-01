# High-Precision Bitmap-to-SVG Vectorization Pipeline

This example demonstrates the generic high-precision image vectorization workflow provided by `image-media-engine`, converting bitmap images (PNG/JPG/WEBP) into clean, resolution-independent SVG vector master files with smooth cubic Bézier curves and zero geometric distortion.

---

## 1. Generic Vectorization Execution Command

To vectorize any input bitmap image (e.g., brand mark, icon, illustration, or emblem):

```bash
python scripts/vectorize-image.py --input master_sketch.png --output 01_Vector_Master/logo_primary.svg --smoothness 1.2 --min-area 25.0
```

---

## 2. High-Fidelity Master Vector SVG Structure (`01_Vector_Master/logo_primary.svg`)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" width="1000" height="600">
  <!-- Vectorized Contour Layers -->
  <g id="vector_master">
    <!-- Outer Brand Geometry with Smooth Cubic Bézier Curves -->
    <path fill="#D4A038" stroke="none" d="M 180 200 C 180 150 220 110 270 110 C 320 110 360 150 360 200 C 360 250 320 290 270 290 C 220 290 180 250 180 200 Z" />
    <path fill="#081426" stroke="none" d="M 230 200 C 230 175 250 155 270 155 C 290 155 310 175 310 200 C 310 225 290 245 270 245 C 250 245 230 225 230 200 Z" />
  </g>
</svg>
```

---

## 3. Generic 3-Panel Presentation Deck (Matches Client Proof)

```html
<!-- HTML Widescreen 3-Panel Brand Presentation Deck -->
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.3);">
  
  <!-- Panel 1: Primary Brand Background & Accent Mark -->
  <div style="background: #081426; color: #D4A038; padding: 60px 40px; text-align: center;">
    <img src="01_Vector_Master/logo_primary.svg" style="width: 80%; height: auto;" alt="Primary Brand Vector Logo">
  </div>

  <!-- Panel 2: Crisp White & Monochrome Black -->
  <div style="background: #FFFFFF; color: #000000; padding: 60px 40px; text-align: center; border-left: 1px solid #EEE; border-right: 1px solid #EEE;">
    <img src="02_Digital_Web_App/logo_monochrome_black.svg" style="width: 80%; height: auto;" alt="Monochrome Black Vector Logo">
  </div>

  <!-- Panel 3: Reverse Black & White -->
  <div style="background: #000000; color: #FFFFFF; padding: 60px 40px; text-align: center;">
    <img src="02_Digital_Web_App/logo_reverse_white.svg" style="width: 80%; height: auto;" alt="Reverse White Vector Logo">
  </div>
</div>
```
