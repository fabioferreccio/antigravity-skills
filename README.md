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
| **Antigravity** | Global | `~/.gemini/config/skills/<name>/` | Cross-project utilities |
| **Claude Code** | Workspace | `./.claude/skills/<name>/` | Project-specific skills |
| **Claude Code** | Global | `~/.claude/skills/<name>/` | Cross-project utilities |

---

## 📦 Available Skills

| Skill | Version | Description | Tags |
|---|---|---|---|
| `ai-onboarding` | 1.0.0 | Supreme autonomous skill that analyzes any repository and generates all AI initialization files for 7+ tools (Antigravity, Claude Code, Cursor, Copilot, Windsurf, Aider, Gemini) | onboarding, multi-tool, ai-config, bootstrap |
| `apply-structural-patch` | 1.0.0 | Apply surgical code changes using unified Git patch format to drastically reduce output tokens and speed up file modifications | patch, git, token-optimization, surgical-edit |
| `bug-hunter` | 1.2.0 | Supreme autonomous skill that performs a comprehensive, multi-agent codebase sweep to identify concrete bugs with adversarial verification | auditing, bug-hunting, multi-agent, adversarial-review |
| `clean-architecture` | 1.2.0 | Expert cognitive system for designing and refactoring systems using Clean Architecture, SOLID, DDD, CQRS, and comprehensive contracts catalog | architecture, clean-code, ddd, cqrs |
| `codebase-design` | 1.0.0 | Supreme software design skill based on John Ousterhout's Philosophy of Software Design — identifies deep modules, collapses shallow abstractions, eliminates classitis, and finds high-leverage architectural seams | architecture, software-design, deep-modules, refactoring |
| `code-review` | 1.4.0 | Polyglot code review skill that analyzes MRs/PRs or individual files across any language and framework, audits against overengineering and indirection, and generates anchored inline comments | code-review, pull-request, architecture, security |
| `dba-agent` | 1.0.0 | DBA Agent specialized in database performance, integrity, and security | database, performance, sql |
| `devops-agent` | 1.0.0 | Acts as a DevOps Engineer Agent focusing on automation, infrastructure as code, observability, and platform resilience | devops, sre, automation, cicd |
| `enterprise-architect` | 1.0.0 | Enterprise Architect Agent responsible for preserving architectural integrity, scalability, and corporate governance | architecture, governance, adr, c4 |
| `execute-in-sandbox` | 1.0.0 | Executes unit tests, build commands, or arbitrary scripts safely inside a Docker sandbox to self-correct code | testing, sandbox, security, docker |
| `explore-codebase-ast` | 1.0.0 | Maps the file tree of a project analyzing the internal structure (AST) to identify inheritances, entities, interfaces, and controllers without blowing up the context window | architecture, analysis, ast, codebase-mapping |
| `local-ai-orchestrator` | 1.0.0 | A unified TypeScript orchestrator that exposes hyper-optimized local AI tools with strict JSON Schemas and async execution wrappers compatible with Ollama, Claude, and Antigravity | orchestrator, typescript, ollama, mcp, local-ai |
| `migration-reviewer` | 1.1.0 | Migration Reviewer Agent that analyzes migrations (Knex, Prisma, SQL, etc.), evaluates reversibility doors, and generates Slack-ready approval reports | migration, dba, approval, slack |
| `pr-craftsman` | 1.0.0 | Supreme Pull Request engineering skill that analyzes changesets, calculates blast radius, classifies One-Way vs. Two-Way Doors, and renders Mermaid visual diagrams | pull-request, blast-radius, one-way-door, mermaid |
| `product-manager` | 1.0.0 | Guides product discovery, prioritization, and strategy as a Senior Product Manager Agent | product-management, strategy, prd |
| `prompt-engineering` | 1.0.0 | Elite system for designing, auditing, and optimizing high-performance prompt architectures | prompts, optimization, llm |
| `qa-engineer` | 1.1.0 | QA Engineer Agent specialized in defect prevention, anti-tautological test checks, and destructive testing | qa, testing, edge-cases, automation |
| `quality-gate` | 1.2.0 | Unforgiving polyglot Quality Gate with project indexing, ruthless review, OWASP security audit, adversarial verification, and automated test infrastructure | quality-assurance, release-gate, security-audit, test-automation |
| `query-homelab-state` | 1.0.0 | Query the health, CPU/RAM, and logs of containers in Docker or Kubernetes to debug infrastructure autonomously | devops, monitoring, docker, kubernetes, sre |
| `read-file-chunked` | 1.0.0 | Reads large files in specific chunks with pagination, providing exact lines to prevent context window overflow | context-optimization, file-reading, pagination |
| `repository-maintainer` | 1.0.0 | AI-powered repository governance, auditing, and quality enforcement | governance, validation |
| `retrospective-agent` | 1.0.0 | Autonomous compound learning and institutional memory engine that audits AI coding sessions, PR review outcomes, and git history to update coding-standards.md and AGENTS.md while pruning obsolete rules | retrospective, compound-learning, governance, prompt-engineering |
| `security-engineer` | 1.0.0 | Security Engineer Agent specialized in Security by Design and defense in depth | security, appsec, threat-modeling |
| `skill-creator` | 2.0.0 | Guided skill scaffolding with modular architecture and internal agentic reasoning | scaffolding, meta-skill |
| `spec-driven-development` | 1.1.0 | Guide the team through SDD workflow with Specs, Plans, Tasks, Active Review, and retrospective loop | sdd, specification, architecture |
| `staff-engineer` | 1.0.0 | Staff Engineer Agent for cross-functional engineering diagnosis, redundancy elimination, and DORA analysis | staff-engineer, refactoring, dora |
| `frontend-architect` | 1.1.0 | Supreme Front-End Architecture & Component Engineering Skill (Atomic, Compound, Headless, State, Monorepos, A11y/WCAG 2.2, TDD/Triple AAA, Mobile DS, Yuno SDK) | frontend, react, typescript, component-architecture, ux, accessibility, monorepo, performance, mobile-design-system, yuno-sdk |
| `image-media-engine` | 1.1.0 | Supreme Image Processing, Color Engineering, AI Generation, Branding Identity Systems, Retouching, Print Preflight, Web Optimization, High-Precision Vectorization, Automated 300 DPI PDF Brandbook Export, Sub-Agent Orchestration, Persistent Project Memory, State Locking (`/frontend-architect` Synergy) | image-processing, color-engineering, branding-identity, brandbook, vectorization, pdf-exporter, state-locking, subagent-orchestration, persistent-memory |
| `web-pentest-agent` | 1.0.0 | Autonomous web penetration testing skill — passive recon, OWASP Top 10, JWT/auth/API analysis, adversarial verification, CVSS v3.1 scoring, and professional HTML/PDF report generation. Guided onboarding for non-technical users. | pentesting, web-security, owasp, vulnerability-assessment, cvss, report-generation, security-audit |

> 💡 **This registry grows with contributions.** See [Creating Skills](#-creating-skills) to add yours.

---

## 🧩 Skill Ecosystems & Bundles (Dependencies & Delegation)

Skills in this registry are designed with **zero hard runtime dependencies** — every skill is 100% self-sufficient and works out of the box in complete isolation.

However, high-order cognitive skills feature **dynamic delegation hooks**: when companion skills are detected in the workspace (`.agents/skills/`) or global directories (`~/.gemini/config/skills/` or `~/.claude/skills/`), they automatically enrich their analysis with specialized domain intelligence.

### 🔗 Dependency & Synergy Matrix

| Core Skill | Role | Recommended Companion Skills | Status | What it Unlocks |
|---|---|---|---|---|
| **`code-review`** | Code Review & Audit | `codebase-design`<br>`clean-architecture`<br>`dba-agent`<br>`security-engineer`<br>`qa-engineer`<br>`pr-craftsman` | **Optional** *(Highly Recommended)* | Deep module analysis, anti-overengineering audit, SQL/migration checks, OWASP threat modeling, anti-tautological test checks, and visual Mermaid PR diagrams. |
| **`quality-gate`** | Production Gatekeeper | `code-review`<br>`bug-hunter`<br>`security-engineer`<br>`qa-engineer`<br>`execute-in-sandbox` | **Optional** *(Highly Recommended)* | End-to-end ruthless release auditing, adversarial bug verification, automated docker test execution, and strict coverage gating. |
| **`spec-driven-development`** | Autonomous Delivery | `pr-craftsman`<br>`retrospective-agent` | **Optional** *(Recommended)* | Automated high-signal PR generation from specs, post-session retrospective learning, and institutional rule pruning. |
| **`migration-reviewer`** | Migration Auditor | `dba-agent` | **Optional** *(Recommended)* | DBA-grade query analysis, lock risk mitigation, table-rewrite detection, and Slack-ready rollback plans. |
| **`frontend-architect`** | Component Architect | `image-media-engine`<br>`ux-specialist` | **Optional** *(Recommended)* | Automated high-precision vectorization, 300 DPI brandbook generation, WCAG 2.2 accessibility, and design system token alignment. |
| **`web-pentest-agent`** | Web Penetration Testing | `security-engineer`<br>`prompt-engineering`<br>`quality-gate` | **Optional** *(Recommended)* | Deep OWASP verification, adversarial exploit refutation, CVSS v3.1 scoring, and executive HTML/PDF report synthesis. |

---

### 📦 Curated Installation Bundles

Install complete, pre-configured skill suites with a single command:

#### 1. 🔍 Full Code Review & Architecture Suite
Installs the complete review ecosystem with deep module auditing, security, database, and visual PR craft:
```bash
# Antigravity (Workspace)
npx github:fabioferreccio/antigravity-skills install code-review codebase-design clean-architecture dba-agent security-engineer qa-engineer pr-craftsman

# Claude Code (Global)
npx github:fabioferreccio/antigravity-skills install code-review codebase-design clean-architecture dba-agent security-engineer qa-engineer pr-craftsman --claude --global
```

#### 2. 🛡️ Autonomous Quality & Production Gate
Installs the full testing and defect-prevention stack:
```bash
npx github:fabioferreccio/antigravity-skills install quality-gate bug-hunter security-engineer qa-engineer execute-in-sandbox --global
```

#### 3. 📋 Spec-Driven Delivery & Team Memory
Installs the structured specification, PR craftsmanship, and compound learning loop:
```bash
npx github:fabioferreccio/antigravity-skills install spec-driven-development pr-craftsman retrospective-agent --global
```

#### 4. 🗄️ Database & Backend Performance Suite
Installs the complete data-layer architecture and migration review toolkit:
```bash
npx github:fabioferreccio/antigravity-skills install clean-architecture codebase-design dba-agent migration-reviewer --global
```

#### 5. 🎨 Frontend Architecture & Design System Suite
Installs the component engineering, brandbook generation, and UX accessibility engine:
```bash
npx github:fabioferreccio/antigravity-skills install frontend-architect image-media-engine ux-specialist --global
```

#### 6. ⚡ Local AI & Token Optimization Suite
Installs token-saving tools for offline or local AI workflows (Ollama, Claude, Antigravity):
```bash
npx github:fabioferreccio/antigravity-skills install local-ai-orchestrator apply-structural-patch explore-codebase-ast read-file-chunked execute-in-sandbox --global
```

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
