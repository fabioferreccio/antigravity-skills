# staff-engineer

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

The **Staff Engineer** skill activates a specialized agent focused on cross-functional engineering impact. It multiplies productivity across teams by detecting redundancy, creating reusable abstractions, enforcing architectural standards, and accelerating engineering velocity through a systematic agentic cycle: **Observe → Reflect → Act → Evaluate**.

Unlike a standard code reviewer or architect, this skill operates at the **organizational level** — identifying patterns, bottlenecks, and duplication that span multiple teams, repositories, and pipelines.

## When to Use

- Auditing multiple repositories for duplicated logic or libraries
- Designing shared SDKs, libraries, or platform components
- Standardizing architectural patterns across teams
- Diagnosing slow onboarding or high cognitive load for new engineers
- Analyzing DORA metrics to identify engineering bottlenecks
- Triaging and prioritizing technical debt
- Proposing cross-team standards with adoption playbooks
- Optimizing CI/CD pipelines across the organization
- Generating ADRs for cross-cutting technical decisions

## When NOT to Use

- For single-service, single-team refactoring without cross-team impact
- For feature development or product discovery (use `product-manager` skill instead)
- For pure architectural governance reviews (use `enterprise-architect` skill instead)
- When you have less than 2 teams or 2 codebases to compare
- For security audits or compliance reviews

## Installation

### Local (workspace-scoped)

```bash
npx antigravity install staff-engineer
```

### Global (available everywhere)

```bash
npx antigravity install staff-engineer --global
```

## Usage

This skill activates automatically when:

- User mentions "redundância entre times", "padronizar", "shared library", "débito técnico"
- User asks for cross-team engineering analysis or diagnosis
- User mentions "staff engineer", "escalar engenharia", or "onboarding"
- User provides multiple repos or pipeline configs for comparison

## Examples

### Example 1: Redundancy Audit

**User says**: "Analisar redundância entre times de backend e platform"

**Agent does**:
1. Observes: maps all repositories, dependencies, and utility functions
2. Reflects: identifies duplicated authentication, logging, and error-handling logic
3. Acts: produces a duplication map with consolidation plan
4. Evaluates: estimates lead time savings and bug reduction

**Output**: Redundancy audit with prioritized consolidation roadmap

---

### Example 2: Shared Library Design

**User says**: "Criar uma shared library para autenticação JWT usada em 4 serviços"

**Agent does**:
1. Audits all 4 service implementations for divergence
2. Designs a versioned SDK with a stable API contract
3. Proposes a migration path (strangler fig pattern)
4. Includes rollback strategy and adoption playbook

**Output**: SDK specification + phased migration plan

---

### Example 3: DORA Analysis

**User says**: "Deploy frequency caiu de 5x/dia para 1x/semana. Diagnosticar."

**Agent does**:
1. Identifies DORA metric regression (deployment frequency)
2. Investigates probable causes: pipeline slowness, flaky tests, review bottlenecks
3. Proposes specific improvements for each root cause
4. Estimates expected DORA improvement per action

**Output**: Bottleneck map + prioritized improvement roadmap

---

### Example 4: Technical Debt Triage

**User says**: "Temos um backlog de 80 itens de débito técnico. Como priorizar?"

**Agent does**:
1. Categorizes debt by type: architectural, code quality, dependency, test coverage
2. Scores by impact (maintenance cost, bug rate, lead time effect)
3. Identifies quick wins vs. strategic investments
4. Produces amortization strategy per quarter

**Output**: Prioritized debt map + quarterly amortization plan

## Limitations

- Requires actual repository/pipeline context to produce accurate analysis (not hypothetical)
- Cannot access private repositories or internal dashboards autonomously
- Does not replace full architectural reviews for complex distributed systems
- DORA analysis requires metric data from CI/CD tools

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## Related Skills

- [`enterprise-architect`](./../enterprise-architect/README.md) — for deep architectural governance
- [`product-manager`](./../product-manager/README.md) — for product initiative prioritization
- [`clean-architecture`](./../clean-architecture/README.md) — for refactoring within clean architecture principles

## Changelog

See the main [CHANGELOG.md](../../CHANGELOG.md) for version history.

## License

[MIT](../../LICENSE)
