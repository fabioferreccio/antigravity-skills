# skill-creator

> **Version**: 2.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

The **Skill Creator** is an elite meta-skill that transforms Antigravity agents into skill architects. It operates as a **modular cognitive system** — a lean orchestration kernel backed by 6 internal agents, 4 knowledge graphs, and structured references — ensuring every generated skill is token-efficient, evolvable, and production-ready.

## Architecture

```
skill-creator/
├── SKILL.md                 ← Lean kernel: routing + orchestration
├── agents/                  ← 6 internal cognitive agents
│   ├── architect.md         Structure + type classification
│   ├── critic.md            Flaw detection + rejection logic
│   ├── optimizer.md         Token compression + trigger sharpening
│   ├── historian.md         Pattern extraction from existing skills
│   ├── evaluator.md         Test suite + benchmark creation
│   └── evolution-engine.md  Improvement trajectory planning
├── graph/                   ← Structured knowledge graphs
│   ├── ontology.yaml        Skill type taxonomy + relationships
│   ├── workflows.yaml       Phase orchestration + transitions
│   ├── heuristics.yaml      Decision rules (fit, architecture, triggers)
│   └── anti-patterns.yaml   Common mistakes + fixes
├── references/              ← On-demand documentation
│   ├── architecture-types.md   8 architecture archetypes
│   ├── complexity-levels.md    Levels 1-5 with directory templates
│   ├── conventions.md          Naming, versioning, frontmatter rules
│   └── safety-rules.md         Constraints + security profiles
├── examples/
│   └── create-sql-validator.md
└── tests/
    └── test-creation-lifecycle.md
```

## Design Principles

| Principle | Implementation |
|---|---|
| Modules over monoliths | SKILL.md is a router; heavy content lives in agents/, graph/, references/ |
| Retrieval over preload | Agents and references loaded only when their phase activates |
| Trees over paragraphs | Decision logic encoded as trees and YAML graphs |
| Graphs over repetition | Ontology, workflows, heuristics as structured YAML |

## When to Use

- When you want to **create a new skill** for the registry
- When you want to **teach the agent** a new capability
- When you need to **scaffold** a compliant skill structure quickly
- When you want to **design architecture** for complex multi-skill systems

## When NOT to Use

- For auditing existing skills → use `repository-maintainer`
- For installing skills → use the CLI
- For editing existing skill logic → edit files directly
- For requests that fail the Skill Fit Test → the skill will reject these

## How It Works

### Phase Flow

```
User Request
  │
  ├─→ Phase 1: DISCOVERY ──────── Ask ≤5 strategic questions (PT-BR)
  │                                 Agent: Historian (scan existing patterns)
  │
  ├─→ Phase 2: SKILL FIT TEST ── Pass → continue │ Fail → reject + suggest
  │                                 Agent: Critic
  │                                 Graph: heuristics.yaml → skill_fit
  │
  ├─→ Phase 3: ARCHITECTURE ───── Classify type + set complexity
  │                                 Agents: Architect + Historian
  │                                 Refs: architecture-types.md, complexity-levels.md
  │
  ├─→ Phase 4: CONSTRUCTION ───── Generate all files
  │                                 Agent: Optimizer
  │                                 Refs: conventions.md, safety-rules.md
  │                                 Graph: anti-patterns.yaml
  │
  ├─→ Phase 5: QUALITY GATE ───── 5-point self-evaluation
  │                                 Agents: Critic + Optimizer + Evaluator
  │                                 Any NO → return to Phase 4
  │
  ├─→ Phase 6: VALIDATION ─────── npm run validate + catalog:sync
  │
  └─→ Phase 7: FINALIZATION ───── Summary + evolution plan
                                    Agent: Evolution Engine
```

### Internal Agents

| Agent | Phase | Responsibility |
|---|---|---|
| **Historian** | Discovery | Extract patterns from existing skills |
| **Architect** | Architecture | Design structure + classify type |
| **Critic** | Fit Test + Quality Gate | Find flaws, reject weak requests |
| **Optimizer** | Construction | Reduce tokens, sharpen triggers |
| **Evaluator** | Quality Gate | Create tests + benchmarks |
| **Evolution Engine** | Finalization | Plan improvement trajectory |

### Architecture Types

| Type | When to Use |
|---|---|
| Single Skill | One focused responsibility |
| Multi-Skill Suite | Related capabilities sharing context |
| Orchestrator + Children | Complex workflow with delegated sub-tasks |
| Static Knowledge | Reference material, conventions, standards |
| Dynamic Updating | Skill that evolves with project state |
| Reviewer | Audit, validate, or critique existing work |
| Generator | Produce code, docs, configs, or artifacts |
| Autonomous Operator | End-to-end process with minimal user input |

### Complexity Levels

| Level | Components | Example |
|---|---|---|
| 1 | SKILL.md only | Style guide enforcer |
| 2 | + examples | Git commit formatter |
| 3 | + scripts | Database schema validator |
| 4 | + references + templates + graph | License generator |
| 5 | + MCP integration | Cloud deployment orchestrator |

## Language Rules

| Context | Language |
|---|---|
| User conversation | Brazilian Portuguese |
| Internal reasoning | English |
| Generated skill files | English |

## Installation

### Workspace Scope (team/project shared)
```
.agents/skills/skill-creator/
```

### Global Scope (personal reusable)
```
~/.gemini/antigravity/skills/skill-creator/
```

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## License

[MIT](../../../LICENSE)
