---
name: skill-creator
description: >
  Interactive meta-skill that designs, scaffolds, validates, and evolves
  Antigravity Skills using modular architecture, internal agentic reasoning,
  structured knowledge graphs, and production-grade outputs. Activates when
  the user wants to create, teach, or add a new skill to the registry.
version: 2.0.0
author: Fábio Ferreccio
tags:
  - scaffolding
  - creation
  - automation
  - meta-skill
  - architecture
triggers:
  - "create a new skill"
  - "scaffold a skill"
  - "add a skill to the registry"
  - "I want to teach the agent"
  - "build a new capability"
  - "create a skill for"
scope: workspace
tools:
  - filesystem
  - terminal
security:
  network: false
  filesystem: read-write
  terminal: sandboxed
---

# Goal

Create world-class Antigravity Skills that outperform public generators in activation precision, token efficiency, and production readiness. Every generated skill is a living cognitive system — not a simplistic instruction file.

# Language

- **User interaction**: Brazilian Portuguese
- **Internal reasoning + all generated files**: English

# Internal Agents

Before producing output, simulate these agents sequentially. Load each from `agents/` only when its phase activates.

```
AGENT              PHASE        ROLE
───────────────────────────────────────────────────────
Historian          Discovery    Extract patterns from existing skills
Architect          Architecture Design structure + classify type
Critic             Fit Test     Find flaws, reject weak requests
Optimizer          Construction Reduce tokens, sharpen triggers
Evaluator          Quality Gate Create tests + benchmarks
Evolution Engine   Finalization Plan improvement trajectory
```

# Phase Router

Follow `graph/workflows.yaml` for transitions. Summary:

```
User Request
  │
  ├─→ Phase 1: DISCOVERY ──────── Ask ≤5 questions (PT-BR)
  │
  ├─→ Phase 2: SKILL FIT TEST ── Pass → continue │ Fail → reject + suggest alternative
  │
  ├─→ Phase 3: ARCHITECTURE ───── Classify type (→ references/architecture-types.md)
  │                                Set complexity (→ references/complexity-levels.md)
  │
  ├─→ Phase 4: CONSTRUCTION ───── Generate files following conventions (→ references/conventions.md)
  │                                Apply safety rules (→ references/safety-rules.md)
  │                                Check anti-patterns (→ graph/anti-patterns.yaml)
  │
  ├─→ Phase 5: QUALITY GATE ───── 5-point self-evaluation. Any NO → revise.
  │
  ├─→ Phase 6: VALIDATION ─────── npm run validate + catalog:sync
  │
  └─→ Phase 7: FINALIZATION ───── Summary + evolution plan + commit suggestion
```

# Phase 1: Discovery

Ask up to 5 strategic questions in Portuguese. Skip if context is sufficient.

```
□ What recurring problem does this solve?
□ Who uses it and how often?
□ What tools/files/frameworks are involved?
□ What failure would be unacceptable?
□ What phrases should trigger activation?
```

# Phase 2: Skill Fit Test

→ Load `agents/critic.md`
→ Apply criteria from `graph/heuristics.yaml` → `skill_fit`

Must satisfy ≥1: repeated workflow | saves time | reduces errors | enforces standards | expert reasoning | automation | cross-session reuse

**Fail** → reject in Portuguese, suggest alternative. **No files created.**

# Phase 3: Architecture Decision

→ Load `agents/architect.md` + `agents/historian.md`
→ Classify using `graph/heuristics.yaml` → `architecture_selection`
→ Reference: `references/architecture-types.md`
→ Set level: `references/complexity-levels.md`

Explain choice briefly in Portuguese.

# Phase 4: Output Construction

→ Load `agents/optimizer.md`
→ Use templates from `.agents/templates/`
→ Follow `references/conventions.md`
→ Apply `references/safety-rules.md`
→ Check `graph/anti-patterns.yaml`

Generate:
1. **SKILL.md** — lean kernel with routing logic
2. **README.md** — docs for both workspace + global scope
3. **examples/** — realistic usage (≥1)
4. **tests/** — eval suite with 10 prompts + 3 misuse + 3 edge cases
5. **scripts/** — if Level 3+
6. **references/** — if Level 4+
7. **graph/** — if Level 4+ and high complexity
8. **5 trigger alternatives** — ranked by activation quality

# Phase 5: Quality Gate

→ Load `agents/evaluator.md`

```
□ Better than public GitHub skills?
□ Token-efficient context cost?
□ Expert-grade daily utility?
□ Precise activation, no false triggers?
□ Evolvable over time?
```

Any NO → return to Phase 4 and revise.

# Phase 6: Validation

```bash
npm run validate:structure
npm run validate:frontmatter
npm run validate -- --duplicates
npm run catalog:sync
```

Present results. Any failure → fix and re-run.

# Phase 7: Finalization

→ Load `agents/evolution-engine.md`

1. Update CHANGELOG.md
2. Present summary (see Output Format below)
3. Suggest: `git commit -m "feat(skills): add <name> v1.0.0"`
4. Propose self-improvement for the created skill

# Constraints

- Do NOT create skills that fail the Skill Fit Test
- Do NOT skip required files (SKILL.md, README.md, examples/, tests/)
- Do NOT hardcode secrets — use env vars
- Do NOT execute destructive commands without confirmation
- Do NOT generate fake benchmarks
- ALWAYS validate before presenting as complete
- ALWAYS start from `.agents/templates/`
- ALWAYS check `graph/anti-patterns.yaml` before finalizing

# Output Format

```
## ✅ Skill Created

Name:         <skill-name>
Version:      1.0.0
Architecture: <type>
Scope:        <workspace|global>
Path:         .agents/skills/<skill-name>/

Files:  ✅ SKILL.md  ✅ README.md  ✅ examples/  ✅ tests/

Quality:  ✅ Expert  ✅ Efficient  ✅ Precise  ✅ Evolvable

Triggers (ranked):
  1. <best>
  2. <alt-2>
  3. <alt-3>

Evolution:
  10 uses  → <improvement>
  100 uses → <improvement>
  1000 uses → <improvement>

Next: review → validate → commit → PR
```
