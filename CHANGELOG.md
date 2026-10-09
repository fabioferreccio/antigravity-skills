# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Ecosystem Bundles & Dependency Matrix in README**: Comprehensive documentation of skill synergy, required vs. optional companion skills, and one-liner bundled installation commands for engineering suites.
- **Enhanced `code-review` Companion Documentation**: Detailed guide in `code-review/README.md` explaining how companion skills (`codebase-design`, `clean-architecture`, `dba-agent`, `security-engineer`, `qa-engineer`, `pr-craftsman`) enrich reviews.

### Fixed
- **CLI Global Antigravity Path**: Corrected machine-local installation and diagnostic paths in `cli/commands/install.js` and `cli/commands/doctor.js` to target `~/.gemini/config/skills/`, aligning with Antigravity's native customization discovery system.

## [1.2.0] - 2026-10-01

### Added

- **New Supreme Skills**:
  - `pr-craftsman` (v1.0.0) — Supreme Pull Request engineering skill that reverse-engineers code diffs and commit sequences into crystal-clear, human-reviewable PRs. Features automated Mermaid architectural flow diagrams, One-Way vs. Two-Way Door classification, test evidence checklists, and reviewer cognitive acceleration.
  - `codebase-design` (v1.0.0) — Supreme software design skill grounded in John Ousterhout's *A Philosophy of Software Design*. Diagnoses shallow modules, collapses unnecessary classitis/pass-through layers, and discovers high-leverage architectural seams.
  - `retrospective-agent` (v1.0.0) — Autonomous compound learning and institutional memory engine. Audits agent session trajectories, compiler backtracking, and PR review comments to update `coding-standards.md` and `AGENTS.md` while actively pruning obsolete rules.
  - `web-pentest-agent` (v1.0.0) — Autonomous web penetration testing skill orchestrating 6-phase security assessments (passive recon, OWASP Top 10, JWT/API analysis, adversarial verification, CVSS v3.1 scoring, and executive/technical reporting).

### Changed

- **Major Skill Upgrades (PR Bottleneck & AX Architecture)**:
  - `code-review` (bumped to **v1.3.0**):
    - Added One-Way vs. Two-Way Door classification for risk triage.
    - Integrated visual Mermaid blast radius diagrams without suppressing textual analysis.
    - Established Active Remediation Protocol with human-in-the-loop interactive suggestions (zero unilateral commits/posting).
    - Added graceful fallback for `coding-standards.md` (baseline quality maintained; creation suggested at conclusion).
  - `clean-architecture` (bumped to **v1.2.0**):
    - Integrated Deep Modules paradigm (`references/deep-modules.md`).
    - Added Anti-Pattern 9 (Anti-Anemic Use Cases & Classitis) to combat shallow pass-through classes.
  - `qa-engineer` (bumped to **v1.1.0**) & `bug-hunter` (bumped to **v1.2.0**):
    - Added `references/anti-tautological-tests.md` banning tautological mock assertions.
    - Enforced strict boundary: pure unit tests with zero mocks for domain logic; real behavioral verification via Testcontainers/in-memory DB for integration tests.
  - `spec-driven-development` (bumped to **v1.1.0**):
    - Expanded SDD workflow to 7 phases (Active Review, Visual PR, Retrospective).
    - Added `references/retrospective-feedback.md` to feed review learnings back into specifications.
  - `migration-reviewer` (bumped to **v1.1.0**):
    - Added One-Way vs. Two-Way Door classification for database changes.
    - Added visual Mermaid database lock and transaction queue analyzer.
  - `quality-gate` (bumped to **v1.2.0**):
    - Added mock inflation audit in Phase 4.
    - Added visual risk dashboard and doors classification in Phase 7.

## [1.1.0] - 2026-07-04

### Added


- **Skills Registry**:
  - `image-media-engine` bumped to **v1.1.0**:
    - **New Script**: `vectorize-image.py` — High-precision bitmap-to-SVG vectorizer using OpenCV contour extraction, Bézier curve fitting, `fill-rule="evenodd"` for transparent cutouts, and optional linear gradients.
    - **New Script**: `export-brandbook-pdf.py` — Automated 10-page 300 DPI agency Brandbook PDF exporter via PIL (no browser Ctrl+P required).
    - **New Reference**: `orchestration-memory-sdd.md` — Sub-agent orchestration architecture, persistent project memory (`.media-engine/projects/<client_id>/`), Loss Function Reward Matrix, Surgical State Locking, and SDD/Prompt-Engineering synergy framework.
    - **New Reference**: `brandbook-pdf-agency-template.md` — Pentagram/Landor-style 10-page PDF layout specification.
    - **New Example**: `high-precision-vectorization-pipeline.md` — End-to-end vectorization workflow.
    - **Expanded SKILL.md**: Discovery matrix updated with persistent memory and PDF automation questions; response format expanded to 5 phases (Discovery, SDD/Vectorization, Sub-Agent Orchestration, Automation Scripts, Frontend Integration).
    - **Eval Suite**: Expanded from 17 to 27 test cases (+10 covering vectorization, PDF export, state locking, orchestration, context compaction, and sketch translation).

- **AI Coding Tool Configurations (Workspace)**:
  - Repository is now fully onboarded with configuration files for Antigravity, Claude Code, Cursor, GitHub Copilot, and Gemini Code Assist.
  - Native MCP configuration for the local orchestrator (`.antigravity/mcp.json`).

- **Skills Registry**:
  - `ai-onboarding` (v1.0.0) — Supreme autonomous skill that performs deep repository analysis and generates all AI initialization files for 7+ AI coding tools (Antigravity, Claude Code, Cursor, GitHub Copilot, Windsurf, Aider, Gemini Code Assist) from a single repo scan. Level 4 Autonomous Operator with 4 internal agents (Scanner, Classifier, Generator, Validator), 13 per-tool templates, 4 references, 4 knowledge graphs, 2 examples (Node.js API + Python monorepo), and 13-case eval suite. Supports New, Update, and Guide modes. Cross-pollinates existing AI configs.

- **Skills Registry**:
  - `clean-architecture` bumped to **v1.1.0**:
    - **Bug Fix**: Corrected `adapters.md`/`drivers.md` references to `adapters-drivers.md` in SKILL.md.
    - **New Modules**: `error-handling.md`, `cqrs-events.md`, `anti-patterns.md`, `contracts-catalog.md`, `observability.md`.
    - **Enriched Modules**: All 7 existing reference modules expanded with interface contracts from production codebase (~70 interfaces absorbed).
    - **Example Tests**: Both examples (CheckoutSaga, PaymentGateway) now include unit tests following Triple AAA.
    - **Golden Answers**: Eval suite now includes expected responses, scoring rubric, and 5 new prompts.
    - **Updated Graph**: Dependency graph includes Shared Kernel, Cross-Cutting, and CQRS nodes.
    - **Level 2.5 Disclaimer**: Orchestrators module notes this is a practical extension, not canonical.

- **Skills Registry**:
  - `local-ai-orchestrator` (v1.0.0) — A unified TypeScript orchestrator that exposes the 5 local AI tools (AST, Chunking, Sandbox, Patch, Infra State) with strict JSON Schemas and async execution wrappers compatible with Ollama, Claude, and Antigravity. Uses polyglot bridging to underlying Python/Node scripts.

- **Skills Registry**:
  - `query-homelab-state` (v1.0.0) — Query the health, available resources (CPU/RAM), and logs of specific containers running in a local cluster or Docker host. Intelligent orchestrator fallback from Docker to Kubernetes. Supports safe log tailing and dual Python/Node.js architecture.

- **Skills Registry**:
  - `apply-structural-patch` (v1.0.0) — Apply surgical code changes using unified Git patch format instead of rewriting the whole file in the chat. Drastically reduces output tokens and avoids syntax truncations. Script handles python/node detection and git apply/patch fallback.

- **Skills Registry**:
  - `bug-hunter` (v1.1.0) — Supreme autonomous skill that performs a comprehensive, multi-agent codebase sweep to identify concrete bugs (correctness, concurrency, monetary, logic, memory, and security flaws) AND structurally audits existing tests. Uses an adversarial verification process via sub-agents to refute false positives for bugs, and evaluates test effectiveness, fragility, and coverage gaps, grouping domains by inferred financial risk. Generates a highly detailed, dual-dashboard markdown report.

- **Skills Registry**:
  - `execute-in-sandbox` (v1.0.0) — Executes unit tests, build commands, or scripts generated by the AI inside a secure, isolated Docker sandbox. Captures exact stdout/stderr to safely evaluate generated code without harming the host system. Supports read-only mounts and configurable images.

- **Skills Registry**:
  - `read-file-chunked` (v1.0.0) — Reads large files in specific chunks with pagination, providing exact lines to the model. Prevents context window overflow and VRAM spikes by extracting only the requested subset of lines. Supports both Python and Node.js environments.

- **Skills Registry**:
  - `explore-codebase-ast` (v1.0.0) — Maps the file tree of a project analyzing the internal structure (AST) to identify inheritances, entities, interfaces, and controllers without blowing up the context window. Uses Python and `tree-sitter` for polyglot support, falling back to Node.js regex parsing. Level 3 complexity with scripts, examples, and eval suite.

- **Skills Registry**:
  - `code-review` (v1.0.0) — Polyglot code review skill that analyzes MRs/PRs or individual files across any language and framework. Generates anchored inline comments on GitHub, GitLab, or Bitbucket via MCP or pre-generated scripts. Uses project indexing for context persistence and delegates to complementary skills when detected. Level 5 complexity with dynamic agent routing, lenses, examples, and test suite.
  - `ux-specialist` (v1.0.0) - UX Specialist Agent for usability, accessibility, and user experience.
  - `devops-agent` (v1.0.0) — DevOps Engineer Agent for platform stability, automation, continuous integration/delivery, and observability. Level 2 complexity with examples and test suite.
  - `enterprise-architect` (v1.0.0) — Enterprise Architect Agent for architectural integrity, governance, and systemic risk analysis. Level 4 complexity with references, graph, examples, and test suite.
  - `product-manager` (v1.0.0) — Senior PM Agent for discovery, prioritization, and strategy with RICE/WSJF/Kano frameworks.
  - `staff-engineer` (v1.0.0) — Staff Engineer Agent for cross-functional engineering diagnosis, redundancy elimination, shared library design, DORA analysis, and organizational scalability. Level 4 complexity with anti-patterns catalog, output templates, heuristics graph, 2 examples, and 16-case eval suite.
  - `dba-agent` (v1.0.0) — DBA Agent specialized in database performance, integrity, and security. Supports query optimization, index design, N+1 detection, migration safety review, transaction audit, partition/shard planning, and replication analysis. Level 4 complexity with principles reference, heuristics graph, 2 examples, and 16-case eval suite (10 valid + 3 misuse + 3 edge cases).
  - `security-engineer` (v1.0.0) — Security Engineer Agent applying Security by Design and defense-in-depth. Covers threat modeling (STRIDE), CVE identification, IAM review, auth/crypto audit, secrets scanning, HTTP header audit, pipeline security, and supply chain analysis. Level 4 complexity with OWASP/CVSS/severity references, agentic state-machine graph, 2 realistic audit examples (Node.js API + Kubernetes IAM), and 16-case eval suite (10 valid + 3 misuse + 3 edge cases). Structured output uses CVSS v3.1 scoring and P0–P3 prioritization.
  - `migration-reviewer` (v1.0.0) — Migration Reviewer Agent that receives database migrations in any format (Knex, Prisma, Sequelize, TypeORM, Django, Rails, raw SQL, or informal descriptions), performs DBA-grade safety and impact analysis, and generates Slack-ready Markdown approval reports for Stack Leaders and Holders. Level 4 complexity with safety-checklist reference, heuristics graph, 2 examples (Knex NOT NULL + informal multi-table), and 16-case eval suite (10 valid + 3 misuse + 3 edge cases). Compatible with Agent Skills open standard (Claude Code + Antigravity).

- **CLI Tooling**:
  - Support for tracking and installing skills from `package.json`.
  - Added postinstall configuration and sync versions on update.
  - Pointed postinstall script to git repository URL.
  - Multi-client installation support: `--claude` flag installs skills to `.claude/skills/` (workspace) or `~/.claude/skills/` (global).
  - `--all-clients` flag installs for all supported clients (Antigravity + Claude Code) in a single command.
  - Same-path guard: prevents `cpSync` errors when installing from inside the registry repository.
  - Updated help text and usage documentation.

---

## [1.0.0] — 2026-05-03


### 🚀 Supreme Release

This initial release establishes the **Antigravity Skills Registry** as a production-grade ecosystem for AI-native capabilities.

#### Added

- **Core Architecture**:
  - Modular workspace structure in `.agents/`.
  - Self-governing repository logic with automated validation.
  - Multi-agent cognitive simulation framework for skills.
- **Skills Registry**:
  - `clean-architecture` (v1.0.0) — Senior system with SOLID, DDD, and modular context loading.
  - `prompt-engineering` (v1.0.0) — High-performance prompt architecture system.
  - `repository-maintainer` (v1.0.0) — AI-powered governance and quality enforcement.
  - `skill-creator` (v2.0.0) — Guided skill scaffolding with agentic reasoning.
  - `spec-driven-development` (v1.0.0) — SDD workflow orchestration.
- **CLI Tooling**:
  - `npx antigravity` for installation, listing, and health checks.
  - Support for Git-based installation: `npx github:fabioferreccio/antigravity-skills install <skill>`.
- **Infrastructure & CI/CD**:
  - Optimized Docker-based CI using `pnpm` and `corepack` (builds in ~20s).
  - Comprehensive validation suite for structure, frontmatter, and naming.
  - Automatic catalog synchronization.

#### Security
- Declared sandboxing policies for every skill.
- No-network-by-default security model.

---

[1.0.0]: https://github.com/fabioferreccio/antigravity-skills/releases/tag/v1.0.0
