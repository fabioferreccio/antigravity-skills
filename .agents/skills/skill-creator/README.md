# skill-creator

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

The **Skill Creator** is a meta-skill that transforms Antigravity agents into skill architects. It guides users through the complete lifecycle of creating a new skill — from requirements gathering to validation — ensuring every generated skill meets the repository's quality standards.

## When to Use

- When you want to **create a new skill** for the registry
- When you want to **teach the agent** a new capability
- When you need to **scaffold** a compliant skill structure quickly
- When you want to **automate** the creation of boilerplate files

## When NOT to Use

- For auditing existing skills (use `repository-maintainer` instead)
- For installing skills from the registry (use the CLI)
- For editing existing skill logic (edit files directly)

## How It Works

The Skill Creator operates in **4 phases**:

### Phase 1: Discovery
The agent conducts a structured interview to understand:
- Problem statement and use case
- Trigger phrases for activation
- Required tools and security level
- Complexity level (1-5)

### Phase 2: Scaffolding
Generates the complete skill directory with:
- `SKILL.md` with valid frontmatter and instructions
- `README.md` with full documentation
- `examples/` with at least one usage example
- `tests/` with at least one test case
- `scripts/` and `resources/` for higher complexity levels

### Phase 3: Validation
Runs the full validation suite:
- Structure check
- Frontmatter validation
- Duplicate name detection
- Catalog synchronization

### Phase 4: Finalization
- Updates CHANGELOG.md
- Suggests conventional commit message
- Provides PR creation guidance

## Complexity Levels

| Level | Components | Example |
|---|---|---|
| 1 | SKILL.md only | Style guide enforcer |
| 2 | + examples | Git commit formatter |
| 3 | + scripts | Database schema validator |
| 4 | + resources/templates | License generator |
| 5 | + MCP integration | Cloud deployment orchestrator |

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## License

[MIT](../../../LICENSE)
