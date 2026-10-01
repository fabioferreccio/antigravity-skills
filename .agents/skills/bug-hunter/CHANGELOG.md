# Changelog

All notable changes to the `bug-hunter` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-10-01

### Added
- **Tautological Test Detection (`tautologico`)**: Evaluator now distinguishes between brittle/flaky tests and tautological tests (tests that mirror internal mock calls without checking true state mutations or domain invariants).
- **Test Layer Audit (Unit vs. Integration)**: Added layer classification to identify misplaced tests (e.g., database logic tested purely with mocks in the unit layer instead of real verification in integration).

## [1.1.0] - 2026-06-15

### Added
- Dual-dashboard report layout separating bug sweep from test audit.
- Adversarial subagent verification to refute false positives.

## [1.0.0] - 2026-05-01

### Added
- Initial release of bug-hunter skill.
