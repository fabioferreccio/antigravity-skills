# Project Indexing Protocol

> Reference document for the code-review skill's project indexing system.
> On first use or when staleness is detected, the agent indexes the project to build
> a rich context model stored in `.code-review-index.json` at the project root.

---

## Overview

The indexing protocol runs automatically before the first review in a project and
whenever staleness is detected. It produces a structured JSON index that subsequent
review passes consume to calibrate language-specific checks, framework conventions,
architecture enforcement, and complementary skill delegation.

**Key constraint:** Indexing must be non-destructive and read-only. It MUST NOT modify
any project files except `.code-review-index.json`.

---

## Step-by-Step Indexing Procedure

### Step 1: Language Detection

Scan the project root and immediate subdirectories for language marker files.
Use a combination of config file presence and file extension frequency.

**Detection Matrix:**

| Marker File(s)                              | Language(s)              |
|---------------------------------------------|--------------------------|
| `package.json`                              | Node.js / TypeScript / JavaScript |
| `tsconfig.json`, `tsconfig.*.json`          | TypeScript (confirms)    |
| `go.mod`                                    | Go                       |
| `Cargo.toml`                                | Rust                     |
| `pom.xml`                                   | Java (Maven)             |
| `build.gradle`, `build.gradle.kts`          | Java / Kotlin (Gradle)   |
| `pyproject.toml`, `requirements.txt`, `setup.py`, `setup.cfg` | Python    |
| `Gemfile`                                   | Ruby                     |
| `pubspec.yaml`                              | Dart / Flutter           |
| `*.csproj`, `*.sln`                         | C# / .NET                |
| `composer.json`                             | PHP                      |
| `mix.exs`                                   | Elixir                   |

**Agent commands to run:**

```bash
# List all config files at root (max depth 2)
find . -maxdepth 2 -type f \( \
  -name "package.json" -o -name "tsconfig.json" -o -name "go.mod" \
  -o -name "Cargo.toml" -o -name "pom.xml" -o -name "build.gradle" \
  -o -name "build.gradle.kts" -o -name "pyproject.toml" \
  -o -name "requirements.txt" -o -name "setup.py" -o -name "Gemfile" \
  -o -name "pubspec.yaml" -o -name "*.csproj" -o -name "*.sln" \
  -o -name "composer.json" -o -name "mix.exs" \
\) 2>/dev/null

# Count file extensions to confirm languages (top 10)
find . -type f -name '*.*' ! -path './.git/*' ! -path './node_modules/*' \
  ! -path './vendor/*' ! -path './dist/*' ! -path './build/*' \
  | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -20
```

**On Windows (PowerShell):**

```powershell
# List config files at root (max depth 2)
Get-ChildItem -Path . -Recurse -Depth 2 -File -Include `
  "package.json","tsconfig.json","go.mod","Cargo.toml","pom.xml", `
  "build.gradle","build.gradle.kts","pyproject.toml","requirements.txt", `
  "setup.py","Gemfile","pubspec.yaml","*.csproj","*.sln", `
  "composer.json","mix.exs" -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty FullName

# Count file extensions
Get-ChildItem -Path . -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.DirectoryName -notmatch '\\(\.git|node_modules|vendor|dist|build)\\' } |
  Group-Object Extension |
  Sort-Object Count -Descending |
  Select-Object -First 20 Count, Name
```

**Decision logic:**
- If `tsconfig.json` exists alongside `package.json` → primary language is `typescript`
- If only `package.json` → inspect for `"type": "module"` and file extensions to decide `javascript` vs `typescript`
- If multiple language markers exist → list all (polyglot project)
- If monorepo → detect per-package languages

---

### Step 2: Framework Detection

Parse the detected config files to identify frameworks in use.

**Node.js / TypeScript / JavaScript — read `package.json` dependencies:**

| Dependency Pattern                      | Framework         |
|-----------------------------------------|-------------------|
| `@nestjs/core`, `@nestjs/common`        | NestJS            |
| `express`                               | Express           |
| `fastify`                               | Fastify           |
| `koa`                                   | Koa               |
| `hapi`, `@hapi/hapi`                    | Hapi              |
| `next`                                  | Next.js           |
| `nuxt`, `nuxt3`                         | Nuxt              |
| `@sveltejs/kit`                         | SvelteKit         |
| `react`, `react-dom`                    | React             |
| `vue`                                   | Vue               |
| `@angular/core`                         | Angular           |
| `svelte`                                | Svelte            |
| `prisma`, `@prisma/client`              | Prisma (ORM)      |
| `typeorm`                               | TypeORM (ORM)     |
| `sequelize`                             | Sequelize (ORM)   |
| `drizzle-orm`                           | Drizzle (ORM)     |
| `mongoose`                              | Mongoose (ODM)    |

**Java / Kotlin — read `pom.xml` or `build.gradle`:**

| Dependency / Plugin                     | Framework         |
|-----------------------------------------|-------------------|
| `spring-boot-starter-*`                 | Spring Boot       |
| `io.quarkus`                            | Quarkus           |
| `io.micronaut`                          | Micronaut         |
| `org.hibernate`                         | Hibernate (ORM)   |

**Python — read `pyproject.toml`, `requirements.txt`, or `setup.py`:**

| Dependency                              | Framework         |
|-----------------------------------------|-------------------|
| `django`                                | Django            |
| `flask`                                 | Flask             |
| `fastapi`                               | FastAPI           |
| `sqlalchemy`                            | SQLAlchemy (ORM)  |
| `tortoise-orm`                          | Tortoise (ORM)    |

**Ruby — read `Gemfile`:**

| Gem                                     | Framework         |
|-----------------------------------------|-------------------|
| `rails`                                 | Rails             |
| `sinatra`                               | Sinatra           |
| `activerecord`                          | ActiveRecord (ORM)|

**Dart — read `pubspec.yaml`:**

| Dependency                              | Framework         |
|-----------------------------------------|-------------------|
| `flutter`                               | Flutter           |
| `angular`                               | Angular Dart      |
| `bloc`, `flutter_bloc`                  | BLoC              |

**C# / .NET — read `*.csproj`:**

| Package / SDK                           | Framework         |
|-----------------------------------------|-------------------|
| `Microsoft.AspNetCore`                  | ASP.NET Core      |
| `Microsoft.AspNetCore.Components`       | Blazor            |
| `Microsoft.EntityFrameworkCore`         | EF Core (ORM)     |

**PHP — read `composer.json`:**

| Package                                 | Framework         |
|-----------------------------------------|-------------------|
| `laravel/framework`                     | Laravel           |
| `symfony/*`                             | Symfony           |
| `doctrine/orm`                          | Doctrine (ORM)    |

**Elixir — read `mix.exs`:**

| Dependency                              | Framework         |
|-----------------------------------------|-------------------|
| `:phoenix`                              | Phoenix           |
| `:ecto`                                 | Ecto (ORM)        |

**Agent procedure:**
1. Read the relevant config file(s) identified in Step 1
2. Extract dependency names from the appropriate section (dependencies, devDependencies, etc.)
3. Match against the tables above
4. Record both application frameworks and ORM/data frameworks separately

---

### Step 3: Architecture Pattern Detection

Analyze the directory structure to infer the architecture pattern.

**Detection heuristics:**

| Pattern               | Directory Signals                                                            |
|-----------------------|-----------------------------------------------------------------------------|
| Clean Architecture    | `core/` or `domain/` + `infra/` or `infrastructure/` + `presentation/` or `app/` |
| MVC                   | `models/` + `views/` + `controllers/`                                        |
| MVVM                  | `viewmodels/` or `view-models/` + `views/` + `models/`                       |
| Hexagonal             | `ports/` + `adapters/` + `domain/`                                           |
| DDD                   | `bounded-contexts/` or `contexts/` + (`aggregates/` or `value-objects/` or `entities/`) |
| Microservices         | Multiple `services/` or `apps/` directories, each with own config            |
| Monorepo              | `packages/` or `apps/` + workspace config (`pnpm-workspace.yaml`, `lerna.json`, `nx.json`, `turbo.json`) |
| Feature-based         | `features/` or `modules/` with self-contained vertical slices                |
| Layered (generic)     | `api/` + `services/` + `repositories/` or `data/`                           |

**Agent commands:**

```bash
# List top-level and second-level directories
find . -maxdepth 3 -type d ! -path './.git/*' ! -path './node_modules/*' \
  ! -path './vendor/*' ! -path './dist/*' ! -path './build/*' \
  | head -60

# Check for workspace configs
ls -la pnpm-workspace.yaml lerna.json nx.json turbo.json 2>/dev/null
```

**On Windows (PowerShell):**

```powershell
# List top-level and second-level directories
Get-ChildItem -Path . -Recurse -Depth 3 -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '\\(\.git|node_modules|vendor|dist|build)\\' } |
  Select-Object -First 60 -ExpandProperty FullName

# Check for workspace configs
Test-Path pnpm-workspace.yaml, lerna.json, nx.json, turbo.json
```

**Decision logic:**
- If multiple patterns match → choose the most specific (e.g., Hexagonal over generic Layered)
- If monorepo detected → also detect per-package architecture
- If no clear pattern → record as `"layered"` or `"unstructured"`
- Record the detected `layers` array (actual directory names found)

---

### Step 4: Convention Extraction

Read project configuration files to understand coding conventions.

**Files to scan:**

| Config File                          | Convention Data                                |
|--------------------------------------|------------------------------------------------|
| `.editorconfig`                      | Indentation (tabs/spaces, size), line endings, charset, trim trailing whitespace |
| `.eslintrc*`, `eslint.config.*`      | Linting rules, import rules, naming conventions |
| `.prettierrc*`, `prettier.config.*`  | Formatting: semicolons, quotes, trailing commas, print width |
| `rustfmt.toml`                       | Rust formatting conventions                    |
| `pyproject.toml [tool.black]`        | Python formatting (line length, target version) |
| `pyproject.toml [tool.ruff]`         | Python linting rules                           |
| `setup.cfg [flake8]`                 | Python linting (max line length, ignores)      |
| `checkstyle.xml`                     | Java code style rules                          |
| `spotless` config in `build.gradle`  | Java/Kotlin formatting                         |
| `.rubocop.yml`                       | Ruby style rules                               |
| `analysis_options.yaml`             | Dart/Flutter lint rules                         |
| `.clang-format`                      | C/C++ formatting                               |
| `AGENTS.md`                          | AI agent-specific project rules                |
| `CLAUDE.md`                          | Claude-specific project rules                  |
| `COPILOT.md`                         | Copilot-specific project rules                 |
| `CONTRIBUTING.md`                    | Human contribution guidelines                  |
| `.github/CODEOWNERS`                 | Code ownership rules                           |

**Extraction procedure:**
1. For each file that exists, read its content
2. Extract the following conventions:
   - `naming`: camelCase / snake_case / PascalCase / kebab-case (infer from linter rules or scan source files)
   - `test_framework`: Jest / Vitest / Mocha / JUnit / pytest / etc. (from devDependencies or test config)
   - `linter`: eslint / rubocop / pylint / ruff / clippy / etc.
   - `formatter`: prettier / black / rustfmt / gofmt / etc.
   - `import_style`: absolute / relative / alias (check tsconfig paths, eslint import rules)
3. If `AGENTS.md`, `CLAUDE.md`, or `COPILOT.md` exists → record path in `agent_rules_file`
4. Read agent rules files to extract any project-specific review instructions

**Important:** Agent rules files take precedence over default conventions. If the project's
`AGENTS.md` says "never flag X", the reviewer MUST respect that.

---

### Step 5: Complementary Skills Mapping

Check `.agents/skills/` in the repository (or the global skills registry) for skills
that complement the code review based on detected project characteristics.

**Mapping rules:**

| Condition                                                      | Skill to Map             |
|----------------------------------------------------------------|--------------------------|
| `architecture_pattern` contains "clean" or "hexagonal"         | `clean-architecture`     |
| Project has DB dependencies (prisma, typeorm, sequelize, sqlalchemy, hibernate, ef-core, ecto, activerecord, drizzle, mongoose) | `dba-agent` |
| Always (if skill exists in registry)                           | `security-engineer`      |
| Always (if skill exists in registry)                           | `qa-engineer`            |
| Project has migration files (`migrations/`, `db/migrate/`, `prisma/migrations/`) | `migration-reviewer` |
| Project has frontend framework (React, Vue, Angular, Svelte, Flutter) | `ux-specialist`   |
| Project has CI/CD config (`.github/workflows/`, `Jenkinsfile`, `.gitlab-ci.yml`) | `devops-agent` |
| Always (if skill exists in registry)                           | `domain-expert`          |

**Agent procedure:**
1. List available skills in `.agents/skills/`
2. Match against detection results
3. Record matched skills in `complementary_skills` array
4. During review, the agent MAY delegate findings to complementary skills if the finding falls outside core review scope

---

### Step 6: Platform Detection

Detect CI/CD, git hosting, and branching strategy.

**Detection:**

| Signal                               | Platform Info                           |
|--------------------------------------|-----------------------------------------|
| `.github/workflows/`                 | CI: `github-actions`                    |
| `Jenkinsfile`                        | CI: `jenkins`                           |
| `.gitlab-ci.yml`                     | CI: `gitlab-ci`                         |
| `.circleci/config.yml`               | CI: `circleci`                          |
| `.bitbucket-pipelines.yml`           | CI: `bitbucket-pipelines`               |
| `.git/config` remote URL             | Git host: `github.com` / `gitlab.com` / etc. |
| `git symbolic-ref refs/remotes/origin/HEAD` | Default branch (`git branch --show-current` returns the CURRENT branch, not the default) |

**Agent commands:**

```bash
# Detect git host
git remote get-url origin 2>/dev/null

# Detect default branch
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'

# Check CI configs
ls -la .github/workflows/ Jenkinsfile .gitlab-ci.yml .circleci/ .bitbucket-pipelines.yml 2>/dev/null
```

**On Windows (PowerShell):**

```powershell
# Detect git host
git remote get-url origin 2>$null

# Detect default branch
git symbolic-ref refs/remotes/origin/HEAD 2>$null

# Check CI configs
Test-Path .github/workflows, Jenkinsfile, .gitlab-ci.yml, .circleci, .bitbucket-pipelines.yml
```

---

### Step 7: Generate the Index File

Combine all collected data into `.code-review-index.json`:

```json
{
  "version": "1.0.0",
  "indexed_at": "2026-07-01T08:30:00.000Z",
  "project_hash": "sha256:a1b2c3d4e5f6...",
  "languages": ["typescript"],
  "frameworks": ["nestjs", "prisma"],
  "architecture_pattern": "clean-architecture",
  "conventions": {
    "naming": "camelCase",
    "test_framework": "jest",
    "linter": "eslint",
    "formatter": "prettier",
    "import_style": "absolute"
  },
  "structure": {
    "source_root": "src/",
    "test_root": "test/",
    "layers": ["core/", "infra/", "presentation/"]
  },
  "complementary_skills": ["clean-architecture", "dba-agent", "security-engineer"],
  "platform": {
    "git_host": "github.com",
    "default_branch": "main",
    "ci": "github-actions"
  },
  "agent_rules_file": "AGENTS.md"
}
```

---

### Step 8: Staleness Detection and Hashing

Generate a hash of key config files to detect when re-indexing is needed.

**Files to hash (if they exist):**
- `package.json`
- `tsconfig.json`
- `go.mod`
- `Cargo.toml`
- `pom.xml`
- `build.gradle` / `build.gradle.kts`
- `pyproject.toml`
- `requirements.txt`
- `Gemfile`
- `pubspec.yaml`
- `*.csproj` (first found)
- `composer.json`
- `mix.exs`
- `.editorconfig`
- `.eslintrc*` (first found)
- `.prettierrc*` (first found)
- `AGENTS.md`

**Hash generation command:**

```bash
# Concatenate contents of all existing config files and hash
cat package.json tsconfig.json go.mod Cargo.toml pom.xml build.gradle \
  pyproject.toml requirements.txt Gemfile pubspec.yaml composer.json \
  mix.exs .editorconfig AGENTS.md 2>/dev/null | sha256sum | cut -d' ' -f1
```

**On Windows (PowerShell):**

```powershell
# Hash all existing config files
$files = @(
  "package.json","tsconfig.json","go.mod","Cargo.toml","pom.xml",
  "build.gradle","build.gradle.kts","pyproject.toml","requirements.txt",
  "Gemfile","pubspec.yaml","composer.json","mix.exs",".editorconfig","AGENTS.md"
) | Where-Object { Test-Path $_ }

$content = $files | ForEach-Object { Get-Content $_ -Raw } | Out-String
$hash = [System.Security.Cryptography.SHA256]::Create()
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$hashBytes = $hash.ComputeHash($bytes)
$hashString = [BitConverter]::ToString($hashBytes) -replace '-',''
"sha256:$($hashString.ToLower())"
```

**Staleness check procedure:**
1. Before each review session, compute the current hash
2. Compare with `project_hash` in `.code-review-index.json`
3. If hashes differ → re-index
4. If `.code-review-index.json` doesn't exist → full index

---

### Step 9: Incremental Update

When re-indexing due to staleness:

1. Load existing `.code-review-index.json`
2. Identify which config files changed (compare individual file hashes)
3. Only re-run detection steps affected by the changed files:
   - `package.json` changed → re-run Steps 1, 2, 4
   - `.editorconfig` changed → re-run Step 4
   - Directory structure changed → re-run Step 3
   - `AGENTS.md` changed → re-read agent rules
4. Merge updated sections into existing index
5. Update `indexed_at` and `project_hash`
6. Write updated `.code-review-index.json`

**Optimization:** Track individual file hashes in the index for granular staleness:

```json
{
  "file_hashes": {
    "package.json": "sha256:abc123...",
    "tsconfig.json": "sha256:def456...",
    ".editorconfig": "sha256:ghi789..."
  }
}
```

---

## Error Handling

- If a config file is malformed (invalid JSON, YAML, etc.) → log a warning, skip that file, continue indexing
- If no language markers are found → set `languages` to empty array, log warning
- If git is not initialized → set platform fields to `null`
- If `.agents/skills/` doesn't exist → set `complementary_skills` to empty array
- Never fail the entire indexing process due to a single file error

---

## Gitignore Recommendation

The agent SHOULD suggest adding `.code-review-index.json` to `.gitignore` since
it is a local cache file specific to the review environment. However, teams may
choose to commit it if they want consistent review context across environments.
