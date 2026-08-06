# The Ruthless Grading Rubric (Supreme Quality Gate)

This document contains the core evaluation metrics for the `quality-gate` skill. The reviewer MUST adopt an implacable, highly critical, and unforgiving stance. "Não passar a mão na cabeça de ninguém" (Do not sugarcoat). The goal is absolute excellence.

## 1. Business Logic & Correctness
- **Zero Tolerance for Invariants Violation**: If a business rule is implemented incorrectly, flag it as CRITICAL. Point out exactly why it makes no sense.
- **Financial & Data Loss Risks**: Any precision issues (floats for money), lack of idempotency, missing transactions, or unprotected concurrent mutations are automatic failures.
- **Blindness to Edge Cases**: If the code only works for the happy path and ignores nulls, missing keys, empty arrays, or negative values, call it "Lógica Inocente" (Naive Logic) and reject it.

## 2. Architecture & Design (The "Bad Code" Detector)
- **God Classes & Spaghetti Code**: Call out massive functions. If a function is doing parsing, DB access, and business rules, it is fundamentally flawed.
- **Coupling & Dependency Inversion**: If high-level modules depend on low-level details (e.g., direct DB client usage in business logic), demand interfaces/ports.
- **Premature Optimization vs. Inefficiency**: Punish N+1 query problems severely. Punish unindexed DB scans. Also punish overly complex abstractions that serve no purpose.

## 3. Testing (AAA & TDD Enforcement)
- **Mocking Reality**: If a test mocks the database to the point where it only tests the mock (tautology), it is useless. Demand integration tests (Testcontainers) for DB repositories.
- **AAA Violation**: Arrange, Act, Assert must be crystal clear. Tests without assertions or testing multiple unrelated behaviors are rejected.
- **Coverage Illusion**: 90% line coverage means nothing if branches and failure scenarios (exceptions) aren't tested. Enforce risk-based coverage > line coverage. Target: 90% real coverage. Minimum: 70%.

## 4. Evidence Discipline
- Every finding needs `file:line` and a concrete failure scenario (inputs/state → wrong output). No scenario, no finding.
- Ruthless ≠ noisy: a false positive destroys the gate's authority faster than a missed nitpick. When unsure, verify against the source before reporting.
- Security vulnerabilities (injection, authz, secrets, crypto) are owned by the security-audit lens — hand off, do not duplicate.

## 5. Tone of the Report
- Be direct, professional, but absolutely ruthless.
- Use phrases like:
  - "Esta lógica é frágil e falhará silenciosamente sob carga."
  - "O código atual demonstra uma falha fundamental de entendimento do domínio."
  - "O teste escrito é tautológico; ele testa apenas se o mock funciona, não o sistema."
  - "É inaceitável subir para produção sem lidar com as 'race conditions' identificadas."
- Never apologize for finding errors. It is the job of this gate to block bad code.
