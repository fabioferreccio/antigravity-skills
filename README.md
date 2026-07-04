<div align="center">

# 🚀 Antigravity Skills

### The AI-Native Skills Registry for Google Antigravity

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

**A production-grade public registry of reusable, versioned, and testable Antigravity Skills.**

Discover • Install • Create • Share

[Get Started](#-quick-start) · [Browse Skills](#-available-skills) · [Create a Skill](#-creating-skills) · [Contributing](CONTRIBUTING.md)

</div>

---

## 🎯 Vision

Antigravity Skills transform AI agents from reactive chatbots into **proactive software engineers**. This registry is a curated collection of modular capabilities that extend what Antigravity agents can do — from validating SQL schemas to orchestrating cloud deployments.

Every skill in this registry is:

- ✅ **Versioned** — Semantic versioning with changelog tracking
- ✅ **Documented** — Purpose, usage, examples, and limitations
- ✅ **Tested** — Validation criteria and expected behaviors
- ✅ **Secure** — Declared access requirements and sandboxing
- ✅ **Installable** — One command via `npx`
- ✅ **Self-Governed** — AI agents maintain this repository

---

## ⚡ Quick Start

### Install Skills

```bash
# Install to your current project (workspace-scoped, Antigravity)
npx github:fabioferreccio/antigravity-skills install clean-architecture

# Install multiple skills at once
npx github:fabioferreccio/antigravity-skills install clean-architecture dba-agent

# Install ALL skills from the registry
npx github:fabioferreccio/antigravity-skills install all

# Install globally (available in all projects)
npx github:fabioferreccio/antigravity-skills install clean-architecture --global

# Install for Claude Code
npx github:fabioferreccio/antigravity-skills install migration-reviewer --claude

# Install for Claude Code globally
npx github:fabioferreccio/antigravity-skills install migration-reviewer --claude --global

# Install for ALL supported clients (Antigravity + Claude Code)
npx github:fabioferreccio/antigravity-skills install migration-reviewer --all-clients
```

### Explore the Registry

```bash
# List all available skills
npx github:fabioferreccio/antigravity-skills list
```

### Update Skills

```bash
# Check for updates for all installed skills (local and global, across all clients)
npx github:fabioferreccio/antigravity-skills update

# Apply all available updates
npx github:fabioferreccio/antigravity-skills update --all

# Update a specific skill by name
npx github:fabioferreccio/antigravity-skills update --name clean-architecture
```

### Tracking in `package.json`

By default, when installing skills locally in a workspace that contains a `package.json`, the CLI will track the installed skills in your project configuration under `"antigravity.skills"`.

Additionally, the CLI automatically injects a `postinstall` script pointing to the remote git registry. This guarantees that running `pnpm install` or `npm install` will automatically restore and download all configured skills.

**Example `package.json`:**
```json
{
  "name": "my-project",
  "antigravity": {
    "skills": {
      "clean-architecture": "^1.1.0"
    }
  },
  "scripts": {
    "postinstall": "npx github:fabioferreccio/antigravity-skills install"
  }
}
```

* **Install configured skills:** Simply run `npx github:fabioferreccio/antigravity-skills install` with no arguments to install all skills declared in your `package.json`.
* **Opt-out:** If you do not wish to save skills or configure `postinstall` scripts, pass the `--no-save` flag when installing:
  ```bash
  npx github:fabioferreccio/antigravity-skills install clean-architecture --no-save
  ```

### Installation Paths

| Client | Scope | Path | When to Use |
|---|---|---|---|
| **Antigravity** | Workspace | `./.agents/skills/<name>/` | Project-specific skills |
| **Antigravity** | Global | `~/.gemini/antigravity/skills/<name>/` | Cross-project utilities |
| **Claude Code** | Workspace | `./.claude/skills/<name>/` | Project-specific skills |
| **Claude Code** | Global | `~/.claude/skills/<name>/` | Cross-project utilities |

---

## 📦 Available Skills

| Skill | Version | Description | Tags |
|---|---|---|---|
| `ai-onboarding` | 1.0.0 | Supreme autonomous skill that analyzes any repository and generates all AI initialization files for 7+ tools (Antigravity, Claude Code, Cursor, Copilot, Windsurf, Aider, Gemini) | onboarding, multi-tool, ai-config, bootstrap |
| `apply-structural-patch` | 1.0.0 | Apply surgical code changes using unified Git patch format to drastically reduce output tokens and speed up file modifications | patch, git, token-optimization, surgical-edit |
| `clean-architecture` | 1.1.0 | Expert cognitive system for designing and refactoring systems using Clean Architecture, SOLID, DDD, CQRS, and comprehensive contracts catalog | architecture, clean-code, ddd, cqrs |
| `code-review` | 1.0.0 | Polyglot code review skill that analyzes MRs/PRs or individual files across any language and framework and generates anchored inline comments | code-review, pull-request, architecture, security |
| `dba-agent` | 1.0.0 | DBA Agent specialized in database performance, integrity, and security | database, performance, sql |
| `devops-agent` | 1.0.0 | Acts as a DevOps Engineer Agent focusing on automation, infrastructure as code, observability, and platform resilience | devops, sre, automation, cicd |
| `enterprise-architect` | 1.0.0 | Enterprise Architect Agent responsible for preserving architectural integrity, scalability, and corporate governance | architecture, governance, adr, c4 |
| `execute-in-sandbox` | 1.0.0 | Executes unit tests, build commands, or arbitrary scripts safely inside a Docker sandbox to self-correct code | testing, sandbox, security, docker |
| `explore-codebase-ast` | 1.0.0 | Maps the file tree of a project analyzing the internal structure (AST) to identify inheritances, entities, interfaces, and controllers without blowing up the context window | architecture, analysis, ast, codebase-mapping |
| `local-ai-orchestrator` | 1.0.0 | A unified TypeScript orchestrator that exposes hyper-optimized local AI tools with strict JSON Schemas and async execution wrappers compatible with Ollama, Claude, and Antigravity | orchestrator, typescript, ollama, mcp, local-ai |
| `migration-reviewer` | 1.0.0 | Migration Reviewer Agent that analyzes migrations (Knex, Prisma, SQL, etc.) and generates Slack-ready approval reports | migration, dba, approval, slack |
| `product-manager` | 1.0.0 | Guides product discovery, prioritization, and strategy as a Senior Product Manager Agent | product-management, strategy, prd |
| `prompt-engineering` | 1.0.0 | Elite system for designing, auditing, and optimizing high-performance prompt architectures | prompts, optimization, llm |
| `qa-engineer` | 1.0.0 | QA Engineer Agent specialized in defect prevention and destructive testing | qa, testing, edge-cases, automation |
| `query-homelab-state` | 1.0.0 | Query the health, CPU/RAM, and logs of containers in Docker or Kubernetes to debug infrastructure autonomously | devops, monitoring, docker, kubernetes, sre |
| `read-file-chunked` | 1.0.0 | Reads large files in specific chunks with pagination, providing exact lines to prevent context window overflow | context-optimization, file-reading, pagination |
| `repository-maintainer` | 1.0.0 | AI-powered repository governance, auditing, and quality enforcement | governance, validation |
| `security-engineer` | 1.0.0 | Security Engineer Agent specialized in Security by Design and defense in depth | security, appsec, threat-modeling |
| `skill-creator` | 2.0.0 | Guided skill scaffolding with modular architecture and internal agentic reasoning | scaffolding, meta-skill |
| `spec-driven-development` | 1.0.0 | Guide the team through SDD workflow with Specs, Plans, and Tasks | sdd, specification, architecture |
| `staff-engineer` | 1.0.0 | Staff Engineer Agent for cross-functional engineering diagnosis, redundancy elimination, and DORA analysis | staff-engineer, refactoring, dora |
| `ux-specialist` | 1.0.0 | UX Specialist Agent focused on usability, accessibility, and user experience, reducing friction | ux, ui, accessibility |

> 💡 **This registry grows with contributions.** See [Creating Skills](#-creating-skills) to add yours.

---

## 🛠️ Creating Skills

### Option 1: Use the Scaffolder

```bash
# Clone this repository
git clone https://github.com/fabioferreccio/antigravity-skills.git
cd antigravity-skills
npm install

# Scaffold a new skill
node scripts/scaffold-skill.js --name my-skill --author "Your Name <email>"
```

### Option 2: Let the Agent Do It

Within an Antigravity session, simply say:

> *"Create a new skill called `my-skill` that validates Docker configurations."*

The `skill-creator` meta-skill will guide you through the entire process.

### Skill Structure

Every skill follows this standard structure:

```
.agents/skills/<skill-name>/
├── SKILL.md          # Core instructions + YAML frontmatter (REQUIRED)
├── README.md         # Human-readable documentation (REQUIRED)
├── examples/         # Usage examples (REQUIRED, ≥1 file)
├── tests/            # Test cases (REQUIRED, ≥1 file)
├── scripts/          # Executable scripts (OPTIONAL)
└── resources/        # Templates and static assets (OPTIONAL)
```

### SKILL.md Frontmatter

```yaml
---
name: my-skill
description: >
  Third-person, keyword-rich description for precise agent activation.
version: 1.0.0
author: Your Name <your@email.com>
tags: [category, technology, use-case]
triggers: ["when to activate", "another trigger"]
scope: workspace
tools: [filesystem, terminal]
security:
  network: false
  filesystem: read
  terminal: sandboxed
---
```

📖 **Full guide**: [docs/creating-skills.md](docs/creating-skills.md)

---

## 🔄 Release Process

### For Contributors

1. Create a feature branch: `git checkout -b feat/skill-name`
2. Develop and test: `npm run validate`
3. Update `CHANGELOG.md`
4. Open a Pull Request using the template
5. Pass all CI quality gates
6. Get CODEOWNER approval
7. Squash merge to `main`

### For Maintainers

```bash
# 1. Bump version in package.json
npm version minor

# 2. Push with tags
git push origin main --tags

# 3. CI automatically:
#    - Validates everything
#    - Publishes to npm
#    - Creates GitHub Release
#    - Syncs catalog
```

---

## 🏗️ Architecture

```
antigravity-skills/
├── .agents/              # Antigravity workspace
│   ├── skills/           # Published skills registry
│   ├── templates/        # Skill templates
│   ├── rules/            # Governance rules (always active)
│   ├── catalog.json      # Auto-generated index
│   └── context.md        # Agent orientation
├── cli/                  # npx CLI tool
├── scripts/              # Validation & automation
├── tests/                # Repository tests
├── docs/                 # Documentation
└── .github/workflows/    # CI/CD pipelines
```

📖 **Full architecture**: [docs/architecture.md](docs/architecture.md)

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for:

- Skill requirements and structure
- SKILL.md specification
- Versioning policy (SemVer)
- Commit conventions (Conventional Commits)
- Quality gate checklist
- PR process

---

## 🛡️ Security

Every skill declares its security profile in frontmatter:

```yaml
security:
  network: false       # No internet access
  filesystem: read     # Read-only file access
  terminal: sandboxed  # Sandboxed terminal execution
```

**Repository policies:**
- ❌ No hardcoded secrets or API keys
- ❌ No destructive commands without user approval
- ✅ Workspace-scoped filesystem access
- ✅ `.gitignore` respected

---

## 📜 License

[MIT](LICENSE) © Fábio Ferreccio

---
