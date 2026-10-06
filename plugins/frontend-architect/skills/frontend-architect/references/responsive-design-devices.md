# Responsive Design & Multi-Device Strategy Reference

## 1. Multi-Device Spectrum & Viewport Coverage

Design and architect components to adapt across the full spectrum of modern hardware devices:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. WEARABLE / WATCHES  (160px – 320px): Minimal, High-Contrast│
├─────────────────────────────────────────────────────────────┤
│ 2. MOBILE / PHONES     (320px – 480px): Thumb-Zone, Safe Areas│
├─────────────────────────────────────────────────────────────┤
│ 3. TABLETS & FOLDABLES (481px – 1024px): Fold States, Split UI│
├─────────────────────────────────────────────────────────────┤
│ 4. DESKTOPS & 4K/8K    (1025px – 2560px+): Container Queries │
├─────────────────────────────────────────────────────────────┤
│ 5. TV & SPATIAL / XR   (10-Foot UI): D-Pad & Spatial Focus   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Advanced Responsive Design Techniques

### Container Queries (`@container`)
- Build components that adapt based on the size of their **parent container** rather than the global browser viewport:
  ```css
  .card-container {
    container-type: inline-size;
  }

  @container (min-width: 400px) {
    .card {
      display: grid;
      grid-template-columns: 1fr 2fr;
    }
  }
  ```

### Dynamic Viewport Units (`dvh`, `svh`, `lvh`)
- Use `100dvh` (Dynamic Viewport Height) instead of `100vh` on mobile to prevent layout shifts caused by browser URL bar expansion/collapse.

### Safe Area Insets for Notch / Dynamic Island
- Handle notches, rounded corners, and home indicator bars:
  ```css
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  ```

### Fluid Typography & Spacing (`clamp()`)
- Implement smooth scaling between min/max sizes without harsh breakpoint jumps:
  ```css
  font-size: clamp(1rem, 0.8rem + 1vw, 2.5rem);
  ```

---

## 3. Device-Specific Adaptations

### Wearables & Smartwatches (watchOS / WearOS)
- **Compact UI**: Single-column vertical stack, minimal text clutter, high-contrast tokens.
- **Touch Targets**: Large full-width buttons for small screens (minimum 48x48px).
- **Reduced Motion & Battery**: Support `prefers-reduced-motion` and dark mode for OLED power saving.

### Foldables & Dual-Screen Devices
- Adapt layouts when devices unfold or enter flex-mode (`screen-spanning`, CSS View Segment media queries).

### TV & Spatial Computing (10-Foot & XR Interfaces)
- Support **D-Pad / Keyboard Navigation**: High-visibility focus indicators for remote controls.
- Spatial focus states and spatial audio/haptic feedback hooks.
