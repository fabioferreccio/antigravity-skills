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

## 2. Mandatory Tooling Verification Protocol (Anti-Hallucination)

> [!CAUTION]
> **CRITICAL RULE: Never Assume Installed Packages or Legacy Config Formats**
> BEFORE generating or editing configuration files (`eslint.config.js`, `.prettierrc`, `.dependency-cruiser.js`, `tsconfig.json`):
> 1. **INSPECT `package.json`**: Read both project-level `package.json` and root `package.json` (if monorepo) to verify `devDependencies` and `dependencies`.
> 2. **VERIFY MAJOR VERSIONS**:
>    - ESLint v9+ requires **Flat Config** (`eslint.config.js` or `eslint.config.mjs`). Do NOT generate `.eslintrc.js` or `.eslintrc.json` for ESLint v9.
>    - ESLint v8 uses legacy `.eslintrc.*`.
> 3. **CHECK MISSING DEPENDENCIES**:
>    - If a plugin (e.g., `dependency-cruiser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`) is NOT present in `package.json`, **DO NOT import it silently**.
>    - ALWAYS output a clear notice: *"Package `X` is missing from devDependencies. Install it first using: `pnpm add -D X`"*, and THEN provide the corresponding configuration.

---

## 3. Tooling Configuration Patterns

### A. ESLint v9 Flat Config (`eslint.config.js`)
*Requires verifying `eslint >= 9.0.0` in `package.json`*:

```javascript
// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/alt-text': 'error',
    },
  }
);
```

### B. Dependency Architecture Validation (`dependency-cruiser`)
*Requires verifying `dependency-cruiser` in `package.json`*:

```javascript
// .dependency-cruiser.js
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies break bundler treeshaking and cause runtime initialization crashes.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'domain-cannot-depend-on-presentation',
      severity: 'error',
      comment: 'Clean Architecture Violation: Domain entities must never import UI components or views.',
      from: { path: '^src/domain' },
      to: { path: '^src/presentation|^src/components' },
    },
  ],
};
```

### C. Prettier Configuration (`.prettierrc`)
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 4. Strict TypeScript & Tooling Rules

- **TypeScript**: Always enable strict mode (`"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`, `"noUncheckedIndexedAccess": true`).
- **Vite**: Fast HMR and optimized bundler setup with React plugin.
- **CI/CD Pipeline**: Parallelized linting, type-checking, dependency cruising, testing, and building via Turborepo caching in CI.
