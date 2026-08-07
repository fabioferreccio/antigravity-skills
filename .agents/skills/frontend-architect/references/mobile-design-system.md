# Mobile Design System (MDS) & Base UI Architecture Reference

## 1. Overview & Architecture

A high-performance, accessible, and themeable Mobile Design System (MDS) built on unstyled headless primitives and CSS-first design tokens.

### Core Stack Foundation:
- **Primitives**: Base UI (`@base-ui/react`) headless unstyled primitives.
- **Variant Engine**: `tailwind-variants` (`tv`), `clsx`, and `tailwind-merge` (`cn`).
- **Styling & Tokens**: Tailwind CSS v4 `@theme` CSS-first engine using **OKLCH color space**.
- **Component Architecture**: Compound Components pattern (`Dialog.Root`, `Combobox.Input`, `Table.Header`).

---

## 2. Token System & Responsive Breakpoints

### Tailwind v4 `@theme` Configuration
Tokens are declared in CSS without JS config files:
```css
@theme {
  /* Named Spacing Scale */
  --spacing-quarck: 2px;
  --spacing-nano: 4px;
  --spacing-xxxs: 8px;
  --spacing-xxs: 12px;
  --spacing-xs: 16px;
  --spacing-sm: 24px;
  --spacing-md: 32px;
  --spacing-lg: 40px;
  --spacing-xl: 48px;
  --spacing-xxl: 64px;

  /* Custom Breakpoints */
  --breakpoint-phone: 600px;
  --breakpoint-tablet: 900px;
  --breakpoint-desktop: 992px;
  --breakpoint-big-desktop: 1800px;

  /* OKLCH Color Tokens */
  --color-primary-pure: oklch(0.55 0.18 250);
  --color-primary-light: oklch(0.75 0.14 250);
  --color-primary-dark: oklch(0.35 0.18 250);
}
```

---

## 3. Compound Component API Patterns & Wrappers

### Compound Components Pattern
Always export components using compound namespace properties:
```typescript
import * as DialogPrimitive from '@base-ui/react/dialog';
import { tv } from 'tailwind-variants';

const dialogContentVariants = tv({
  base: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm',
});

export function DialogRoot({ children, ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

export function DialogContent({ children, className, ...props }: DialogPrimitive.Content.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 bg-black/50 transition-opacity" />
      <DialogPrimitive.Popup className={dialogContentVariants({ className })} {...props}>
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

// Compound API Assembly
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Close: DialogPrimitive.Close,
});
```

---

## 4. Building Components Superior to Existing Stock

When creating or refactoring components to surpass stock implementations:
1. **Zero Div-Buttons**: Use Base UI primitives to guarantee focus trapping, ARIA roles, and keyboard navigation (`Enter`/`Space`).
2. **Type Safety & Discriminated Unions**: Enforce strict prop types with TypeScript discriminated unions.
3. **Container Query Readiness**: Style components with `@container` queries so they adapt to parent layout width, not just screen viewport.
4. **Environment Theme Hooks**: Support runtime theme switching via dynamic `:root` CSS custom properties.
