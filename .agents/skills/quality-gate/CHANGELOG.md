# Changelog — quality-gate

All notable changes to this skill are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/); versioning follows SemVer.

## [1.1.0] - 2026-07-19

### Added
- **Project indexing protocol** (`references/indexing.md`): persistent `.quality-gate-index.json` with config-hash staleness detection, incremental refresh, and interop with the `code-review` skill's `.code-review-index.json`.
- **Security audit phase** (Phase 3): new `security-auditor` subagent (`agents/security-auditor.md`) and security lens (`references/security-audit.md`) covering OWASP Top 10 — injection sinks per language, broken access control (IDOR, mass assignment), auth/crypto failures, secrets-exposure regex hunt, SSRF, unsafe deserialization, config hygiene, and offline-best-effort dependency audit.
- **Adversarial verification phase** (Phase 6): CRITICAL/HIGH findings are verified against source and challenged by a skeptic subagent before reporting; the report states confirmed vs refuted counts.
- **Modular context loading table** in SKILL.md; subagent templates now receive inlined lens content (`{LENS_CONTENT}`) instead of file-path references they cannot resolve.
- Dedicated **Segurança** section and confidence line in the report Output Format.
- Infra playbook coverage for .NET, Rust, Ruby, and PHP.
- **Datastore Detection Protocol**: engine identified from driver deps, ORM/migration configs, connection-string shapes, and migration SQL dialect — never defaults to Postgres. Ready compose templates for PostgreSQL, MySQL/MariaDB, SQL Server (EULA, password policy, explicit CREATE DATABASE, sqlcmd healthcheck, ARM fallback), MongoDB (replica-set note), Redis, and broker/emulator guidance. Unknown engines → BLOCKED with an explicit question, embedded DBs → no container.
- **Deep .NET data-stack support**: EF Core provider mapping, NHibernate dialect detection (no built-in migrator = reported finding), Dapper, category-based `dotnet test` hooks, coverlet coverage, `ConnectionStrings__` env-var DSN injection.
- .NET security sinks in the audit lens: `FromSqlRaw` interpolation vs `FromSqlInterpolated`, `SqlCommand`/Dapper/NHibernate concatenation, `BinaryFormatter`/`TypeNameHandling` deserialization, `Path.Combine` absolute-path trap, Razor `Html.Raw`, ASP.NET mass assignment via model binding, ADO.NET inline-password regex.

### Changed
- Phases 2–4 (review, security, QA) now run their subagents **in parallel**.
- Compose template hardened: removed obsolete `version:` key, fixed host-port binding replaced by loopback ephemeral ports (`127.0.0.1::5432`), added tmpfs data dirs and project-scoped compose name (`-p <project>-qgate`).
- Docker availability preflight: missing Docker now yields an honest DEGRADED run instead of a failed lifecycle.
- Reviewer/QA agents require concrete failure scenarios and `file:line`/`file:test` evidence; security findings are handed off, not duplicated.
- Secrets discipline: exposed secret values are always masked in reports, with rotation instructions.

### Fixed
- Typos in `references/harsh-grading.md` ("impacable" → "implacable", "Spagetti" → "Spaghetti").
- Governance compliance: added this CHANGELOG and the missing Limitations section in README.

## [1.0.0] - 2026-07-18

### Added
- Initial release: 5-phase workflow (mapping, ruthless review, QA strategy, infra orchestration, verdict), harsh-grading rubric, polyglot infra playbook, PT-BR ruthless dashboard report.
