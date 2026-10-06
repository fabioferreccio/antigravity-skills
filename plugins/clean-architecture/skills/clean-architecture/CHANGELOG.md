# Changelog

All notable changes to the `clean-architecture` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-10-01

### Added
- **Deep Modules Architecture (`references/deep-modules.md`)**: Integrated John Ousterhout's *A Philosophy of Software Design* into Clean Architecture. Focuses on high-leverage narrow interfaces hiding complex invariants, preventing Shallow Module Sprawl.
- **Anti-Anemic Use Case Guardrails**: Added Anti-Pattern 9 to `references/anti-patterns.md`, forbidding anemic pass-through use cases that merely wrap repository calls.
- **Depth Assessment**: Added a dedicated evaluation step in multi-agent simulation and output format to audit interface-to-implementation leverage.

## [1.1.0] - 2026-06-15

### Added
- New modules: `error-handling.md`, `cqrs-events.md`, `anti-patterns.md`, `contracts-catalog.md`, `observability.md`.
- Expanded reference modules with ~50 interface contracts.
- Triple AAA unit test examples.

## [1.0.0] - 2026-05-01

### Added
- Initial release of clean-architecture skill with 4-layer separation and Mermaid validation.
