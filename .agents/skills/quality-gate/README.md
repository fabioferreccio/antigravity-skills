# Quality Gate Skill

The ultimate, unforgiving Quality Gate for production readiness. This meta-skill orchestrates deep repository analysis backed by a persistent project index, ruthless code reviews, a dedicated security audit, strict QA standard enforcement, and automated provisioning and execution of integration test infrastructure. Critical findings pass adversarial verification before reaching the report.

## What it does
- **Project Indexing**: Builds and persists `.quality-gate-index.json` (languages, frameworks, business-logic hotspots, security surface, coverage baseline). Subsequent runs are faster and subagent prompts sharper. Reuses `.code-review-index.json` from the `code-review` skill when present.
- **Deep Code Review**: Finds concrete bugs, race conditions, and architectural flaws. It does not sugarcoat bad logic.
- **Security Audit**: Dedicated auditor hunting injection sinks, broken access control (IDOR, mass assignment), auth/crypto failures, exposed secrets, SSRF, unsafe deserialization, and config hygiene — every finding anchored to `file:line` with an OWASP category and exploit scenario.
- **Adversarial Verification**: Every CRITICAL/HIGH finding is verified against the source (and challenged by a skeptic subagent for security findings) before being reported. Refuted findings are dropped and counted.
- **QA Enforcement**: Evaluates tests for AAA (Arrange, Act, Assert) patterns. Maps untested code and missing failure scenarios, prioritized by financial-risk hotspots.
- **Automated Test Infrastructure**: If your project lacks integration test setups (like Docker/Testcontainers), this skill will generate a `docker-compose.test.yml` (ephemeral loopback ports, tmpfs, healthchecks), spin it up, run your tests, collect the results, and tear it down — always, even on failure.
- **Strict Coverage**: Enforces a minimum of 70% coverage with a target of 90%, focusing on structural efficiency rather than just line hits.

## How to use it
Just type one of the triggers in the chat:
- `run quality gate`
- `verificar prontidão para produção`
- `is this ready for production?`

## Output
It generates a highly critical, strategic Markdown dashboard with a final Go/No-Go verdict for production, including a dedicated security section and a verification-confidence line (confirmed vs refuted findings). Be prepared for harsh, professional feedback.

## Limitations
- **No network access**: dependency vulnerability lookup (CVE advisories) is best-effort offline. When it cannot be verified, the report says so and emits the exact command (`npm audit`, `pip-audit`, `cargo audit`, `govulncheck`) for you to run.
- **Docker optional but recommended**: without Docker, integration infrastructure is not provisioned; the run continues in DEGRADED mode with unit-level suites only.
- **Static analysis**: security findings are code-audit based (SAST-style), not runtime penetration testing.
- **Obscure stacks**: for languages outside the playbook (Node, Python, Java/Kotlin, Go, .NET, Rust, Ruby, PHP), infra generation falls back to generic docker-compose and flags its limits.
