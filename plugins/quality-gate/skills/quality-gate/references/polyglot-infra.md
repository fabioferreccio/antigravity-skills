# Polyglot Test Infrastructure Playbook

This reference provides instructions for the `infra-manager` subagent to generate and orchestrate test infrastructure (specifically Docker/Testcontainers) dynamically across different programming languages.

## Preflight

Always check availability before promising execution:

```bash
docker info --format '{{.ServerVersion}}'
```

- Docker unavailable → STATUS: DEGRADED. Run only suites that need no containers, and report the infra section as DEGRADED with instructions. Never fake results.
- Docker available → proceed with the lifecycle below.

## General Strategy

If the project lacks an integration test environment, the agent MUST create a `docker-compose.test.yml` at the root, along with any necessary setup scripts.

Rules that prevent flaky or conflicting runs:

- **Never bind fixed host ports** (`"5432:5432"` collides with a local Postgres). Bind loopback + ephemeral (`"127.0.0.1::5432"`) and resolve with `docker compose port db-test 5432`, or use a dedicated non-default port. Export the resolved port to the test suite via environment variable (e.g., `TEST_DB_URL`).
- **Use tmpfs for data dirs** — test databases are disposable; RAM-backed storage doubles speed and guarantees clean state.
- **Healthchecks are mandatory** — `up -d --wait` only works if every service defines one.
- **Project-scoped names** — pass `-p <project>-qgate` so teardown never touches unrelated containers.

## Datastore Detection Protocol (NEVER assume Postgres)

Detect the actual datastore(s) BEFORE generating any compose file. Evidence, in priority order:

1. **Existing infra**: `docker-compose*.yml` services, `Dockerfile`, `.devcontainer` — reuse the images/versions already declared.
2. **Driver dependencies in manifests**:
   - Node: `pg`/`postgres` → PostgreSQL · `mysql`/`mysql2`/`mariadb` → MySQL/MariaDB · `mssql`/`tedious` → SQL Server · `mongodb`/`mongoose` → MongoDB · `redis`/`ioredis` → Redis · `oracledb` → Oracle
   - Python: `psycopg2`/`asyncpg` · `pymysql`/`mysqlclient`/`aiomysql` · `pyodbc`/`pymssql` · `pymongo`/`motor` · `redis` · `cx_Oracle`/`oracledb`
   - Java: JDBC driver artifacts (`postgresql`, `mysql-connector`, `mssql-jdbc`, `ojdbc`) and `spring.datasource.url` dialect
   - .NET: EF Core provider packages (`Npgsql.*`, `Pomelo.*.MySql`, `Microsoft.EntityFrameworkCore.SqlServer`, `MongoDB.Driver`)
   - Go: `lib/pq`/`pgx` · `go-sql-driver/mysql` · `denisenkom/go-mssqldb`/`microsoft/go-mssqldb` · `mongo-driver`
3. **ORM/migration config**: `prisma/schema.prisma` (`provider =`), `knexfile` (`client:`), TypeORM `type:`, `alembic.ini`/SQLAlchemy URL, `application.yml` datasource, Django `ENGINE`, Rails `database.yml` (`adapter:`), Flyway/Liquibase URLs. .NET: EF Core `UseSqlServer/UseNpgsql/UseMySql/UseSqlite` calls in `Program.cs`/`Startup.cs`, NHibernate `hibernate.cfg.xml` or Fluent config (`MsSql2012Dialect`, `PostgreSQLDialect`, `MySQLDialect` — the dialect class names the engine), FluentMigrator/DbUp migration projects.
4. **Connection-string shapes** in `.env.example`/config (NEVER read real `.env` values into reports): `postgres://` · `mysql://` · `sqlserver://` / ADO.NET style `Server=...;Database=...;` (`Encrypt=`/`TrustServerCertificate=` ⇒ SQL Server; `Port=5432` ⇒ Postgres) · `mongodb(+srv)://` · `redis://` · `jdbc:<dialect>:`. .NET reads them from `appsettings*.json` `ConnectionStrings` section and `ConnectionStrings__<Name>` env vars — check both.
5. **Migration SQL dialect**: `AUTO_INCREMENT` (MySQL) · `IDENTITY`/`NVARCHAR`/`GO` batches (SQL Server) · `SERIAL`/`gen_random_uuid()` (Postgres).

Rules:
- Multiple datastores detected (e.g., Postgres + Redis) → one service per datastore, all with healthchecks; `up -d --wait` gates on all of them.
- Conflicting evidence (driver says MySQL, migrations say Postgres) → report the conflict and pick the migration dialect (it is what the schema actually runs on).
- **No datastore detected or an unsupported one (Oracle, DB2, exotic)**: do NOT guess and do NOT silently default to Postgres. Set STATUS: BLOCKED, state exactly what evidence is missing, and ask the user for the engine + version. Getting lost is forbidden; being explicit about not knowing is mandatory.
- SQLite/H2/embedded detected → no container needed; run the suite directly and say so.
- Record the detected engine + version in the index (`test_infra.datastores`).

## Compose Templates per Datastore

Same rules for all: no top-level `version:` key (obsolete in Compose v2), loopback-only ephemeral host ports, tmpfs data dirs, mandatory healthcheck. Match the major version to what production uses when the evidence shows it (image tags in compose/Dockerfile, `mysql2` peer ranges, JDBC URL, etc.).

### PostgreSQL (default port 5432)

```yaml
services:
  db-test:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
      POSTGRES_DB: test_db
    ports:
      - "127.0.0.1::5432"   # loopback-only, ephemeral host port — no collisions, not exposed on LAN
    tmpfs:
      - /var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test_user -d test_db"]
      interval: 2s
      timeout: 5s
      retries: 15
```

### MySQL / MariaDB (default port 3306)

```yaml
services:
  db-test:
    image: mysql:8.4        # or mariadb:11 — match the project's engine
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_USER: test_user
      MYSQL_PASSWORD: test_password
      MYSQL_DATABASE: test_db
    ports:
      - "127.0.0.1::3306"
    tmpfs:
      - /var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "-ptest_password", "-utest_user"]
      interval: 2s
      timeout: 5s
      retries: 20            # MySQL restarts once during init — first "ready" can be false; generous retries required
```

MariaDB: healthcheck binary is `mariadb-admin` (or use `healthcheck.sh --connect --innodb_initialized` on official images).

### SQL Server (default port 1433)

```yaml
services:
  db-test:
    image: mcr.microsoft.com/mssql/server:2022-latest   # no alpine variant exists; needs ~2 GB RAM
    environment:
      ACCEPT_EULA: "Y"                                  # mandatory or the container exits immediately
      MSSQL_SA_PASSWORD: "Test_Passw0rd!"               # MUST meet complexity policy (8+ chars, 3 of 4 classes) or startup fails
      MSSQL_PID: Developer
    ports:
      - "127.0.0.1::1433"
    healthcheck:
      test: ["CMD-SHELL", "/opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P 'Test_Passw0rd!' -Q 'SELECT 1' || /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'Test_Passw0rd!' -Q 'SELECT 1'"]
      interval: 5s
      timeout: 10s
      retries: 30            # cold start is slow (30-60s)
```

SQL Server gotchas the agent MUST handle:
- No `tmpfs` for `/var/opt/mssql` on some hosts (permissions); if startup fails with tmpfs, drop it — correctness over speed.
- `sqlcmd` path differs by image generation: `mssql-tools18` (2022+, needs `-C` to trust the self-signed cert) vs `mssql-tools` — the healthcheck above tries both.
- Databases are NOT auto-created by env vars: the lifecycle must run `CREATE DATABASE test_db` (via `sqlcmd`) before migrations.
- On ARM hosts (Apple Silicon), use `mcr.microsoft.com/azure-sql-edge` as the fallback image and say so in the report.

### MongoDB (default port 27017)

```yaml
services:
  db-test:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: test_user
      MONGO_INITDB_ROOT_PASSWORD: test_password
    ports:
      - "127.0.0.1::27017"
    tmpfs:
      - /data/db
    healthcheck:
      test: ["CMD-SHELL", "mongosh --quiet --eval 'db.runCommand({ping:1}).ok' -u test_user -p test_password --authenticationDatabase admin | grep -q 1"]
      interval: 2s
      timeout: 5s
      retries: 15
```

Transactions/change-streams in tests require a replica set: add `command: ["--replSet", "rs0"]` and an init step (`rs.initiate()`) to the lifecycle.

### Redis (default port 6379)

```yaml
services:
  cache-test:
    image: redis:7-alpine
    ports:
      - "127.0.0.1::6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 2s
      timeout: 3s
      retries: 10
```

### Message brokers / cloud emulators

RabbitMQ (`rabbitmq:3-management-alpine`, healthcheck `rabbitmq-diagnostics -q ping`), Kafka (`confluentinc/cp-kafka` KRaft mode), LocalStack for AWS SDK usage — same rules apply. Only provision what the code under test actually touches.

## Migration Commands per Datastore

The lifecycle's migration step must use the project's own tool with the resolved test DSN — examples: `npx prisma migrate deploy` / `db push`, `npx knex migrate:latest`, `alembic upgrade head`, `python manage.py migrate`, `rails db:schema:load`, `mvn flyway:migrate` (or Spring auto-migration on boot), `dotnet ef database update`, `sqlx migrate run`. For SQL Server, remember the explicit `CREATE DATABASE` step first.

## Language-Specific Execution & Hooks

### Node.js (TypeScript/JavaScript)
- **Detect**: `package.json`
- **Execution Hook**: `npm run test:integration` or `npx jest --config jest.integration.config.js`
- **Setup script needed?**: Yes, recommend a Jest/Vitest globalSetup that reads the resolved DB port, waits for readiness, runs migrations, and truncates tables between tests.

### Python
- **Detect**: `requirements.txt`, `pyproject.toml`
- **Execution Hook**: `pytest tests/integration`
- **Setup script needed?**: Session-scoped fixture that applies alembic migrations; pass the resolved DSN via env var.

### Java (Spring Boot) / Kotlin
- **Detect**: `pom.xml`, `build.gradle`
- **Execution Hook**: `mvn verify` or `./gradlew integrationTest`
- **Setup script needed?**: Prefer the `Testcontainers` Java library in code over external compose; if legacy, use external compose.

### Go
- **Detect**: `go.mod`
- **Execution Hook**: `go test -tags=integration ./...`
- **Setup script needed?**: Recommend `testcontainers-go` inside `TestMain`.

### .NET (C# / F#)
- **Detect**: `*.sln`, `*.csproj`, `global.json`, `Directory.Packages.props`. Identify the data stack from package references — it changes the whole lifecycle:
  - **EF Core**: `Microsoft.EntityFrameworkCore.SqlServer` ⇒ SQL Server · `Npgsql.EntityFrameworkCore.PostgreSQL` ⇒ Postgres · `Pomelo.EntityFrameworkCore.MySql` ⇒ MySQL · `Microsoft.EntityFrameworkCore.Sqlite` ⇒ embedded (no container).
  - **NHibernate**: `NHibernate` / `FluentNHibernate` packages; engine comes from the configured dialect (`MsSql2012Dialect`, `PostgreSQLDialect`, `MySQLDialect`) plus the ADO.NET driver package (`Microsoft.Data.SqlClient`, `Npgsql`, `MySqlConnector`).
  - **Dapper / raw ADO.NET**: `Dapper` + driver package. No migration tool implied — look for FluentMigrator, DbUp, or `.sql` script folders.
- **Execution Hook**: `dotnet test --filter "Category=Integration"` (xUnit `[Trait("Category","Integration")]`, NUnit `[Category("Integration")]`, MSTest `[TestCategory]`). No category convention in the project → run a dedicated integration test project (`dotnet test tests/*.IntegrationTests`) or the full `dotnet test` and say so. Coverage: `dotnet test --collect:"XPlat Code Coverage"` (coverlet) → Cobertura XML.
- **Migrations before tests**:
  - EF Core: `dotnet ef database update --connection "<TEST_DSN>"` (needs `dotnet-ef` tool — check `dotnet tool list`; install locally if missing). Alternative many projects use: `context.Database.Migrate()` on startup — then just running the suite migrates.
  - NHibernate: there is NO built-in migrator. Look for FluentMigrator (`dotnet fm migrate`), DbUp console project, or `hbm2ddl.auto` (schema-export in tests). If none exists, that is itself a FINDING: schema management is manual/undocumented.
- **DSN injection**: .NET config binding maps `ConnectionStrings__Default` (double underscore) env var over `appsettings.json` — export the resolved container DSN that way; never edit `appsettings.json` in place.
- **Setup script needed?**: Prefer `Testcontainers` for .NET (`Testcontainers.MsSql`, `Testcontainers.PostgreSql`, etc.) in a fixture (`IAsyncLifetime`/`WebApplicationFactory`); if legacy, external compose + env var DSN as above.

### Rust
- **Detect**: `Cargo.toml`
- **Execution Hook**: `cargo test --test integration`
- **Setup script needed?**: External compose; pass DSN via env var, use `sqlx migrate run` if applicable.

### Ruby / PHP
- **Detect**: `Gemfile` / `composer.json`
- **Execution Hook**: `bundle exec rspec spec/integration` / `php vendor/bin/phpunit --testsuite integration`
- **Setup script needed?**: `rails db:test:prepare` / framework migration command against the container DSN.

## Execution Lifecycle

The skill must instruct the terminal tool to execute this lifecycle when an external container is used. Teardown runs ALWAYS, even when a middle step fails (try/finally semantics):

1. `docker compose -p <project>-qgate -f docker-compose.test.yml up -d --wait` (waits for healthchecks)
2. Resolve ephemeral ports (`docker compose -p <project>-qgate port db-test 5432`) and export env vars for the suite.
3. Run database migrations on the test DB (e.g., `npx prisma db push`, `alembic upgrade head`).
4. Run the tests (the Act phase). Capture stdout, stderr, exit code, coverage.
5. `docker compose -p <project>-qgate -f docker-compose.test.yml down -v` (**ALWAYS**, even on failure — never leave orphaned containers or volumes).
