# Output Templates — Staff Engineer

## Template 1: Full Engineering Diagnosis Report

Use when triggered by broad diagnostic requests.

```markdown
# Engineering Diagnosis Report

**Date**: {{ date }}
**Scope**: {{ teams/repos analyzed }}
**Analyst**: Staff Engineer Agent

---

## 1. Diagnóstico

### Estado Atual
{{ current state: patterns found, team count, repo count }}

### Duplicidades Identificadas
| Pattern | Repos | Severity | Est. Maintenance Cost |
|---|---|---|---|
| {{ pattern }} | {{ repos }} | {{ severity }} | {{ cost }} |

### Violações de Padrão
| Standard | Violation | Teams Affected |
|---|---|---|
| {{ standard }} | {{ violation }} | {{ teams }} |

---

## 2. Impacto Organizacional

- **Times afetados**: {{ list }}
- **Custo de manutenção estimado**: {{ hours/month }}
- **Impacto em lead time**: {{ estimated delta }}
- **Impacto em onboarding**: {{ estimated ramp-up delta }}

---

## 3. Anti-patterns Identificados

| ID | Anti-Pattern | Severity | Evidence |
|---|---|---|---|
| AP-XXX | {{ name }} | CRITICAL/HIGH/MEDIUM | {{ evidence }} |

---

## 4. Recomendações

### Prioridade Alta
1. {{ recommendation }} — **Impacto**: {{ impact }} | **Esforço**: {{ effort }}

### Prioridade Média
2. {{ recommendation }} — **Impacto**: {{ impact }} | **Esforço**: {{ effort }}

### Prioridade Baixa
3. {{ recommendation }} — **Impacto**: {{ impact }} | **Esforço**: {{ effort }}

---

## 5. Plano de Refatoração

### Fase 1: Quick Wins (Semanas 1-2)
- [ ] {{ action }} — Owner: {{ team }} — Critério: {{ measurable criterion }}

### Fase 2: Consolidação (Semanas 3-6)
- [ ] {{ action }} — Owner: {{ team }} — Critério: {{ measurable criterion }}

### Fase 3: Padronização (Semanas 7-12)
- [ ] {{ action }} — Owner: {{ team }} — Critério: {{ measurable criterion }}

---

## 6. Riscos

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| {{ risk }} | High/Med/Low | High/Med/Low | {{ mitigation }} |

---

## 7. Estratégia Incremental

**Semana 1**: {{ highest-impact, lowest-effort action }}
**Semana 2-3**: {{ next action }}
**Mês 2**: {{ consolidation action }}
**Mês 3**: {{ standardization action }}

**Critério de sucesso**:
- Duplicidade: {{ current }}% → {{ target }}%
- Lead time: {{ current }} → {{ target }}
- Onboarding: {{ current }} → {{ target }} semanas
```

---

## Template 2: Shared Library Specification

Use when designing a shared SDK or library.

```markdown
# Shared Library Specification: {{ library-name }}

**Version**: 1.0.0
**Owner**: {{ team }}
**Consumers**: {{ list of teams/services }}
**Status**: Proposed

---

## Problem Statement

{{ what duplication or inconsistency this library resolves }}

## Scope

### In Scope
- {{ capability 1 }}
- {{ capability 2 }}

### Out of Scope
- {{ explicitly excluded capabilities }}

## Public API Contract

```typescript
// Core interface — must remain stable across minor versions
interface {{ LibraryName }} {
  {{ method signature 1 }};
  {{ method signature 2 }};
}
```

## Versioning Strategy

- **Patch**: Bug fixes, no API changes
- **Minor**: New opt-in features, backward compatible
- **Major**: Breaking API changes (require migration guide)

## Migration Path

### Phase 1: Extract (Week 1-2)
Extract from {{ primary repo }} and publish as internal package.

### Phase 2: Parallel Run (Week 3-4)
Consumer teams run both old + new in parallel. Validate parity.

### Phase 3: Migration (Week 5-8)
Migrate each consumer team. Deprecate originals.

### Phase 4: Cleanup (Week 9)
Remove deprecated implementations.

## Rollback Strategy

If critical bug found: pin consumers to last stable version.
Emergency: feature flag to route to local fallback implementation.

## Success Metrics

- All {{ N }} consumer teams migrated: {{ target date }}
- Zero divergent bugs post-migration: validated at {{ date }}
- Maintenance cost: from {{ N }} implementations to 1
```

---

## Template 3: ADR (Architecture Decision Record)

Use for cross-team technical decisions.

```markdown
# ADR-{{ number }}: {{ title }}

**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-{{ number }}
**Date**: {{ date }}
**Authors**: {{ names }}
**Stakeholders**: {{ teams }}

---

## Context

{{ background and forces driving this decision }}

## Decision Drivers

- {{ driver 1 }}
- {{ driver 2 }}

## Options Considered

### Option A: {{ name }}
**Pros**: {{ pros }}
**Cons**: {{ cons }}
**Cost**: {{ effort estimate }}

### Option B: {{ name }}
**Pros**: {{ pros }}
**Cons**: {{ cons }}
**Cost**: {{ effort estimate }}

## Decision

**Chosen**: Option {{ X }} — {{ name }}

**Rationale**: {{ why this option, with trade-off acknowledgment }}

## Consequences

### Positive
- {{ positive consequence }}

### Negative
- {{ negative consequence — trade-off accepted }}

### Risks
- {{ risk + mitigation }}

## Validation Metrics

{{ how we will know this decision was correct — measurable criteria }}

## Review Date

{{ date }} — revisit if {{ condition that would trigger review }}
```

---

## Template 4: DORA Analysis Report

Use when analyzing engineering velocity metrics.

```markdown
# DORA Metrics Analysis

**Period**: {{ date range }}
**Teams**: {{ teams analyzed }}

---

## Current State

| Metric | Current | Target | Elite Benchmark |
|---|---|---|---|
| Deploy Frequency | {{ value }} | {{ target }} | Multiple times/day |
| Lead Time for Changes | {{ value }} | {{ target }} | < 1 hour |
| MTTR | {{ value }} | {{ target }} | < 1 hour |
| Change Failure Rate | {{ value }} | {{ target }} | 0-15% |

## Performance Level

{{ Elite / High / Medium / Low }} — based on DORA research benchmarks

## Bottleneck Analysis

### Primary Bottleneck: {{ bottleneck name }}
**Evidence**: {{ data point }}
**Root Cause**: {{ probable cause }}
**Recommended Action**: {{ action }}
**Expected Impact**: {{ DORA metric}} from {{ current }} to {{ target }}

## Improvement Roadmap

### Quick Wins (< 1 week)
- [ ] {{ action }} → Expected: {{ metric improvement }}

### Medium Term (1-4 weeks)
- [ ] {{ action }} → Expected: {{ metric improvement }}

### Strategic (1-3 months)
- [ ] {{ action }} → Expected: {{ metric improvement }}
```

---

## Template 5: Technical Debt Amortization Plan

Use when triaging and prioritizing technical debt.

```markdown
# Technical Debt Amortization Plan

**Date**: {{ date }}
**Total Debt Items**: {{ count }}
**Estimated Total Interest**: {{ hours/month in maintenance overhead }}

---

## Debt Classification

| Item | Category | Severity | Monthly Cost | Effort | Priority |
|---|---|---|---|---|---|
| {{ item }} | arch/code/test/dep | CRITICAL/HIGH/MED | {{ hours }} | {{ days }} | P1/P2/P3 |

## Categories

- **arch**: Architectural debt (coupling, wrong abstractions)
- **code**: Code quality (complexity, duplication, readability)
- **test**: Test coverage gaps on critical paths
- **dep**: Dependency debt (outdated, CVEs, deprecated)

## Amortization Strategy

### P1: Immediate (This Sprint)
{{ items with highest interest rate / risk }}

### P2: Short Term (Next 2 Sprints)
{{ high-severity items with reasonable effort }}

### P3: Strategic (This Quarter)
{{ important but lower urgency items }}

### Backlog (Future Quarters)
{{ low-interest debt, acceptable for now }}

## Capacity Recommendation

Reserve **20%** of each sprint for debt amortization.
At current capacity: {{ N }} debt items per sprint.
Full payoff estimate: {{ N }} quarters.
```
