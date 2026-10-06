# repository-maintainer

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

The **Repository Maintainer** is an internal meta-skill that enables Antigravity agents to autonomously monitor, audit, and maintain the `antigravity-skills` registry. It acts as the AI-powered governance layer, ensuring all skills conform to quality standards, documentation requirements, and security policies.

## When to Use

- When you want to **audit** the entire repository for compliance issues
- When you need to **review documentation** quality across all skills
- When you want to **detect rule violations** (security, structure, naming)
- When preparing a **new release** and need automated changelog/notes generation
- When you need to **sync the catalog** after manual skill changes

## When NOT to Use

- For creating new skills (use `skill-creator` instead)
- For installing skills from the registry (use the CLI)
- For modifying individual skill logic (edit SKILL.md directly)

## Capabilities

| Capability | Description |
|---|---|
| Full Audit | Scans every skill for structure, frontmatter, versioning, and naming compliance |
| Documentation Review | Checks README completeness and suggests improvements |
| Rule Violation Detection | Identifies security risks, missing files, and naming conflicts |
| Release Proposal | Analyzes changes, determines version bump, drafts release notes |
| Catalog Sync | Regenerates catalog.json and verifies consistency |

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## License

[MIT](../../../LICENSE)
