# Example 2: High-Fashion Model Retouching, AI Composition & CMYK Print Preflight

## Scenario
A luxury fashion magazine requires retouching a model studio shot (frequency separation skin correction, AI background replacement to an urban courtyard, lighting match), expanding 3mm sangria/bleed, and exporting a FOGRA39 CMYK PDF/X print asset at 300 PPI.

## 1. Step-by-Step Retouching & AI Compositing Workflow

1. **Frequency Separation (Skin Texture Preservation)**:
   - Split 16-bit RAW image into Low Frequency (Color/Tone) and High Frequency (Pores/Details).
   - Smooth uneven skin redness and blemishes on Low Frequency using Gaussian Blur (Radius $6.0\text{px}$) while preserving original high-frequency skin pore structure.

2. **AI Background Removal & Hair Matting**:
   - Use SAM (Segment Anything Model) to isolate model silhouette.
   - Perform alpha matting along fine hair fibers with edge color decontamination to strip original studio rim light reflections.

3. **Background Replacement & Lighting Match**:
   - Place AI-generated urban courtyard background.
   - Adjust background Kelvin temperature to match model key light ($5400\text{K}$).
   - Construct contact shadow ($C=60, M=50, Y=50, K=95$) under footwear and soft cast shadow fading outward.
   - Apply depth map guided Lens Blur ($f/2.0$ simulation) to courtyard background.

## 2. Print Preflight Execution via CLI

Run the skill's preflight script to convert RGB to FOGRA39 CMYK and expand 3mm sangria/bleed:

```bash
python .agents/skills/image-media-engine/scripts/print-preflight-convert.py \
  --input ./retouched_model_master.png \
  --output-dir ./press_ready \
  --target-ppi 300 \
  --bleed-mm 3.0 \
  --cmyk-profile FOGRA39 \
  --rich-black
```

## 3. Preflight Audit Summary Report

```text
============================================================
PRINT PREFLIGHT AUDIT REPORT (PDF/X Compliance)
============================================================
File Target:          press_ready/retouched_model_master_cmyk_sangria3mm.tif
Target Physical Size: A4 (210 x 297 mm) + 3.0mm Sangria
Trim Dimensions:      210.0 x 297.0 mm (2480 x 3508 px at 300 PPI)
Bleed Dimensions:     216.0 x 303.0 mm (2551 x 3579 px at 300 PPI)

CHECKS & AUDIT STATUS:
  [PASS] Color Mode:         CMYK (FOGRA39 Profile Assigned)
  [PASS] Resolution:         Effective 300 PPI (Zero low-res scaling)
  [PASS] Bleed (Sangria):    3.0mm edge padding verified on all 4 boundaries
  [PASS] Safety Margins:     All headline typography > 5.0mm inside trim line
  [PASS] Black Type:         Small caption text set to K=100% (No rich black fringing)
  [PASS] Rich Black:         Large shadow zones set to C=60 M=40 Y=40 K=100 (TAC = 240%)
  [PASS] Total Ink Limit:    TAC <= 300% across all image zones

STATUS: APPROVED FOR PRESS PRINTING
============================================================
```
