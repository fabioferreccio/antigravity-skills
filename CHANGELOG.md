# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Skills Registry**:
  - `enterprise-architect` (v1.0.0) — Enterprise Architect Agent for architectural integrity, governance, and systemic risk analysis. Level 4 complexity with references, graph, examples, and test suite.
  - `product-manager` (v1.0.0) — Senior PM Agent for discovery, prioritization, and strategy with RICE/WSJF/Kano frameworks.

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
