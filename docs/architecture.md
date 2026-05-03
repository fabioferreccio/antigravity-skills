# Architecture Guide

## Overview

The Antigravity Skills Registry is designed as an **Antigravity-native workspace** — a repository that AI agents can understand, navigate, and maintain autonomously.

## Directory Architecture

```
antigravity-skills/
├── .agents/                          # Antigravity workspace root
│   ├── skills/                       # Published skills registry
│   │   ├── repository-maintainer/    # Self-governance meta-skill
│   │   └── skill-creator/            # Skill scaffolding meta-skill
│   ├── templates/                    # Templates for new skills
│   │   ├── SKILL.template.md         # SKILL.md template
│   │   └── README.template.md        # README template
│   ├── rules/                        # Always-active governance rules
│   │   └── governance.md             # Repository governance rules
│   ├── catalog.json                  # Auto-generated skill index
│   └── context.md                    # Agent orientation document
├── cli/                              # npx-installable CLI tool
│   ├── index.js                      # CLI entry point (Commander.js)
│   ├── commands/                     # Command implementations
│   │   ├── install.js
│   │   ├── search.js
│   │   ├── list.js
│   │   ├── update.js
│   │   ├── doctor.js
│   │   └── info.js
│   └── utils/
│       └── helpers.js                # Shared utilities
├── scripts/                          # Automation scripts
│   ├── validate.js                   # Full validation suite
│   ├── sync-catalog.js               # Catalog regeneration
│   ├── scaffold-skill.js             # New skill scaffolder
│   └── generate-release-notes.js     # Release notes generator
├── tests/                            # Repository-level tests
├── docs/                             # Extended documentation
├── .github/                          # GitHub configuration
│   ├── workflows/                    # CI/CD pipelines
│   │   ├── validate.yml
│   │   ├── release.yml
│   │   ├── quality-gate.yml
│   │   └── sync-catalog.yml
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml
├── package.json
├── CONTRIBUTING.md
├── CHANGELOG.md
├── CODEOWNERS
└── LICENSE (MIT)
```

## Data Flow

```
User Request
    │
    ▼
Agent analyzes context.md
    │
    ▼
Agent reads catalog.json (lightweight index)
    │
    ▼
Agent matches intent → skill description
    │
    ▼
Agent loads full SKILL.md (Progressive Disclosure)
    │
    ▼
Agent executes skill instructions
    │
    ▼
Output returned to user
```

## Security Model

All skills declare their security requirements in SKILL.md frontmatter:

```yaml
security:
  network: false          # Does NOT access the internet
  filesystem: read        # Read-only filesystem access
  terminal: sandboxed     # Terminal commands are sandboxed
```

The governance rules in `.agents/rules/governance.md` enforce:
- No hardcoded secrets
- No destructive commands without approval
- Workspace-scoped filesystem access only
- .gitignore respect

## Versioning

- **Skills**: Each skill has its own semver version in SKILL.md frontmatter
- **Registry**: The package.json version tracks the overall registry version
- **Catalog**: Auto-generated, version matches package.json
