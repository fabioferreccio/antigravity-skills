# SDD Closing Feedback Loop & Retrospective Protocol

This protocol defines how Spec-Driven Development (SDD) closes the development loop after Phase 4 (Implementation).

---

## 1. The 7-Phase SDD Lifecycle

```
Phase 0: CONSTITUTION ────── Project invariants & quality baseline
  │
Phase 1: SPECIFICATION ───── "What" to build (acceptance criteria & edge cases)
  │
Phase 2: PLAN ────────────── "How" to build (architecture & contracts)
  │
Phase 3: TASKS ───────────── Atomic step-by-step breakdown
  │
Phase 4: IMPLEMENTATION ──── TDD execution of tasks with human checkpoints
  │
Phase 5: ACTIVE REVIEW ───── Pre-PR automated audit against constitution.md
  │
Phase 6: PR CRAFTING ─────── Blast radius, doors classification & visual diagram
  │
Phase 7: RETROSPECTIVE ───── Codify human feedback back into constitution.md
```

---

## 2. Phase 5: Active Review & Auto-Remediation

After all tasks in `<feature>.tasks.md` are marked complete:
1. Diff the current feature branch against the base branch (`git diff origin/main...HEAD`).
2. Verify implementation against `constitution.md`:
   - Are coding standards respected?
   - Are contracts and layers maintained?
   - Are tests meaningful and non-tautological?
3. Compile safe fixes (lint, imports, formatting) and prompt the user interactively before committing.

---

## 3. Phase 6: Visual PR Crafting with Blast Radius

Compile the feature artifacts into a comprehensive PR description:
- **Title**: Derived from the spec.
- **Decision Door**: 🟢 Two-Way Door (Reversible) vs 🔴 One-Way Door (Irreversible).
- **Blast Radius**: Affected domains, schema changes, API contracts.
- **Show-Me Visual**: Mermaid diagram illustrating the before vs. after architectural state.
- **Traceability**: Direct links to `<feature>.spec.md`, `<feature>.plan.md`, and `<feature>.tasks.md`.

---

## 4. Phase 7: Retrospective Feedback Loop (Compound Learning)

When human code review concludes (or when the PR is merged/adjusted):
1. **Analyze Review Corrections**: What did the human reviewer catch that the agent missed?
2. **Formulate Invariant Rule**: Convert the finding into a permanent, deterministic rule.
3. **Update `constitution.md`**: Append the rule to the relevant section (Architecture, Security, Quality, or Coding Standards).
4. **Prevent Context Bloat**: If `constitution.md` exceeds 300 lines, consolidate redundant rules.
