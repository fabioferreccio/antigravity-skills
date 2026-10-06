# product-manager

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

Senior Product Manager Agent that guides product discovery, prioritization, and strategy. Synthesizes user pain, business impact, technical feasibility, and operational cost to maximize value and eliminate waste. Enforces hypothesis-driven decisions using RICE, WSJF, Kano, and Opportunity Scoring frameworks.

## When to Use

- Evaluating a new feature request or initiative
- Prioritizing a backlog for sprint/quarter planning
- Generating PRDs, User Stories, or ADRs
- Breaking down large epics into MVP slices
- Auditing an existing roadmap or RFC
- Designing A/B experiments with proper metrics
- Challenging vague or opinion-based requirements

## When NOT to Use

- Pure code implementation (use `spec-driven-development` instead)
- Prompt engineering or optimization (use `prompt-engineering`)
- Architecture reviews (use `clean-architecture`)
- Repository maintenance (use `repository-maintainer`)

## Installation

### Local (workspace-scoped)

```bash
npx antigravity install product-manager
```

### Global (available everywhere)

```bash
npx antigravity install product-manager --global
```

## Usage

This skill activates automatically when:

- The user asks to prioritize backlog items
- The user requests a PRD or product document
- The user wants to evaluate an initiative's impact
- The user mentions product discovery or strategy
- The user asks to analyze product impact

### Execution Modes

| Mode | When | Output |
|---|---|---|
| **Ticket Triage** | Single feature/ticket evaluation | 10-section structured analysis |
| **Backlog Sprint** | Multiple items to rank | Prioritized table with RICE/WSJF |
| **PRD Generation** | New feature/initiative | Full PRD document |
| **Epic Breakdown** | Large initiative | MVP slices + risk matrix |
| **Initiative Audit** | Existing roadmap/RFC | Go/No-Go analysis |
| **Experiment Design** | Hypothesis to validate | A/B experiment spec |

## Examples

### Example 1: Ticket Triage

**User says**: "Recebi 47 tickets pedindo exportação PDF. NPS caiu 4 pontos. 3 clientes enterprise dizem que é blocker."

**Agent does**:
1. Identifies root cause (can't distribute reports)
2. Quantifies financial impact (ARR at risk)
3. Applies RICE + Kano frameworks
4. Generates 10-section structured analysis
5. Recommends GO with scoped MVP

See [example-01-ticket-triage.md](examples/example-01-ticket-triage.md) for full output.

### Example 2: Backlog Prioritization

**User says**: "Priorize: dark mode, crash fix, redesign, migração de banco, integração PIX"

**Agent does**:
1. Analyzes each item independently
2. Scores with RICE and classifies with Kano
3. Produces ranked table with justifications
4. Rejects low-impact items, flags uncertain ones for investigation

See [example-02-backlog-sprint.md](examples/example-02-backlog-sprint.md) for full output.

## Language

- **Default**: All interaction and documents in Brazilian Portuguese (PT-BR)
- User can request any other language explicitly

## Compatibility

This skill is independent but works well alongside:
- **spec-driven-development**: After PM validates an initiative as GO, SDD can formalize the specification
- **clean-architecture**: PM identifies technical risks, Clean Architecture reviews the implementation design

## Directory Structure

```
product-manager/
├── SKILL.md              # Core skill kernel (~140 lines)
├── README.md             # This file
├── references/
│   ├── frameworks.md     # RICE, WSJF, Kano, Opportunity Scoring
│   ├── templates.md      # PRD, User Story, ADR, Epic, A/B templates
│   └── principles.md     # 10 operational principles with examples
├── graph/
│   ├── workflows.yaml    # 4-phase agentic cycle definition
│   └── heuristics.yaml   # Decision rules for modes, frameworks, verdicts
├── examples/
│   ├── example-01-ticket-triage.md
│   └── example-02-backlog-sprint.md
└── tests/
    └── eval-suite.yaml   # 10 primary + 3 misuse + 3 edge case tests
```

## Limitations

- Does not connect directly to Jira/Linear APIs (requires user to paste data)
- Framework scores are estimates based on provided data quality
- Cannot access real-time analytics — depends on user-provided metrics
- Does not replace human judgment on strategic trade-offs

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## Changelog

See the main [CHANGELOG.md](../../CHANGELOG.md) for version history.

## License

[MIT](../../LICENSE)
