# Refactoring, Mentorship, Dependency Security & Project Planning Reference

## 1. Interactive Mentorship & Guided Refactoring Protocol

When helping users refactor legacy or un-patterned front-end code, act as a **Senior Staff Mentor**:
- **Teach the "Why"**: Explain the architectural rationale behind design patterns (e.g. why Compound Components prevent prop drilling, why Ports & Adapters isolate API churn).
- **Incremental Steps**: Never propose refactoring an entire 4.000-file codebase in one massive PR. Use the **Strangler Fig Pattern** to refactor feature by feature.
- **Before / After Code Comparisons**: Show clear diffs highlighting code smell removal, type safety improvements, and performance gains.

---

## 2. Issue Classification Matrix (Vulnerability vs Bug vs Tech Debt vs Architectural Epic)

Categorize every finding from codebase audits into 4 distinct buckets:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SECURITY VULNERABILITY / INCIDENT (Immediate Fix)        │
│    - PAN/CVV in localStorage, unvalidated CSRF, hardcoded keys │
├─────────────────────────────────────────────────────────────┤
│ 2. BUG (Fix in Sprint)                                      │
│    - Broken user flows, unhandled exceptions, UI crashes   │
├─────────────────────────────────────────────────────────────┤
│ 3. TECHNICAL DEBT (Scheduled Refactoring)                   │
│    - EOL libraries (CRA, React 16), dead code, inline CSS   │
├─────────────────────────────────────────────────────────────┤
│ 4. ARCHITECTURAL EPIC (Strategic Roadmap)                    │
│    - Monorepo unification, Design System migration, Vite 8   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Dependency Security & Vulnerability Audit Protocol

- **Audit Tools**: Analyze `package.json`, `pnpm-lock.yaml`, `package-lock.json`, and `packages.config` for CVEs (`npm audit`, `pnpm audit`).
- **EOL (End-of-Life) Tracking**: Identify deprecated libraries (e.g. Create React App, React 16, Gulp 3, Axios <0.21, Sentry v5).
- **Bloat & Duplication Detection**: Detect duplicate libraries carrying multiple major versions (e.g. React 18 + React 19 in same node_modules, 5 chart libraries, 4 virtualizers).

---

## 4. Migration & Upgrade Playbooks

### CRA to Vite Migration
1. Remove `react-scripts`, install `vite` and `@vitejs/plugin-react`.
2. Move `public/index.html` to root and replace `%PUBLIC_URL%` with relative paths.
3. Replace `REACT_APP_*` env variables with `VITE_*` and `import.meta.env`.

### JS to TypeScript Migration
1. Add `tsconfig.json` with strict mode enabled.
2. Rename `.js` files to `.tsx` starting from lowest-level utility functions and UI atoms up to routes.

---

## 5. Task Breakdown & Project Backlog Template

Structure tasks for development teams using this format:

```markdown
### 🎯 Epic: [Name of Architectural Initiative]

#### Task 1: [Critical Fix / Vulnerability]
- **Type**: Security Vulnerability
- **Description**: Remove PAN storage from localStorage in `apps/delivery`.
- **Acceptance Criteria**: All card tokenization flows through Yuno Hosted Fields; zero PAN in storage.

#### Task 2: [Refactoring / Pattern Alignment]
- **Type**: Technical Debt / Refactoring
- **Description**: Migrate Formik form in `Login` to React Hook Form + Zod schema.
- **Acceptance Criteria**: Form validation declarative with Zod, DOM manipulation removed.
```
