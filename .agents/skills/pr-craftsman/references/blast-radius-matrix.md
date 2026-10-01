# Blast Radius Matrix & Assessment Guide

This reference provides a quantitative framework for measuring the blast radius of any pull request.

---

## 1. Blast Radius Tiers

| Tier | Classification | Blast Radius Characteristics | Required Scrutiny |
|---|---|---|---|
| **Tier 1 (Alto Risco)** | Critical Core | Schema alterations with table locks, monetary flows, authentication/authorization, public API contract breaking changes, root dependencies | Multi-stakeholder review, rollback plan verified, smoke test in staging |
| **Tier 2 (Médio Risco)** | Internal Feature | Internal service integration, non-breaking schema additions (nullable column), business logic in isolated domain | Peer review, unit + integration test verification |
| **Tier 3 (Baixo Risco)** | Cosmetic / Leaf | UI text/styling adjustments, documentation, test additions, internal refactoring behind stable deep modules | Fast-track review, automated CI verification |

---

## 2. Assessment Dimensions

### 1. Persistence Surface
- Are existing rows modified?
- Does the migration acquire an `ACCESS EXCLUSIVE` lock?
- Are foreign keys added to high-traffic tables?

### 2. Contract & API Surface
- Does the diff touch OpenAPI, GraphQL, Protobuf, or public route definitions?
- Are existing response properties removed or type-widened/narrowed?

### 3. Component Coupling Surface
- How many external packages or modules import the modified files?
- Is this a "leaf" component (controller/UI) or a "root" component (utility, domain entity, database adapter)?

### 4. Rollback Feasibility
- Can this PR be safely rolled back via `git revert` alone?
- Does rollback require manual database intervention or data patching?
