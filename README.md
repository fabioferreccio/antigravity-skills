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

### Install a Skill

```bash
# Install to your current project (workspace-scoped)
npx @anthropic-skills/antigravity install sql-architect

# Install globally (available in all projects)
npx @anthropic-skills/antigravity install sql-architect --global
```

### Explore the Registry

```bash
# List all available skills
npx @anthropic-skills/antigravity list

# Search by keyword
npx @anthropic-skills/antigravity search database

# Get detailed info about a skill
npx @anthropic-skills/antigravity info sql-architect

# Check your installation health
npx @anthropic-skills/antigravity doctor
```

### Installation Paths

| Scope | Path | When to Use |
|---|---|---|
| **Workspace** | `./.agents/skills/<name>/` | Project-specific skills |
| **Global** | `~/.gemini/antigravity/skills/<name>/` | Cross-project utilities |

---

## 📦 Available Skills

| Skill | Version | Description | Tags |
|---|---|---|---|
| `repository-maintainer` | 1.0.0 | AI-powered repository governance, auditing, and quality enforcement | governance, validation |
| `skill-creator` | 1.0.0 | Guided skill scaffolding with 4-phase lifecycle (Discovery → Deploy) | scaffolding, meta-skill |

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

<div align="center">

**Built for the Agentic Era** · Powered by [Google Antigravity](https://github.com/google/antigravity)

</div>
