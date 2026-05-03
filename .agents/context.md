# Antigravity Skills Repository — Agent Context

## Repository Purpose

This is the **official public registry** of reusable Antigravity Skills. It is designed as an Antigravity-native workspace where AI agents can discover, validate, create, and maintain skills autonomously.

## Architecture Overview

```
antigravity-skills/
├── .agents/              # Antigravity workspace root
│   ├── skills/           # All published skills
│   ├── templates/        # Skill templates and scaffolding resources
│   ├── rules/            # Repository governance rules (always active)
│   ├── catalog.json      # Auto-generated skill index
│   └── context.md        # THIS FILE — agent orientation
├── cli/                  # npx-installable CLI tool
├── scripts/              # Validation and automation scripts
├── tests/                # Repository-level tests
├── docs/                 # Extended documentation
└── .github/workflows/    # CI/CD pipelines
```

## Key Conventions

1. **Every skill** lives in `.agents/skills/<skill-name>/`
2. **Every skill** must have: `SKILL.md`, `README.md`, `examples/`, `tests/`
3. **SKILL.md** must have valid YAML frontmatter with: name, description, version, author, tags
4. **Versioning** follows Semantic Versioning (MAJOR.MINOR.PATCH)
5. **Commits** follow Conventional Commits format
6. **catalog.json** is auto-generated — never edit manually

## Agent Responsibilities

When operating in this repository, agents should:

- **Validate** all skill structures before committing changes
- **Update** CHANGELOG.md for any skill modifications
- **Bump versions** according to semver rules
- **Run** `npm run validate` before finalizing work
- **Never** store secrets, API keys, or credentials in any file
- **Never** execute destructive commands without explicit user approval

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run validate` | Full validation suite |
| `npm run catalog:sync` | Regenerate catalog.json |
| `npm run test` | Run test suite |
| `npm run doctor` | Diagnose installation issues |

## Security Boundaries

- All skills must declare their security requirements in frontmatter
- Terminal commands default to sandboxed execution
- Network access must be explicitly declared
- Filesystem writes are scoped to the workspace directory
