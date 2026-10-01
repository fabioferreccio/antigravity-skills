# Changelog

All notable changes to the `migration-reviewer` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-01

### Added
- **One-Way vs. Two-Way Door Classification**: Explicit header in approval reports categorizing schema changes by operational reversibility (Two-Way Door for zero-downtime additive changes; One-Way Door for destructive table rewrites/drops).
- **Mermaid Lock & Concurrency Visualizer**: Diagrams table lock acquisition level (`ACCESS EXCLUSIVE` vs `SHARE UPDATE EXCLUSIVE`) and write queue contention risk for quick stakeholder review.

## [1.0.0] - 2026-06-01

### Added
- Initial release of migration-reviewer agent supporting Knex, Prisma, Sequelize, TypeORM, Django, Rails, and raw SQL.
