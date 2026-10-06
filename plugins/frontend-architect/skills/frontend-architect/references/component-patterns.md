# Component Patterns & Architecture Reference

## 1. Atomic Design System

Organize UI components into clear structural tiers:

1. **Atoms**: Pure, basic UI elements (Button, Input, Icon, Label, Badge). Zero domain logic.
2. **Molecules**: Simple combinations of atoms (SearchInput = Input + Icon + Button).
3. **Organisms**: Complex, distinct UI sections (Navbar, DataTable, UserForm, Header).
4. **Templates**: Page-level layout structures without real data binding.
5. **Pages**: Fully wired routes or views combining templates with real state and data fetching.

---

## 2. Compound Components Pattern

Use React Context to share implicit state between parent and children without prop drilling.

### Rules:
- Parent component manages state and provides Context.
- Child sub-components (e.g. `Accordion.Item`, `Accordion.Trigger`, `Accordion.Content`) consume context.
- Expose compound components attached to the main parent object (`Modal.Header`, `Modal.Body`, `Modal.Footer`).

---

## 3. Headless UI & Unstyled Primitives

Separate interaction logic and accessibility from styling:
- Use Headless primitives (e.g., Radix UI, Headless UI, React ARIA) for complex widgets (Dropdowns, Tabs, Comboboxes, Dialogs).
- Apply styling via TailwindCSS and Class Variance Authority (CVA).
- Keep component APIs declarative and customizable.

---

## 4. Container / Presenter & Custom Hook Composition

- **Presenter (UI Component)**: Pure visual component. Receives props, renders JSX, handles no side effects.
- **Custom Hook (Logic)**: Extracts state management, data fetching, and side-effects into reusable hooks (`useUserForm`, `useDataTable`).
- **Container / Page**: Connects hooks to presenter components.

---

## 5. Clean Architecture & Clean Code in Front-End

Apply Clean Architecture principles to protect front-end applications from framework churn and tight infrastructure coupling:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DOMAIN LAYER: Pure Entities & Business Rules (No React)  │
├─────────────────────────────────────────────────────────────┤
│ 2. APPLICATION / USE CASES: Workflows & Feature Services     │
├─────────────────────────────────────────────────────────────┤
│ 3. INFRASTRUCTURE / ADAPTERS: API Repositories, Storage     │
├─────────────────────────────────────────────────────────────┤
│ 4. PRESENTATION LAYER: React Components, Tailwind, Router   │
└─────────────────────────────────────────────────────────────┘
```

### Core Clean Code Rules for Front-End:
- **Dependency Inversion**: Components depend on abstractions (interfaces/contracts), not concrete API implementations (e.g. `UserRepository` interface injected into custom hooks).
- **Framework as Plugin**: UI frameworks (React, Vite, Next.js) are delivery mechanisms. Core business logic and validation schemas (Zod) must run independently of React.
- **Single Responsibility Principle (SRP)**: Split components when they handle both visual layout AND complex state orchestration.
- **Pure Functions for Domain Rules**: Keep data transformations (formatting, calculations, data mapping) in pure TS functions outside of React render cycles.

