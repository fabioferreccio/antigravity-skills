# Frontend Review Lens

Polyglot frontend review lens.

## 4 universal lenses
1. **Accessibility (a11y)**: aria-labels, keyboard nav, form labels, alt text, semantic HTML
2. **Component composition**: Boolean prop proliferation, prop drilling, missing composition patterns
3. **Performance (async/data)**: Sequential awaits, missing lazy loading, barrel imports
4. **Performance (rendering)**: Unnecessary re-renders, derived state in effects, layout thrashing

## Framework-specific

### React
- Derived state in useEffect (use useMemo or calculate during render)
- Non-primitive hook dependencies
- Missing functional setState
- Inline component definitions
- Missing Suspense boundaries

### Vue
- Watchers where computed would suffice
- Missing v-once for static content
- Props mutation
- Missing key on v-for

### Angular
- Subscriptions not unsubscribed (use takeUntil or async pipe)
- ChangeDetectionStrategy.Default on pure components
- Missing trackBy on ngFor

### Svelte
- Missing reactive declarations ($:)
- Unnecessary stores for local state
- Missing transitions cleanup

### Flutter
- Business logic in Widgets
- Missing const constructors
- Widget tree depth / unnecessary nesting
- State management leaks (Cubit/BLoC patterns)

## Severity
- **Critico**: Accessibility violations, memory leaks, data fetching waterfalls
- **Importante**: Performance issues, composition anti-patterns
- **Menor**: Style, naming, minor optimizations
