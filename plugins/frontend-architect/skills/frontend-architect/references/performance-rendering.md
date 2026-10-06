# Performance & Rendering Optimization Reference

## 1. Core Web Vitals (CWV) Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **INP (Interaction to Next Paint)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1

---

## 2. Rendering Modes & Architecture

- **SSR (Server-Side Rendering)**: Dynamic data rendering on demand.
- **SSG (Static Site Generation)**: Pre-rendered static pages for build-time content.
- **ISR (Incremental Static Regeneration)**: Background revalidation of static content.
- **Streaming & Suspense**: Out-of-order streaming of UI chunks for fast initial paint.

---

## 3. React Rendering & Re-render Optimization

- **State Colocation**: Move state as close as possible to the component that needs it to avoid rendering parent trees.
- **Children as Props**: Use `children` or slot props to pass static subtrees down without re-triggering child renders.
- **Strategic Memoization**: Use `useMemo` and `useCallback` for expensive calculations or callback props passed to memoized components (`React.memo`).
- **Code Splitting**: Wrap route components and heavy modals in `React.lazy()` and `<Suspense>`.
- **Image & Asset Optimization**: Use modern WebP/AVIF formats with explicit width/height to prevent CLS.
