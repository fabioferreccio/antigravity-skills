# enterprise-architect

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

Enterprise Architect Agent that preserves architectural integrity, scalability,
and corporate governance. It operates through a structured agentic cycle —
Observation → Reflection → Action → Evaluation — to analyze C4 models, ADRs,
API contracts, event topologies, and domain boundaries, then produces
structured, trade-off-aware recommendations.

Designed to prevent silos, reduce coupling, enforce domain boundaries, and
sustain long-term organizational growth.

## When to Use

- Reviewing an Architecture Decision Record (ADR)
- Assessing the blast radius of a cross-cutting change
- Validating bounded contexts and domain boundaries
- Identifying anti-patterns in distributed systems
- Evaluating a new service, platform, or technology adoption
- Auditing observability consistency across systems
- Proposing event-driven decomposition

## When NOT to Use

- Greenfield UI/UX design reviews (use a design skill instead)
- Code-level review of business logic (use clean-architecture or spec-driven-development)
- Security penetration testing or vulnerability scanning
- Cost optimization without architectural context

## Installation

### Local (workspace-scoped)

```bash
npx antigravity install enterprise-architect
```

### Global (available everywhere)

```bash
npx antigravity install enterprise-architect --global
```

## Usage

This skill activates automatically when:

- User mentions architectural reviews, ADRs, coupling analysis, or blast radius
- User describes a system topology and asks for evaluation
- User says "revisar arquitetura", "avaliar impacto arquitetural", or similar
- User shares a C4 diagram, architecture document, or service dependency map
- User asks about bounded contexts, domain violations, or event design

## Examples

### Example 1: ADR Review

**User says**: "Revisa esse ADR que decidimos usar Kafka para todos os eventos"

**Agent does**:
1. Observes: parses the ADR, identifies the decision and alternatives
2. Reflects: evaluates coupling implications, operational complexity, lock-in
3. Acts: generates structured critique with trade-offs and alternatives
4. Evaluates: confirms governance criteria are met

**Output**: Full 9-section analysis with ADR critique and governance recommendation

---

### Example 2: Service Decomposition

**User says**: "Nosso monolito está crescendo demais, como decompor?"

**Agent does**:
1. Observes: maps current module dependencies, team ownership, data flows
2. Reflects: identifies natural bounded contexts, coupling hotspots, SPOFs
3. Acts: proposes decomposition slices, migration path, and event contracts
4. Evaluates: assesses blast radius and organizational impact

**Output**: Decomposition proposal with dependency graph, migration phases, and ADR template

---

### Example 3: Anti-Pattern Audit

**User says**: "Identifica anti-patterns na nossa arquitetura de microsserviços"

**Agent does**:
1. Observes: analyzes service topology, API contracts, shared databases, event flows
2. Reflects: checks against known anti-patterns (→ references/anti-patterns.md)
3. Acts: catalogs findings by severity with remediation steps
4. Evaluates: validates that recommendations reduce coupling and complexity

**Output**: Prioritized anti-pattern report with severity matrix and remediation roadmap

## Limitations

- Cannot execute live infrastructure queries — requires artifacts as input
- Does not replace human architects for decisions with legal/compliance implications
- Quality of output depends on completeness of provided artifacts (C4, ADRs, etc.)
- Does not generate deployment scripts or IaC — only architectural guidance

## Security

| Access | Level |
|---|---|
| Filesystem | read |
| Terminal | sandboxed |
| Network | false |

## Changelog

See the main [CHANGELOG.md](../../CHANGELOG.md) for version history.

## License

[MIT](../../LICENSE)
