# Decision Doors Framework (One-Way vs. Two-Way Doors)

Inspired by Jeff Bezos' decision framework and adapted for software delivery and PR authoring:

---

## 1. Concept

- **Type 1 Decisions (One-Way Doors)**: Irreversible or nearly irreversible. Walking through the door is easy; walking back is painful, expensive, or impossible. They must be made slowly, deliberately, with great care and comprehensive scrutiny.
- **Type 2 Decisions (Two-Way Doors)**: Reversible. If you walk through and don't like what you see, you can easily walk back. They should be made quickly by individuals or small teams without bureaucracy.

---

## 2. Software Engineering Taxonomy

```
                        DECISION REVERSIBILITY
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
  🔴 ONE-WAY DOOR                                   🟢 TWO-WAY DOOR
  • Table rewrites / DROP                           • Add nullable column
  • Financial data mutations                        • Add isolated endpoint
  • Breaking public API change                      • Internal refactoring
  • Cryptographic key/auth change                   • UI style / copy tweak
  • External vendor webhook protocol                • Feature behind feature flag
```

### Heuristics for PR Authors
1. **Can this be converted into a Two-Way Door?**
   - Use Feature Flags.
   - Use Blue-Green or Parallel Run patterns (write to both, read from old, then switch).
   - Expand-and-Contract migrations (add new column, backfill asynchronously, remove old column in separate release).
2. If it remains a One-Way Door:
   - Provide an explicit **Rollback & Contingency Plan**.
   - Outline the worst-case scenario and how it will be detected (monitoring/metrics).
