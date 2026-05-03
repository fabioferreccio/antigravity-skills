---
name: spec-driven-development
description: >
  Guide the development team through the rigorous Spec-Driven Development (SDD) workflow,
  creating and maintaining specifications, plans, and tasks as the single source of truth 
  before any code generation, eliminating "vibe coding".
version: 1.0.0
author: Fábio Ferreccio
tags:
  - sdd
  - specification
  - architecture
  - workflow
  - speckit
triggers:
  - "iniciar sdd para"
  - "criar spec de"
  - "escrever especificação para"
  - "gerar tasks do sdd"
  - "speckit"
scope: workspace
tools:
  - filesystem
security:
  network: false
  filesystem: read-write
  terminal: none
---

# Goal
Transform the interaction with AI assistants from code improvisation ("vibe coding") to precise execution based on clear artifacts (Spec-Driven Development). Ensure no implementation begins without explicitly separating and documenting the "What" and the "How".

# Language Rule
- **User interaction**: ALWAYS in Brazilian Portuguese.
- **Internal reasoning + all generated files (specs, plans, tasks, constitution)**: ALWAYS in English.

# Internal State

The assistant must always infer the current project phase by checking the presence of SDD artifacts (such as `constitution.md`, `*.spec.md`, `*.plan.md`, `*.tasks.md`).

# Phase Router

SDD has a strict 5-phase workflow (inspired by GitHub Spec Kit). Always validate the previous phase before proceeding.

```
User Request
  │
  ├─→ Phase 0: CONSTITUTION ──── Exists constitution.md? (If not, generate/request it)
  │
  ├─→ Phase 1: SPECIFICATION ─── Define the "What" (No technical details)
  │
  ├─→ Phase 2: PLAN ──────────── Define the "How" (Architecture, Stack, APIs)
  │
  ├─→ Phase 3: TASKS ─────────── Decompose into atomic tasks
  │
  └─→ Phase 4: IMPLEMENT ─────── Execute tasks with human validation (Checkpoints)
```

# Phase 0: Constitution

If the project lacks general guidelines (a `constitution.md` file), this phase activates.
- **Artifact**: `constitution.md`
- **Content**: Non-negotiable rules, preferred tech stack, coding and quality standards, security, and base architecture.

# Phase 1: Specification (The What)

Given a user feature requirement, write the Specification.
- **Artifact**: `<feature>.spec.md`
- **Focus**: User stories, business value, edge cases, user flows, and measurable acceptance criteria.
- **Constraint**: FORBIDDEN to write technical details, technologies, variables, or software architecture in this phase.

# Phase 2: Plan (The How)

Translate the specification into an architectural blueprint.
- **Artifact**: `<feature>.plan.md`
- **Focus**: Necessary components, Data models, Database schema, API Contracts.
- **Rule**: Every item in the plan must address a requirement present in the `spec.md`. Reference technical decisions based on `constitution.md`.

# Phase 3: Tasks (The Step-by-Step)

Decompose the plan into sequential execution items.
- **Artifact**: `<feature>.tasks.md`
- **Focus**: List of atomic tasks using checkboxes `[ ]`.
- **Rule**: Each task must be small enough to be verified and tested in isolation.

# Phase 4: Implementation

Read the tasks file and implement ONE TASK at a time.
- **Focus**: Clean code.
- **Rule**: After finishing a task, pause and wait for human validation (Blue Diamond Checkpoint). If approved, mark the checkbox with `[x]` in the tasks file and move to the next.

# Constraints
- NEVER start coding without a Spec and Plan.
- ALWAYS use Markdown language for the artifacts.
- If working on a legacy project ("brownfield gap"), try to isolate the new feature in its own spec without rewriting the entire world, and add explicit references to existing files.
