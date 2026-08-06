# Project Indexing Protocol (Quality Gate)

A persistent index makes every run after the first one fast, and makes subagent prompts precise: agents receive facts instead of re-scanning the tree. The index lives at `.quality-gate-index.json` in the project root and MUST be added to `.gitignore` (it is machine-local state, not source).

## Step 1 — Discovery order

1. `.quality-gate-index.json` exists → go to Step 3 (staleness check).
2. `.code-review-index.json` exists (written by the `code-review` skill) → import its base facts (`languages`, `frameworks`, `architecture_pattern`, `conventions`, `structure`) as the starting point, then continue to Step 2 to add quality-gate-specific sections.
3. Neither exists → full build (Step 2).

## Step 2 — Full build

Scan cheaply and hierarchically — manifests first, source second, never file-by-file:

1. **Manifests**: `package.json`, `pyproject.toml`, `go.mod`, `pom.xml`, `build.gradle`, `Cargo.toml`, `*.sln`/`*.csproj`/`Directory.Packages.props`, `Gemfile`, `composer.json` → languages, frameworks, test runners, scripts. For .NET, package references also reveal the data stack (EF Core provider, NHibernate + dialect, Dapper) and config lives in `appsettings*.json`, not env files.
2. **Topology**: top 2 directory levels → structure map, architecture pattern (layered, clean, MVC, monorepo).
3. **Test infra**: `docker-compose*.yml`, `testcontainers` imports, `jest.*.config.*`, `pytest.ini`, CI workflows → what exists, what's missing.
4. **Datastores**: detect engine + version from driver dependencies, ORM/migration configs (`schema.prisma` provider, `knexfile` client, `database.yml` adapter, JDBC URLs), connection-string shapes in `.env.example`, and migration SQL dialect — full protocol in `references/polyglot-infra.md`. Record every datastore the code touches (DB, cache, broker). Never assume Postgres.
5. **Business-logic hotspots**: services/usecases/domain directories, files whose names match `payment|billing|order|balance|wallet|invoice|auth` → priority targets for the Ruthless Reviewer.
6. **Security surface** (for the Security Auditor):
   - Input boundaries: controllers, route handlers, GraphQL resolvers, CLI arg parsing, file-upload endpoints.
   - Auth/authz code: middleware, guards, decorators, session/token handling.
   - Raw query sites: `grep` for `query(`, `execute(`, `raw(`, `exec(`, string-built SQL.
   - Crypto usage: imports of crypto/hashing libs.
   - Config: `.env*` files present (names only, NEVER read values into the index), CI secrets references, Dockerfiles.
7. **Coverage baseline**: existing coverage reports (`coverage/`, `lcov.info`, `coverage.xml`) and the command that regenerates them.

## Index schema

```json
{
  "version": "1.0.0",
  "config_hash": "{SHA256_OF_KEY_CONFIG_FILES}",
  "created_at": "{ISO_TIMESTAMP}",
  "languages": ["typescript"],
  "frameworks": ["nestjs"],
  "architecture_pattern": "layered",
  "conventions": { "test_framework": "jest", "naming": "camelCase" },
  "structure": { "src": "source", "test": "test suites", "migrations": "db migrations" },
  "test_infra": {
    "integration_setup": "missing | docker-compose | testcontainers",
    "datastores": [
      { "engine": "sqlserver", "version": "2022", "evidence": "mssql driver + IDENTITY/GO in migrations" },
      { "engine": "redis", "version": "7", "evidence": "ioredis in package.json" }
    ],
    "coverage_command": "npm run test:cov",
    "coverage_baseline": 45.2
  },
  "hotspots": {
    "business_logic": ["src/services/payment.service.ts"],
    "money_paths": ["src/services/payment.service.ts", "src/services/refund.service.ts"]
  },
  "security_surface": {
    "input_boundaries": ["src/controllers/"],
    "auth_code": ["src/auth/"],
    "raw_query_sites": ["src/repositories/report.repository.ts:88"],
    "crypto_usage": ["src/auth/token.service.ts"],
    "env_files": [".env.example"]
  }
}
```

## Step 3 — Staleness check (never hash the whole tree)

Hash only the key config files — languages, frameworks, and conventions only change when they change; hashing the tree would invalidate the index on every commit.

```bash
# POSIX
cat package.json package-lock.json tsconfig.json go.mod pyproject.toml pom.xml 2>/dev/null | sha256sum
```

```powershell
# PowerShell
$files = @('package.json','package-lock.json','tsconfig.json','go.mod','pyproject.toml','pom.xml') | Where-Object { Test-Path $_ }
Get-Content $files -Raw | Out-String | ForEach-Object { (New-Object Security.Cryptography.SHA256Managed).ComputeHash([Text.Encoding]::UTF8.GetBytes($_)) -join '' }
```

- **Hash matches** → load index as-is.
- **Hash differs** → refresh only the affected sections (a changed `package.json` refreshes frameworks/test_infra; it does not require re-mapping hotspots unless directories moved).
- Coverage baseline is refreshed on every run that executes tests, regardless of hash.

## Rules

- NEVER store secret values, connection strings, or `.env` contents in the index — file names and locations only.
- The index is advisory: if an indexed path no longer exists, drop it silently and refresh that section.
- Keep the index under ~50 KB; it is a map, not a mirror.
