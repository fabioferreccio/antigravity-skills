# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
