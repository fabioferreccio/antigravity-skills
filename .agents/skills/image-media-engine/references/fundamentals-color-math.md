# Fundamentals of Color Math, Bit Depth & Color Management

## 1. Pixel Math & Raster vs Vector
- **Pixel Count**: Width × Height. 1920 × 1080 = 2,073,600 pixels (2.07 MP).
- **Raster**: Pixel grid (JPEG, PNG, WebP, AVIF, TIFF). Subject to resolution limits and scaling artifacts.
- **Vector**: Mathematical primitives (SVG, AI, EPS, PDF vector). Infinite geometric scalability without pixelation.

## 2. Color Spaces & Gamut
- **sRGB**: Standard default color space for Web, UI, smartphones, and displays. High compatibility.
- **Display P3**: Wide-gamut color space (25% wider than sRGB), common on Apple Retina displays and modern smartphones.
- **Adobe RGB (1998)**: Professional photography color space with extended greens and cyans.
- **CMYK**: Subtractive color model (Cyan, Magenta, Yellow, Key/Black) used for ink printing.
- **OKLCH / HSL**: Perceptually uniform color spaces ideal for programmatic design tokens, UI themes, and CSS manipulation.
  - OKLCH: `oklch(L C H)` where L = Lightness (0-1), C = Chroma (0-0.4), H = Hue angle (0-360 deg). Prevents unexpected lightness jumps during hue shifts.

## 3. Bit Depth & Quantization
- **8-bit per channel**: 256 levels per channel. RGB = $256^3 = 16.77$ million colors. Standard output format for web. Risk of banding in smooth gradients.
- **10-bit per channel**: 1024 levels per channel. Standard for high-end video, HDR imaging, and medical displays.
- **16-bit per channel**: 65,536 levels per channel. Essential intermediate depth for raw photo editing, heavy color grading, and multi-pass compositing to prevent posterization.

## 4. Gamma, Curves & Histogram Analysis
- **Gamma Correction**: Non-linear encoding of luminance ($V_{out} = V_{in}^{\gamma}$). Standard sRGB gamma $\approx 2.2$.
- **Histogram Navigation**:
  - Left (0-50): Blacks & Shadows.
  - Center (51-204): Midtones.
  - Right (205-255): Highlights & Whites.
  - **Clipping Detection**: Pure black (0) or pure white (255) indicates unrecoverable tonal loss.
- **Curves Mappings**:
  - S-Curve: Boosts contrast (darkens shadows, brightens highlights).
  - Inverse S-Curve: Reduces contrast and flattens dynamic range.
  - Channel Curves: Adjust individual R, G, B channels for precise color balance and tinting.
- **Levels Control**:
  - Black point slider ($x_{min}$), White point slider ($x_{max}$), Gamma/Midtone slider ($\gamma$).
  - Maps $[x_{min}, x_{max}] \rightarrow [0, 255]$ with non-linear gamma scaling.

## 5. Color Grading & Selective Color
- **Color Correction vs Color Grading**:
  - *Correction*: Restoring accurate neutral white balance, exposure, and true-to-life colors.
  - *Grading*: Stylistic artistic color choices (cinematic teal & orange, vintage film emulation, brand key visual).
- **LUT (Lookup Table)**: 3D data array mapping input $(R, G, B)$ values to output $(R', G', B')$. Standard format: `.cube`.
- **Selective Color Adjustments**:
  - Target specific color ranges (Reds, Yellows, Greens, Cyans, Blues, Magentas, Whites, Neutral, Blacks) to independently tweak Cyan, Magenta, Yellow, and Black sliders without altering the rest of the image.
- **Luminance & Chrominance Masks**:
  - *Luminance Mask*: Isolates highlights or shadows for localized contrast adjustments.
  - *Chrominance Mask*: Isolates specific hues (e.g. skin tones or brand colors) for isolated saturation or hue shifting.
