# State Management Strategy Reference

## 1. Multi-Tier State Taxonomy

Never put all application state into a single global store (e.g. Redux monolith). Separate state into 5 distinct tiers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOCAL UI STATE: useState / useReducer (Modal open/close) │
├─────────────────────────────────────────────────────────────┤
│ 2. SERVER STATE: TanStack Query / SWR (API Cache, Stale data)│
├─────────────────────────────────────────────────────────────┤
│ 3. FORM STATE: React Hook Form + Zod (Validation, Drafts)   │
├─────────────────────────────────────────────────────────────┤
│ 4. URL STATE: Nuqs / React Router (Filters, Pagination, Search)│
├─────────────────────────────────────────────────────────────┤
│ 5. GLOBAL APP STATE: Zustand / Context (Theme, User Session) │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Server State Architecture (TanStack Query / SWR)

- Use query key factories to standardize cache invalidation:
  ```typescript
  export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
  };
  ```
- Implement optimistic updates for responsive user feedback.
- Explicitly define `staleTime`, `gcTime`, and refetch policies.

---

## 3. Form State & Schema Validation

- Always pair **React Hook Form** with **Zod** or **Valibot** schemas.
- Validate on blur or change; provide instant inline error feedback.
- Keep form field state local to the form component.
