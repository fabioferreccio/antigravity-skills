# qa-engineer

> **QA Engineer Agent** — Defect Prevention | Destructive Testing | Edge Case Coverage

A senior-level agentic skill that identifies missing coverage, generates test strategies, and produces automation artifacts to guarantee robustness, stability, and predictability — going far beyond happy-path validation.

---

## Overview

| Property     | Value                                        |
|--------------|----------------------------------------------|
| Version      | 1.0.0                                        |
| Scope        | workspace                                    |
| Complexity   | Level 4                                      |
| Architecture | Reviewer + Autonomous Generator              |
| Author       | Antigravity Skill Creator                    |

---

## Activation Triggers

Use any of these phrases to activate the skill:

| Trigger                                     | Best for                                  |
|---------------------------------------------|-------------------------------------------|
| `@qa-engineer`                              | Direct invocation                         |
| `"what edge cases am I missing"`            | Gap analysis on a feature or function     |
| `"generate tests for <component>"`          | Full test suite generation                |
| `"write a test suite for <flow>"`           | E2E or integration test authoring         |
| `"find flaky tests"`                        | CI instability diagnosis                  |
| `"stress test this"`                        | Load/performance test planning            |
| `"review test coverage"`                    | Pre-release coverage audit                |
| `"create regression tests"`                 | Post-bug regression prevention            |
| `"do a root cause analysis"`                | Incident or recurring bug investigation   |

---

## Capabilities

### Edge Case & Boundary Testing
- Identifies nulls, empties, maximum values, negative inputs, overflow, underflow
- Generates boundary value analysis (BVA) and equivalence partitioning cases
- Covers encoding edge cases, locale-specific behavior, and character set boundaries

### Destructive Test Scenarios
- Simulates network failures, timeout cascades, and partial responses
- Tests concurrent access, race conditions, and optimistic locking failures
- Generates chaos scenarios: disk full, OOM, clock skew, dependency degradation

### Regression Test Generation
- Converts every bug report into a non-regressing automated test
- Links each test to the original defect ID and acceptance criterion
- Validates that fixes don't re-introduce related failures

### Mock & Test Double Design
- Designs deterministic mocks for APIs, databases, clocks, and file systems
- Generates factory functions for complex domain objects
- Produces PII-safe synthetic test data at scale

### E2E & Integration Test Authoring
- Generates Playwright, Cypress, or Selenium E2E test scripts
- Covers critical user journeys: login, checkout, data submission flows
- Validates cross-browser behavior and mobile viewports

### Performance & Load Testing
- Defines performance budgets: p50, p95, p99 latency thresholds
- Generates k6, Artillery, or Locust test scripts for load scenarios
- Identifies memory leaks and resource exhaustion patterns

### Root Cause Analysis (RCA)
- Produces structured RCA reports: Timeline → Root Cause → Contributing Factors → Corrective Actions
- Identifies systemic failures vs. isolated defects
- Proposes monitoring improvements to prevent recurrence

---

## Output Structure

Every scenario is structured as:

```
Scenario → Component | Risk Level | Strategy | Framework | Edge Cases | Test Code | Expected Result | Acceptance Criteria
```

Followed by a **Coverage Summary** with confidence rating (RED / ORANGE / YELLOW / GREEN).

---

## Test Frameworks Supported

| Language   | Unit/Integration          | E2E                    | Performance |
|------------|---------------------------|------------------------|-------------|
| JavaScript | Jest, Vitest, Mocha       | Playwright, Cypress    | k6, Artillery |
| TypeScript | Jest + ts-jest, Vitest    | Playwright             | k6          |
| Python     | Pytest, unittest          | Playwright, Selenium   | Locust      |
| Java       | JUnit 5, TestNG           | Selenium, Playwright   | Gatling     |
| Go         | testing, testify          | Playwright             | k6          |
| Ruby       | RSpec, Minitest           | Capybara               | Gatling     |

---

## Directory Structure

```
qa-engineer/
├── SKILL.md              ← Agentic kernel (activate this)
├── README.md             ← This file
├── examples/
│   ├── example-01.md     ← REST API edge case & test generation
│   └── example-02.md     ← E2E checkout flow with race conditions
├── tests/
│   └── test-01.md        ← Evaluation suite (10 prompts + edge cases)
├── references/
│   ├── test-strategies.md    ← Unit vs Integration vs E2E decision guide
│   ├── edge-case-taxonomy.md ← Canonical edge case categories
│   └── rca-template.md       ← Root Cause Analysis structured template
└── graph/
    ├── workflows.yaml    ← Agentic phase transitions
    ├── heuristics.yaml   ← Test type selection rules
    └── risk-matrix.yaml  ← Risk classification model
```

---

## Usage Examples

### Direct invocation
```
@qa-engineer what edge cases am I missing for the user registration flow?
```

### Test generation
```
generate tests for the payment processing service — focus on retry logic and idempotency
```

### Regression after a bug
```
create regression tests for the bug where concurrent cart updates caused negative inventory
```

### Performance validation
```
stress test this — the API must handle 1000 req/s with p99 < 200ms
```

---

## Constraints

- Does **not** use production data — generates PII-safe synthetic data only
- Does **not** make external network calls in unit/integration test code
- Does **not** delete or modify existing passing tests without explicit approval
- Every scenario **must** link to a risk, acceptance criterion, or bug report
- Escalates **immediately** if a bug pattern signals a systemic architectural failure

---

## Evolution Roadmap

| Milestone  | Improvement                                                  |
|------------|--------------------------------------------------------------|
| 10 uses    | Add mutation testing guidance (Stryker, Pitest)              |
| 50 uses    | Integrate property-based testing patterns (fast-check, Hypothesis) |
| 100 uses   | Add contract testing templates (Pact, OpenAPI)               |
| 500 uses   | Generate chaos engineering runbooks (Chaos Monkey, Litmus)   |
| 1000 uses  | Self-updating edge case taxonomy from bug history corpus     |
