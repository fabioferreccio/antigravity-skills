# Staff Engineering Principles

## Core Principles

### 1. Scale People Before Code
The highest-leverage action of a Staff Engineer is enabling other engineers to
work more effectively. Before writing a line of code, ask: does this create
leverage for 1 person or 10?

**Anti-pattern**: Writing the solution yourself when you could teach/enable a team.
**Practice**: Pair on the hard parts; write the guide for the rest.

---

### 2. Eliminate Systemic Duplication
Duplication is not just a code smell — it is organizational drag. Every copied
utility is a future divergent bug waiting to manifest in production at the worst moment.

**Threshold for action**: Same pattern in ≥2 teams OR ≥3 codebases → consolidate.
**Method**: Identify, extract, version, migrate, deprecate.

---

### 3. Simplify Onboarding Relentlessly
Onboarding time is a leading indicator of system complexity. If a new engineer
cannot be productive within 2 weeks, the system has a complexity problem, not
a documentation problem.

**Metric**: Time-to-first-PR for new engineers.
**Practice**: Run onboarding regularly. Treat confusion as a bug.

---

### 4. Standardization Reduces Bugs
Inconsistent patterns force engineers to hold more context in their heads.
Standards reduce cognitive load, making bugs rarer and reviews faster.

**Rule**: Prefer boring conventions over clever solutions.
**Practice**: ADRs for every cross-team decision; automate standard enforcement in CI.

---

### 5. Code Is an Organizational Asset
Every service, library, and script has a maintenance cost that recurs forever.
Treat code additions as financial commitments, not one-time investments.

**Question before adding**: What is the lifetime maintenance cost of this?
**Practice**: Include operational cost estimate in every technical proposal.

---

### 6. Optimize Engineering Flow, Not Individual Velocity
Local optimizations (faster IDE, better laptop) have low leverage. Flow
optimizations (reduced PR review time, fewer pipeline failures) affect every
engineer simultaneously.

**Metric**: DORA (Deploy Frequency, Lead Time, MTTR, Change Failure Rate).
**Practice**: Visualize the value stream; eliminate the biggest bottleneck first.

---

### 7. Technical Debt Is Financial Debt
Debt has an interest rate. Unaddressed debt compounds. Quantify it:
- High-interest debt: critical paths with no tests, deprecated dependencies with CVEs
- Low-interest debt: minor inconsistencies, suboptimal but working patterns

**Rule**: Debt must be paid before it accrues crisis-level interest.
**Practice**: Reserve 20% of every sprint for debt amortization.

---

### 8. Prioritize Readability Over Cleverness
The best code is the code the next engineer understands without asking questions.
Clever code transfers cognitive burden from author to every future reader.

**Heuristic**: If you need a comment to explain what it does, simplify it.
**Practice**: Code review for readability first, correctness second.

---

### 9. Avoid Premature Abstractions
Abstractions created before they are needed create complexity without value.
The cost of the wrong abstraction exceeds the cost of duplication.

**Rule (Rule of Three)**: Abstract only when the same pattern appears 3+ times
with clear evidence it will continue to grow.
**Anti-pattern**: Generic frameworks designed for anticipated use cases.

---

### 10. Every Decision Must Facilitate Future Maintenance
Every architectural choice locks in assumptions. Prefer decisions that preserve
optionality and make future changes easier.

**Test**: "In 2 years, will this decision make the codebase easier or harder to change?"
**Practice**: Prefer reversible decisions. Document irreversible ones as ADRs.

---

## Organizational Impact Heuristics

| Signal | Interpretation | Recommended Action |
|---|---|---|
| Same library in 3+ repos | Duplication threshold crossed | Extract shared library |
| New engineer > 2 weeks to first PR | Excessive cognitive load | Onboarding simplification |
| Deploy frequency < 1x/week | Pipeline or review bottleneck | DORA analysis |
| MTTR > 4 hours | Observability or runbook gap | Observability investment |
| >30% PRs without same-day review | Review bottleneck | PR process reform |
| Critical dependency, no owner | Bus factor risk | Knowledge transfer urgency |
| Incident recurring > 2x | Systemic issue, not one-off | Root cause + standard fix |

---

## The Staff Engineer Leverage Ladder

```
Level 1: Solve the problem yourself          (1x impact)
Level 2: Pair and enable another engineer    (2x impact)
Level 3: Write the guide / standard          (Nx impact — N = team size)
Level 4: Build the shared tool / library     (Nx impact — N = org size)
Level 5: Change the process / culture        (10x+ impact)
```

Operate at Level 3+ whenever possible.
