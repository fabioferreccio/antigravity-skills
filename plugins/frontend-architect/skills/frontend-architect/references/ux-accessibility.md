# UX & Accessibility Reference Guide (WCAG 2.2 & Nielsen Heuristics)

## 1. Core Principles

1. **User Experience First**: Technical complexity must never leak into the user interface.
2. **WCAG 2.2 AA/AAA Compliance**: Accessibility is a non-negotiable architectural requirement.
3. **Cognitive Load Reduction**: Consistent patterns, predictable navigation, and explicit state feedback.
4. **Error Prevention**: Defensive UI design to guide users and eliminate invalid input states.

---

## 2. Nielsen 10 Usability Heuristics & Audit Checklist

1. **Visibility of system status**: Always communicate loading, error, success, and background sync states.
2. **Match between system and the real world**: Speak the user's language, avoiding developer jargon or stack traces.
3. **User control and freedom**: Provide clear undo/cancel mechanisms for actions.
4. **Consistency and standards**: Maintain uniform design tokens, typography, and interaction patterns across components.
5. **Error prevention**: Use sensible defaults, input masks, and validation constraints before submission.
6. **Recognition rather than recall**: Keep options, actions, and instructions visible or easily accessible.
7. **Flexibility and efficiency of use**: Provide shortcuts for advanced users while keeping simple flows intuitive.
8. **Aesthetic and minimalist design**: Remove visual clutter; prioritize primary actions over secondary controls.
9. **Help users recognize, diagnose, and recover from errors**: Error messages must be actionable, empathetic, and human-readable.
10. **Help and documentation**: Provide context-sensitive help or tooltips when complex features are introduced.

---

## 3. Accessibility (WCAG 2.2) Standard Practices

### Keyboard Navigation & Focus Management
- All interactive elements must be focusable using `Tab` and operable via `Enter` or `Space`.
- Use `focus-visible` outline styles with sufficient contrast ratio (minimum 3:1).
- Modals, dialogs, and drawer components MUST implement focus trapping and restore focus on close.

### Screen Reader Support & ARIA
- Use semantic HTML tags (`<nav>`, `<header>`, `<main>`, `<article>`, `<aside>`, `<button>`, `<a>`).
- Do not use `<div onClick={...}>`. Use `<button>` or custom accessible headless controls.
- Supply `aria-expanded`, `aria-controls`, `aria-selected`, `aria-invalid`, and `aria-live` for dynamic state updates.

### Color Contrast & Typography
- Minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (WCAG 2.2 AA).
- Do not rely on color alone to convey meaning (combine color with icons and text labels).

---

## 4. Audit & Review Protocol

When auditing a component or screen for UX/A11y:
1. **Identify UX Friction**: Pinpoint bottlenecks, confusing layouts, or missing feedback states.
2. **Evaluate Heuristics & WCAG**: Map violations against Nielsen heuristics or WCAG success criteria.
3. **Propose Actionable Fixes**: Provide clear code adjustments and microcopy improvements.
