# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-05-03

### Added

- **Repository Structure**: Complete Antigravity-native workspace with `.agents/` directory
- **CLI Tool**: `npx antigravity` with install, search, list, update, and doctor commands
- **Skills**:
  - `repository-maintainer` — AI-powered self-governance and quality enforcement
  - `skill-creator` — Guided skill scaffolding and validation
- **CI/CD Pipelines**:
  - `validate.yml` — Structure, frontmatter, and semver validation
  - `release.yml` — Automated npm publish and GitHub release
  - `quality-gate.yml` — PR quality enforcement
  - `sync-catalog.yml` — Automatic catalog regeneration
- **Governance**:
  - CONTRIBUTING.md with full specification
  - CODEOWNERS with review assignments
  - Issue and PR templates
  - Conventional Commits enforcement
- **Catalog System**: Auto-generated `.agents/catalog.json`
- **Validation Scripts**: Comprehensive validation for structure, frontmatter, versioning, and naming
- **Documentation**: Premium README with installation, usage, and contribution guides

---

[1.0.0]: https://github.com/fabioferreccio/antigravity-skills/releases/tag/v1.0.0
