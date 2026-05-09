# Anti-Patterns Catalog — Staff Engineer

## Severity Levels
- **CRITICAL**: Causes systemic failure or organizational paralysis
- **HIGH**: Significantly increases maintenance cost or lead time
- **MEDIUM**: Increases cognitive load or creates future risk
- **LOW**: Minor inefficiency worth tracking

---

## Code & Architecture Anti-Patterns

### AP-001: Reinvented Wheels (Severity: HIGH)
**Description**: Multiple teams independently implement the same utility
(logging, auth, HTTP client, retry logic) with subtle differences.

**Signals**:
- Same function name with different implementations across repos
- Divergent behavior in edge cases (timeouts, error codes)
- Bug fixed in one repo, persists in others

**Impact**: N-fold maintenance cost, divergent bugs, inconsistent observability.

**Remediation**: Extract to shared library with versioning. Apply strangler fig migration.

---

### AP-002: Accidental Coupling (Severity: HIGH)
**Description**: Services share internal data structures, databases, or internal
APIs that should be external contracts.

**Signals**:
- Direct database access across service boundaries
- Shared internal models imported across bounded contexts
- Services that must deploy together

**Impact**: Deployment coupling, blast radius amplification, impossible independent scaling.

**Remediation**: Define explicit contracts (API, events). Apply Anti-Corruption Layer.

---

### AP-003: Configuration Drift (Severity: MEDIUM)
**Description**: Infrastructure or service configuration diverges across environments
or teams without governance.

**Signals**:
- Works in staging, fails in production
- Env vars with different names for the same concept
- Manual config changes without version control

**Impact**: Incident rate increases; environment parity erodes; debugging time multiplies.

**Remediation**: Infrastructure as Code. Centralized config management. Config audit in CI.

---

### AP-004: Dependency Hell (Severity: HIGH)
**Description**: Multiple versions of the same dependency coexist across services,
creating security exposure and incompatibility risks.

**Signals**:
- Different teams on different major versions of a critical library
- CVEs in dependencies that "nobody has time to update"
- Breaking changes handled differently per team

**Impact**: Security vulnerability surface area; migration cost compounds over time.

**Remediation**: Dependency governance board. Automated CVE scanning in CI. Version pinning policy.

---

### AP-005: Test Coverage Debt (Severity: HIGH)
**Description**: Critical business paths have no automated tests, making refactoring
or migration dangerous.

**Signals**:
- New feature shipping without tests
- "We'll add tests later" backlog items never closed
- Deployment fear ("what if we break something?")

**Impact**: MTTR increases; change failure rate increases; DORA degrades.

**Remediation**: Test coverage gates in CI. Characterization tests before refactoring. Testing standards.

---

### AP-006: Documentation Rot (Severity: MEDIUM)
**Description**: Documentation exists but is outdated, creating a false sense
of knowledge while misleading new engineers.

**Signals**:
- Runbooks referencing deprecated services or tools
- Architecture diagrams not matching current state
- Onboarding docs that generate more questions than they answer

**Impact**: Onboarding time increases; incident resolution time increases.

**Remediation**: "Docs as code" — docs in repo, reviewed in PRs. Last-validated date on every runbook.

---

### AP-007: Hero Culture (Severity: CRITICAL)
**Description**: One engineer is the sole owner of a critical system, creating
knowledge concentration risk and organizational bus factor = 1.

**Signals**:
- Only one person can deploy or debug a system
- "Ask [Name]" is the answer to every question about a service
- Incidents cannot be resolved without a specific person

**Impact**: Single point of failure for the organization. Engineer burnout. Deployment paralysis.

**Remediation**: Mandatory knowledge transfer. Runbook creation requirement before vacation.
Rotating on-call ownership.

---

### AP-008: Pipeline Entropy (Severity: MEDIUM)
**Description**: CI/CD pipelines accumulate flaky tests, unused steps, and
undocumented workarounds that slow every deployment.

**Signals**:
- Build time > 20 minutes for a standard service
- Flaky tests that are "just re-run until they pass"
- Pipeline steps nobody understands but nobody removes

**Impact**: Deploy frequency decreases; engineer frustration increases; DORA degrades.

**Remediation**: Pipeline audit. Flaky test quarantine and elimination. Time budgets per stage.

---

### AP-009: Premature Microservices (Severity: HIGH)
**Description**: Decomposing a monolith into microservices before the domain
is well understood, creating a distributed monolith.

**Signals**:
- Services that always deploy together
- Cross-service synchronous chains of 5+ calls
- No clear domain boundary per service

**Impact**: Operational complexity without scalability benefit. Debugging nightmare.

**Remediation**: Start as modular monolith. Extract services only when domain boundaries stabilize.

---

### AP-010: Standards Without Enforcement (Severity: MEDIUM)
**Description**: Engineering standards exist in a wiki but are never enforced,
leading to gradual erosion and inconsistency.

**Signals**:
- Code style guides that PRs routinely violate
- Architecture decisions documented but not followed
- "We have a standard for that" followed by "but nobody uses it"

**Impact**: Standards become theater; investment in documentation wasted; inconsistency persists.

**Remediation**: Automate enforcement in CI (linters, architecture tests, dependency rules).
Standards not enforceable automatically should be reconsidered.

---

## Organizational Anti-Patterns

### AP-011: Ticket-Driven Engineering (Severity: HIGH)
**Description**: Engineers measure success by tickets closed, not by engineering
outcomes delivered (lead time, reliability, maintainability).

**Signals**:
- "We closed 150 tickets this sprint" with no DORA improvement
- Technical initiatives blocked by lack of tickets
- Code quality declining despite high throughput

**Remediation**: Add engineering outcome metrics to team dashboards. Reserve capacity for
non-ticket work (debt, standards, tooling).

---

### AP-012: Siloed Knowledge (Severity: HIGH)
**Description**: Teams optimize locally without visibility into cross-team patterns,
leading to duplicated solutions to the same problems.

**Signals**:
- Two teams built the same thing in the same quarter
- Architecture reviews happen per-team, not cross-team
- No platform or shared engineering function

**Remediation**: Cross-team architecture council. Shared engineering newsletter.
Inner-source model for shared tools.

---

## Severity Summary

| Anti-Pattern | Severity | DORA Impact | Maintenance Impact |
|---|---|---|---|
| AP-001 Reinvented Wheels | HIGH | Medium | Very High |
| AP-002 Accidental Coupling | HIGH | High | Very High |
| AP-003 Configuration Drift | MEDIUM | Medium | High |
| AP-004 Dependency Hell | HIGH | Low | High |
| AP-005 Test Coverage Debt | HIGH | Very High | Very High |
| AP-006 Documentation Rot | MEDIUM | Low | High |
| AP-007 Hero Culture | CRITICAL | Very High | Critical |
| AP-008 Pipeline Entropy | MEDIUM | High | Medium |
| AP-009 Premature Microservices | HIGH | Medium | Very High |
| AP-010 Standards Without Enforcement | MEDIUM | Low | High |
| AP-011 Ticket-Driven Engineering | HIGH | High | High |
| AP-012 Siloed Knowledge | HIGH | Medium | High |
