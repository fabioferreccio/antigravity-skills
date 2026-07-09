# Changelog

All notable changes to the `code-review` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
