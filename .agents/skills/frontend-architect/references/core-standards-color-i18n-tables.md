# Core Standards: Web Languages, Math Color Systems, i18n, Currency & Data Tables

## 1. HTML5 Semantic & TypeScript Strict Standards

- **Semantic HTML5**: Always use proper landmark tags (`<main>`, `<nav>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<dialog>`). Never use `<div onClick={...}>` — use `<button>` or accessible headless controls.
- **TypeScript Strict Idioms**:
  - Use **Discriminated Unions** for variant states (`type State = { status: 'loading' } | { status: 'success'; data: User }`).
  - Use `unknown` instead of `any`; enforce `readonly` arrays for immutable props.
  - Avoid type assertions (`as Type`) — use Zod validation or type guards (`isUser(data)`).

---

## 2. Advanced CSS & Math-Based Color Systems (OKLCH, HSL, Color-Mix)

- **Color Spaces (OKLCH / HSL)**: Prefer **OKLCH** or **LCH** over RGB/HEX for perceptual uniformity when generating dynamic palettes via math:
  ```css
  :root {
    --brand-h: 250;
    --brand-c: 0.18;
    --brand-l: 0.55;
    
    /* Dynamic Color Scaling via Math */
    --primary: oklch(var(--brand-l) var(--brand-c) var(--brand-h));
    --primary-light: oklch(calc(var(--brand-l) + 0.2) calc(var(--brand-c) - 0.04) var(--brand-h));
    --primary-dark: oklch(calc(var(--brand-l) - 0.2) var(--brand-c) var(--brand-h));
  }
  ```
- **CSS Relative Color Syntax & `color-mix()`**:
  ```css
  /* Mix primary with transparent for accessible focus rings */
  --primary-ring: color-mix(in oklch, var(--primary) 30%, transparent);
  ```
- **CSS Filters & Visual Layers**: Use `backdrop-filter: blur(8px)`, `filter: saturate(1.2) brightness(0.95)` for glassmorphism and state overlays.
- **Logical Properties**: Prefer `margin-inline-start`, `padding-block`, `inline-size` over `left/top/width` for RTL i18n support.

---

## 3. Decoupling Internationalization (i18n) from Financial Currency

> [!IMPORTANT]
> **Non-Negotiable Architecture Rule: Locale ≠ Currency**
> Interface language/locale (`i18n`) and financial currency (`currency`) MUST be treated as two independent parameters in component props, state, and API requests.
> - **Example**: A user browsing in English (`locale: 'en-US'`) purchasing an event ticket in Brazil (`currency: 'BRL'`) should see `BRL 150.00` or `R$ 150.00`, NOT `$ 150.00` USD.
> - **Example**: A user in Portugal (`locale: 'pt-PT'`) purchasing an event in the US (`currency: 'USD'`) should see `$ 150,00`.

### Implementation Pattern for Currency Formatting:

```typescript
export interface FormatCurrencyOptions {
  /** The financial currency code (e.g. 'BRL', 'USD', 'EUR') - Driven by event/tenant/transaction */
  currency: string;
  /** The UI display locale (e.g. 'pt-BR', 'en-US', 'es-MX') - Driven by user i18n preference */
  locale?: string;
  /** Display mode: 'symbol' (R$), 'code' (BRL), or 'narrowSymbol' */
  currencyDisplay?: 'symbol' | 'code' | 'narrowSymbol';
}

export function formatCurrency(
  amount: number,
  { currency, locale = 'pt-BR', currencyDisplay = 'symbol' }: FormatCurrencyOptions
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
  }).format(amount);
}
```

---

## 4. i18next & Resource Management

- **Namespace Splitting**: Split translations by feature module (`i18next.loadNamespaces(['checkout', 'common'])`).
- **Pluralization & Interpolation**: Keep HTML tags out of translation JSONs; use `<Trans>` components or DOMPurify when rendering rich text.
- **Backend Language Propagation**: Propagate user UI language (`i18next.language`) in HTTP headers (`Accept-Language`) or RPC extra params (`client.extra.set("lng", lng)`).

---

## 4. Advanced Data Tables & Virtualization

- **Headless Data Tables (TanStack Table v8)**:
  - Separate table logic (sorting, filtering, pagination, selection) from UI rendering.
  - Wrap table engine in reusable UI primitives (`Table.Root`, `Table.Header`, `Table.Row`, `Table.Cell`).
- **Responsive Table Patterns**:
  - Desktop: Full tabular grid with sticky headers (`position: sticky`).
  - Mobile: Transform table rows into stacked card components via CSS container queries or media queries.
- **Virtualization**: Wrap large datasets (100+ rows) with `react-virtuoso` or `@tanstack/react-virtual` to maintain 60 FPS scrolling.
