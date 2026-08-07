# Monorepo & Tooling Architecture Reference

## 1. Turborepo & Workspace Topology

Structure front-end monorepos using `pnpm` workspaces and `Turborepo`:

```
├── apps/
│   ├── web/               # Primary React/Vite web application
│   └── docs/              # MDX Documentation site
├── packages/
│   ├── ui/                # Shared Design System & Components
│   ├── config-tsconfig/   # Shared TypeScript configurations
│   ├── config-eslint/     # Shared ESLint Flat Configs
│   └── utils/             # Shared utility functions & hooks
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 2. Strict TypeScript & Tooling Configuration

- **TypeScript**: Always use strict mode (`"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`).
- **Vite**: Fast HMR and optimized bundler setup with React plugin.
- **ESLint & Prettier**: Enforce Flat Config (`eslint.config.js`), React Hooks rules, A11y rules (`eslint-plugin-jsx-a11y`), and import ordering.
- **CI/CD Pipeline**: Parallelized linting, type-checking, testing, and building via Turborepo caching in CI.
