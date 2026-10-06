# Architecture Types Reference

## Decision Matrix

```
REQUEST SIGNAL                              → ARCHITECTURE TYPE
────────────────────────────────────────────────────────────────
Single focused task                         → Single Skill
Multiple related capabilities               → Multi-Skill Suite
Complex workflow with sub-tasks              → Orchestrator + Children
Reference docs, conventions, standards       → Static Knowledge
Evolves with project state                   → Dynamic Updating
Audit, validate, critique existing work      → Reviewer
Produce code, docs, configs, artifacts       → Generator
End-to-end process, minimal user input       → Autonomous Operator
```

## Type Definitions

### Single Skill
One responsibility, one activation, one output.
**Example**: Commit message formatter.

### Multi-Skill Suite
Related skills that share context and can be invoked independently or together.
**Example**: Full-stack code review (frontend + backend + DB).

### Orchestrator + Children
A parent skill that delegates work to specialized child skills.
**Example**: CI/CD pipeline manager → (build, test, deploy, notify).

### Static Knowledge
Pure reference material loaded on demand. No execution logic.
**Example**: Internal API style guide.

### Dynamic Updating
Tracks state and adapts behavior based on project evolution.
**Example**: Sprint progress tracker.

### Reviewer
Reads existing work, evaluates against criteria, reports findings.
**Example**: SQL schema naming validator.

### Generator
Produces new artifacts from templates, specs, or user input.
**Example**: License file generator.

### Autonomous Operator
Runs an end-to-end process with minimal human intervention.
**Example**: Cloud deployment orchestrator.
