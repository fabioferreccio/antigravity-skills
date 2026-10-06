# Changelog

All notable changes to the `code-review` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-10-06

### Added
- **Deep Simplicity & Anti-Overengineering Lenses (`simplicity.md`)**: Explicit audit rules for 5 core anti-patterns:
  - **Overengineering**: Heavyweight design patterns applied to simple, bounded tasks.
  - **Over-Abstraction**: 1-to-1 single-implementer interfaces, empty wrappers, and layers encapsulating 1-2 trivial lines.
  - **Premature Abstraction**: Enforcement of **Rule of Three** and **YAGNI** before abstracting.
  - **Function Fragmentation**: Detection of shallow micro-function proliferation that hurts reading locality and mental flow.
  - **Indirection Overuse**: Anemic pass-through layers forwarding calls without adding logic.
- **Dogmatic Clean Architecture & Anemic Pass-Through Lens (`architecture.md`)**: Guards against excessive layers, trivial UseCases, and pointless 1:1 DTO mappings in Clean Architecture implementations.
- **Integration with `codebase-design` skill**: Automatic complementary skill hook to inject Ousterhout deep-module and leverage heuristics into `simplicity-reviewer` and `architecture-reviewer`.

## [1.3.0] - 2026-10-01

### Added
- **Blast Radius & Reversibility Lens (`blast-radius-doors.md`)**: Operational classification into One-Way Door (Irreversible / High Risk) vs. Two-Way Door (Reversible / Low Risk) and Blast Radius assessment matrix (domains, APIs, database, rollback viability).
- **Show-Me Architectural Summary**: Automated Mermaid diagrams visualizing changes, flows, and boundaries without suppressing comprehensive textual analysis.
- **Active Remediation Protocol (`remediation-protocol.md`)**: Interactive human-in-the-loop suggestion allowing users to apply safe auto-fix commits directly to the branch and choose whether to post inline comments.
- **Coding Standards Enforcement with Graceful Fallback**: Dynamic detection and enforcement of `coding-standards.md`, `.agents/rules/coding-standards.md`, or `standards.md`, with zero review quality degradation when absent, and end-of-review offer to scaffold standards.

## [1.2.0] - 2026-07-09

### Added
- **business-logic-reviewer**: New core review agent that verifies semantic correctness — whether code does what it claims to do. Covers:
  - Semantic naming integrity (function names that promise more than the implementation delivers)
  - Classification & categorization soundness (false dichotomies, non-exhaustive partitions)
  - Domain algorithm correctness (CPF, CNPJ, Luhn, IBAN, mod-11, financial calculations)
  - Boundary & edge case blindness (null, empty, too short/long inputs silently accepted)
  - Mathematical & algorithmic correctness (floating-point money, off-by-one, rounding)
  - Invariant violations (unverified pre/post-conditions)
  - State machine integrity (illegal transitions, missing terminal states)
  - Temporal & ordering assumptions (timezone, DST, distributed ordering)
- **business-logic lens**: New review lens (`references/lenses/business-logic.md`) with 8 focus areas and detailed "how to check" instructions for each
- **domain-expert complementary skill hook**: When a `domain-expert` skill exists in the registry, its domain-specific rules are injected into the business-logic-reviewer context
- Business logic criteria added to severity classification (`severity-rules.yaml`)
- Business logic conflict resolution patterns (`conflict-resolution.md`)
- Evaluation test E-04 for CPF/CNPJ false dichotomy detection

### Changed
- Core review agents increased from 4 to 5 (business-logic-reviewer is always launched)
- Conflict resolution priority updated: `security > architecture > business-logic > database > testing > simplicity > frontend > i18n > error-handling`
- Complementary Skill Delegation section consolidated in Phase 4 of SKILL.md

## [1.1.0] - 2026-06-15

### Added
- Initial polyglot code review system with 9 review agents
- Project indexing with staleness detection
- MR/PR inline comment posting (GitHub, GitLab, Bitbucket)
- Complementary skill detection and delegation
- Severity classification (Crítico / Importante / Menor)
- Finding verification against source code
