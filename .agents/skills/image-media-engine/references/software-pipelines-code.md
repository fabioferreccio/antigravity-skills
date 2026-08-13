# Software Pipelines, Code Libraries & Non-Destructive Automation

## 1. Core Software Libraries & Tools
- **Node.js**:
  - `sharp`: Ultra-fast C++ `libvips` wrapper for multi-format resizing, WebP/AVIF encoding, sRGB conversion, metadata stripping, compositing, and channel operations.
  - `canvas` / `@napi-rs/canvas`: Cairo-backed canvas implementation for programmatic dynamic rendering, typography overlay, and visual asset generation.
- **Python**:
  - `Pillow` (PIL): Standard image manipulation library for resizing, color transformations, drawing, and multi-frame processing.
  - `OpenCV` (`cv2`): Computer vision library for edge detection (Canny, Sobel), morphological operations (erosion, dilation), thresholding (Otsu, adaptive), perspective homography, and color space transformations (HSV, LAB).
  - `libvips` (`pyvips`): Memory-efficient streaming image processing engine for multi-gigapixel large format images.
- **CLI Utilities**:
  - `ImageMagick` (`magick` / `convert` / `mogrify`): Heavy-duty batch CLI converter, ICC profile assigner, and PDF rasterizer.
  - `tesseract`: OCR engine for converting scanned image documents into digital text.

## 2. Non-Destructive Pipeline Architecture (Master → Derivates)
Always maintain a single high-resolution Master file (`master.tif`, `master.psd`, 16-bit PNG) and generate derived assets using declarative JSON configurations.

### Declarative Pipeline JSON Spec Example:
```json
{
  "$schema": "https://antigravity.dev/schemas/image-pipeline.json",
  "pipelineId": "ecommerce-packshot-v1",
  "source": "./masters/product_raw_001.png",
  "steps": [
    {
      "action": "color_management",
      "targetProfile": "sRGB",
      "adjustments": {
        "exposure": 0.15,
        "contrast": 1.05,
        "saturation": 1.02
      }
    },
    {
      "action": "background_clean",
      "threshold": 245,
      "featherPixels": 1.5,
      "decontaminateHalo": true
    },
    {
      "action": "canvas_pad",
      "aspectRatio": "1:1",
      "paddingPercent": 10,
      "backgroundColor": "#FFFFFF00"
    },
    {
      "action": "output_generate",
      "targets": [
        { "format": "avif", "quality": 80, "widths": [320, 640, 1024], "dpr": [1, 2] },
        { "format": "webp", "quality": 82, "widths": [320, 640, 1024], "dpr": [1, 2] }
      ]
    }
  ]
}
```

## 3. Document OCR & Image Pre-processing Pipeline
To maximize OCR accuracy with Tesseract or vision language models:
```
Raw Scanned Image
  └─→ 1. Deskew (Rotate to correct angle via Hough Line Transform)
        └─→ 2. Denoise (Median filter for salt & pepper noise)
              └─→ 3. Contrast Boost (Histogram Equalization)
                    └─→ 4. Binarization (Otsu or Adaptive Thresholding)
                          └─→ 5. Morphology (Opening/Closing to mend broken letters)
                                └─→ 6. OCR Text Extraction
```

## 4. Sharp (Node.js) Code Snippet Reference
```javascript
import sharp from 'sharp';

export async function processWebAsset(inputBuffer, options) {
  const { width, format, quality = 80, dpr = 1 } = options;
  const targetWidth = width * dpr;

  return sharp(inputBuffer)
    .withMetadata(false) // Strip EXIF GPS for web privacy
    .resize(targetWidth, null, {
      fit: 'cover',
      kernel: sharp.kernel.lanczos3
    })
    .toColorspace('srgb')
    [format]({ quality, alphaQuality: 90 })
    .toBuffer();
}
```
