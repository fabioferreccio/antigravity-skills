# Contributing to Antigravity Skills

Thank you for your interest in contributing to the Antigravity Skills registry! This document provides guidelines and standards for contributing new skills or improving existing ones.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Quick Start](#quick-start)
- [Skill Requirements](#skill-requirements)
- [Skill Structure](#skill-structure)
- [SKILL.md Specification](#skillmd-specification)
- [Versioning Policy](#versioning-policy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Quality Gate](#quality-gate)
- [Getting Help](#getting-help)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold this code.

---

## Quick Start

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/antigravity-skills.git
cd antigravity-skills

# 2. Install dependencies
npm install

# 3. Create a new skill using the scaffolder
node scripts/scaffold-skill.js --name my-skill

# 4. Develop your skill
# Edit .agents/skills/my-skill/SKILL.md

# 5. Validate before committing
npm run validate

# 6. Commit using conventional commits
git commit -m "feat(skills): add my-skill v1.0.0"

# 7. Open a Pull Request
```

---

## Skill Requirements

Every skill submitted to this registry **MUST**:

1. **Solve a real problem** — Skills must address a concrete development task
2. **Be self-contained** — All dependencies must be bundled or clearly documented
3. **Include documentation** — README.md with purpose, usage, and examples
4. **Include tests** — At least one test case demonstrating expected behavior
5. **Follow naming conventions** — Lowercase, hyphen-separated (e.g., `sql-architect`)
6. **Use semantic versioning** — Starting at `1.0.0` for stable skills
7. **Declare security boundaries** — Identify any filesystem, network, or terminal access

---

## Skill Structure

Every skill must follow this exact directory structure:

```
.agents/skills/<skill-name>/
├── SKILL.md          # REQUIRED — Core instructions and frontmatter
├── README.md         # REQUIRED — Human-readable documentation
├── examples/         # REQUIRED — At least one usage example
│   └── example-01.md
├── tests/            # REQUIRED — At least one test case
│   └── test-01.md
├── scripts/          # OPTIONAL — Executable scripts (Python, Bash, Node)
└── resources/        # OPTIONAL — Templates, schemas, static assets
```

---

## SKILL.md Specification

Every `SKILL.md` must begin with valid YAML frontmatter:

```yaml
---
name: skill-name
description: >
  Third-person description, keyword-rich, specific enough for precise
  agent activation. Example: "Validates SQL schemas against ISO-27001
  compliance standards and generates migration scripts."
version: 1.0.0
author: Your Name <your@email.com>
tags:
  - category-tag
  - technology-tag
  - use-case-tag
triggers:
  - "semantic trigger phrase 1"
  - "semantic trigger phrase 2"
scope: workspace | global
tools:
  - terminal
  - filesystem
  - browser
security:
  network: false
  filesystem: read | write | read-write
  terminal: sandboxed | unrestricted
---
```

### Body Structure

The Markdown body must include these sections:

```markdown
# Goal
[Clear, concise objective]

# Instructions
1. [Step-by-step execution flow]

# Conventions
- [Standards and patterns to follow]

# Constraints
- [Security limitations]
- [Operational boundaries]

# Output Format
[Expected output structure]

# Examples
## Input
[Sample input]

## Expected Output
[Sample output]
```

---

## Versioning Policy

We follow **Semantic Versioning 2.0.0** (semver.org):

| Change Type | Version Bump | Example |
|---|---|---|
| Documentation fix, typo correction | **PATCH** (1.0.0 → 1.0.1) | Fix typo in README |
| New feature, improved behavior | **MINOR** (1.0.0 → 1.1.0) | Add new output format |
| Breaking change in behavior or interface | **MAJOR** (1.0.0 → 2.0.0) | Change frontmatter schema |

### Rules

- The version in `SKILL.md` frontmatter is the **source of truth**
- Every behavioral change requires a version bump
- Every version bump requires a `CHANGELOG.md` entry
- Skills start at `1.0.0` (no `0.x.x` releases in the public registry)

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Usage |
|---|---|
| `feat` | New skill or feature |
| `fix` | Bug fix in existing skill |
| `docs` | Documentation changes only |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or modifying tests |
| `ci` | CI/CD pipeline changes |
| `chore` | Maintenance tasks |

### Scope

Use the skill name as scope: `feat(sql-architect): add index validation`

---

## Pull Request Process

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feat/skill-name
   ```

2. **Develop and test locally**
   ```bash
   npm run validate
   ```

3. **Update CHANGELOG.md** with your changes

4. **Open a PR** with the provided template

5. **Pass all CI checks** (structure, frontmatter, tests, catalog)

6. **Request review** from a CODEOWNER

7. **Squash merge** after approval

---

## Quality Gate

Your PR will be automatically validated against:

- [ ] **Structure** — Correct directory layout
- [ ] **Frontmatter** — Valid YAML with all required fields
- [ ] **Versioning** — Semver compliance and version bump when required
- [ ] **Documentation** — README.md present with required sections
- [ ] **Tests** — At least one test case in `tests/`
- [ ] **Examples** — At least one example in `examples/`
- [ ] **Naming** — No duplicate skill names
- [ ] **Catalog** — Consistent with `.agents/catalog.json`

---

## Getting Help

- **Issues**: [Open an issue](https://github.com/fabioferreccio/antigravity-skills/issues)
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Antigravity Agent**: Use the `repository-maintainer` skill within Antigravity to get AI-powered help

---

> **Note**: This repository is designed to be maintained by both humans and AI agents. The `repository-maintainer` skill can automatically review contributions and suggest improvements.
