# Micro-Frontends & Module Federation Reference

## 1. Micro-Frontend Strategies

1. **Module Federation (Webpack/Vite)**: Runtime sharing of JS bundles and dependencies across independent applications.
2. **Web Components / Custom Elements**: Framework-agnostic encapsulation using shadow DOM.
3. **Island Architecture**: Static HTML shell with interactive client-side Islands (Astro / React Islands).

---

## 2. Architecture Rules & Boundaries

- **Application Shell**: Handles routing, global authentication, layout, and shared state context.
- **Shared Dependencies**: Declare React, React-DOM, and core design system as shared singletons to prevent multiple instantiation.
- **Contract & Event Bus**: Use typed Custom Events or lightweight EventBus for cross-micro-frontend communication.
