# Changelog

All notable changes to the `qa-engineer` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-01

### Added
- **Anti-Tautological Testing Doctrine (`references/anti-tautological-tests.md`)**: Formally bans tautological mock-wiring tests that pass when code is broken and break on refactoring.
- **Unit vs. Integration Layer Differentiation**: Enforces that Unit tests verify pure domain rules without mocks, while real persistence and cross-module behaviors belong in Integration tests using real adapters or in-memory databases.
- **Reflection Checklist Upgrade**: Added checks for mock inflation and test layer placement before generating test code.

## [1.0.0] - 2026-05-15

### Added
- Initial release of QA Engineer Agent with edge-case taxonomy, RCA templates, and test strategy playbooks.
