# Example 02: DORA Analysis — Engineering Velocity Regression

## Scenario

A VP of Engineering notices that deploy frequency dropped from 5 deploys/day to
1 deploy/week over the past 2 months after a team reorganization. They want a
diagnosis and a recovery plan.

---

## User Input

```
Nossas métricas de DORA regrediram nos últimos 2 meses:
- Deploy frequency: era 5x/dia, agora é 1x/semana
- Lead time: era 2h, agora é 3 dias
- MTTR: estável em 30 min
- Change failure rate: subiu de 8% para 22%

Temos 4 times, fizemos uma reorganização há 2 meses.
O que está acontecendo e como melhorar?
```

---

## Agent Response

### 🔍 Phase 1: OBSERVE

DORA metrics received:
- **Deploy Frequency**: 5x/day → 1x/week → regression from Elite to Low tier
- **Lead Time**: 2h → 3 days → regression from Elite to Medium tier
- **MTTR**: 30 min → stable (Elite tier maintained)
- **Change Failure Rate**: 8% → 22% → regression from Elite to High tier

Temporal correlation: reorganization 2 months ago.

DORA heuristics triggered:
- `deploy_frequency < 1x/week` → ALERT
- `lead_time > 1 week (approaching)` → ALERT
- `change_failure_rate > 30% (approaching)` → ALERT

---

### 🧠 Phase 2: REFLECT

Reorganization-correlated DORA regression patterns typically indicate:
1. **Knowledge fragmentation** — teams lost cross-domain expertise post-reorg
2. **New approval bottlenecks** — new team boundaries created coordination overhead
3. **Pipeline coupling** — services that moved to different teams now require cross-team deployments
4. **Testing confidence loss** — higher failure rate suggests test coverage gaps exposed by reorg
5. **Communication overhead** — what was 1 team now requires inter-team coordination

---

### ⚡ Phase 3: ACT — Mode: DORA Analysis

---

## DORA Metrics Analysis

**Period**: Last 2 months vs. baseline
**Teams**: 4 teams (post-reorganization)

---

## Current State

| Metric | Baseline (Pre-Reorg) | Current | Delta | DORA Level |
|---|---|---|---|---|
| Deploy Frequency | 5x/day | 1x/week | **-97%** | Low ↓ (was Elite) |
| Lead Time for Changes | 2 hours | 3 days | **+2,700%** | Medium ↓ (was Elite) |
| MTTR | 30 min | 30 min | Stable | Elite ✅ |
| Change Failure Rate | 8% | 22% | **+175%** | Low ↓ (was Elite) |

**Severity**: Critical regression across 3 of 4 DORA metrics.

---

## Bottleneck Analysis

### Primary Bottleneck: Deployment Coupling Post-Reorg

**Evidence**: Deploy frequency dropped 97% exactly at reorg boundary
**Root Cause Hypothesis**: Services split across new team boundaries now require
multi-team coordination to deploy. What was 1 team deploying independently is now
4 teams needing synchronized releases.

**Indicators to confirm**:
- Are there shared deployment pipelines across the new teams?
- Do services from different teams have runtime dependencies that force joint deploys?
- Is there a new approval gate (cross-team sign-off) added post-reorg?

**Recommended Action**: Map deployment dependency graph. Eliminate cross-team deploy coupling.
**Expected Impact**: Deploy frequency from 1x/week → back toward 2-3x/day within 4 weeks.

---

### Secondary Bottleneck: Knowledge Loss + Review Bottleneck

**Evidence**: Lead time grew 27x. MTTR held stable, ruling out incident management as cause.
**Root Cause Hypothesis**: Engineers now reviewing code in domains they don't own deeply,
slowing approval. Knowledge concentration risks (AP-007) materialized post-reorg.

**Indicators to confirm**:
- What is the average PR review time pre vs. post reorg?
- Are there PRs waiting > 1 day for review?
- Which domains had the most context in the previous team that was split?

**Recommended Action**: Knowledge transfer sessions + domain ownership documentation.
**Expected Impact**: Lead time from 3 days → 4-6 hours within 6 weeks.

---

### Tertiary Bottleneck: Test Confidence Regression

**Evidence**: Change failure rate grew from 8% → 22% post-reorg.
**Root Cause Hypothesis**: Integration tests that relied on in-team service knowledge
are no longer maintained. New owners lack context to catch edge cases.

**Indicators to confirm**:
- Which services have the highest failure rate?
- Do those services correspond to the domain boundaries that were split?
- Are integration tests for those services passing but missing coverage?

**Recommended Action**: Characterization tests + domain knowledge runbooks.
**Expected Impact**: Change failure rate from 22% → 10% within 8 weeks.

---

## Improvement Roadmap

### Quick Wins (Week 1)

- [ ] **Map deployment dependency graph** — Identify which deploys require cross-team coordination
  → Expected: reveals all coupling points causing 1x/week frequency

- [ ] **Measure PR review time per domain** — Identify which domains have review bottlenecks
  → Expected: reveals knowledge concentration risks

- [ ] **Identify top 5 highest-failure services** — Correlate with reorg boundary
  → Expected: confirms characterization test hypothesis

### Medium Term (Weeks 2-4)

- [ ] **Decouple deployment pipelines** — Enable each team to deploy independently
  → Expected Deploy Frequency: 1x/week → 2-3x/day

- [ ] **Run domain knowledge transfer sessions** — 2h per domain, recorded
  → Expected: reduces review bottleneck by 50%

- [ ] **Add characterization tests to top-5 failure services** — Cover current behavior
  → Expected Change Failure Rate: 22% → 12%

### Strategic (Months 2-3)

- [ ] **Establish service ownership matrix** — Each service has 1 primary + 1 secondary owner
  → Expected: eliminates bus factor risk (AP-007)

- [ ] **Implement feature flags** — Decouple deploy from release for high-risk changes
  → Expected Change Failure Rate: 12% → 5-8%

- [ ] **Add DORA dashboard** — Visible to all teams in real time
  → Expected: creates accountability loop for sustained improvement

---

## 7-Section Summary

### 1. Diagnóstico
Regressão crítica em 3 de 4 métricas DORA correlacionada diretamente com a reorganização de times há 2 meses.

### 2. Impacto Organizacional
- Times afetados: 4 times de engenharia + seus stakeholders
- Lead time cresceu 2700% — feature delivery dramatically slower
- Change failure rate aumentou 175% — mais incidentes, mais retrabalho

### 3. Anti-patterns Identificados
- AP-002 (Accidental Coupling): deploys acoplados entre times
- AP-007 (Hero Culture): conhecimento concentrado, perdido no reorg
- AP-012 (Siloed Knowledge): domínios fragmentados sem documentação

### 4. Recomendações
Desacoplar pipelines, transferir conhecimento, adicionar testes de caracterização.

### 5. Plano de Refatoração
3 fases incrementais: diagnóstico imediato → desacoplamento → padronização.

### 6. Riscos
Resistência à mudança post-reorg é alta; engajamento da liderança é crítico.

### 7. Estratégia Incremental
Quick wins em Semana 1 para visibilidade; desacoplamento em Semanas 2-4; sustentação em Meses 2-3.
