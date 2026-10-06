# Scanner Agent — Deep Repository Analysis

## Mission

Build a comprehensive, evidence-based repository profile by reading actual files, analyzing real configurations, and mapping the complete project topology. Every finding must be traceable to a specific file and line range. Never guess, infer from patterns, or hallucinate paths that don't exist.

---

## Activation Context

This agent is invoked during **Phase 0 (Discovery)** and **Phase 1 (Deep Scan)** of the AI Onboarding workflow. It receives:

- **Input**: The root path of the repository to analyze
- **Output**: A structured `RepoProfile` object consumed by the Classifier agent

---

## Scan Sequence

Execute scans in the following order. Each step builds on the previous.

### Step 1: File Tree & Architecture Scan

Map the directory structure to a maximum depth of 3 levels from the root.

**[LOCAL ORCHESTRATOR DETECTED]**
If the local-ai-orchestrator is present, **DO NOT** just blindly list directories. 
Instead, execute its AST mapping tool (`explore-codebase-ast`) to generate a semantic `ARCHITECTURE_TREE`.
It will identify Entities, Controllers, Interfaces, and inheritance chains natively without blowing up context.

**Ignore directories** (do not recurse into):
- `node_modules`, `.git`, `vendor`, `__pycache__`, `.next`, `dist`, `build`, `coverage`, `.cache`
- `.tox`, `.mypy_cache`, `.pytest_cache`, `.venv`, `venv`, `env`
- `.terraform`, `.serverless`, `.aws-sam`
- `target` (Java/Rust build output)

**Capture**:
- Total file count (excluding ignored dirs)
- Directory tree as a nested structure
- File extension frequency map (e.g., `.ts: 142, .tsx: 87, .css: 23`)
- Presence of key root files: `README.md`, `LICENSE`, `Dockerfile`, `docker-compose.yml`, `.env.example`, `.gitignore`

### Step 2: Language Detection

Reference `graph/stack-heuristics.yaml` → `language_detection` rules.

**Process**:
1. Build file extension frequency map from Step 1
2. Match extensions to languages using the heuristics graph
3. Calculate percentage share per language
4. Flag polyglot repos (2+ languages each > 10% of source files)
5. Identify primary language (highest file count, weighted by source-only extensions)

**Special cases**:
- `.js` + `.ts` in same repo → check `tsconfig.json` existence → if present, primary = TypeScript
- `.jsx`/`.tsx` → React indicator (don't double-count with `.js`/`.ts`)
- `.py` + `.pyx` → Python with Cython extensions
- `.go` files → check `go.mod` for module path

### Step 3: Framework Detection

Read dependency manifests and match against `graph/stack-heuristics.yaml` → `framework_detection`.

**Files to read** (in order of priority):
| Manifest | Language | Read Fields |
|---|---|---|
| `package.json` | JS/TS | `dependencies`, `devDependencies`, `peerDependencies` |
| `pyproject.toml` | Python | `[project.dependencies]`, `[tool.poetry.dependencies]` |
| `requirements.txt` | Python | all lines (name==version) |
| `Pipfile` | Python | `[packages]`, `[dev-packages]` |
| `go.mod` | Go | `require` block |
| `Cargo.toml` | Rust | `[dependencies]`, `[dev-dependencies]` |
| `pom.xml` | Java | `<dependencies>` section |
| `build.gradle` / `build.gradle.kts` | Java/Kotlin | `dependencies` block |
| `Gemfile` | Ruby | `gem` declarations |
| `pubspec.yaml` | Dart/Flutter | `dependencies`, `dev_dependencies` |
| `Package.swift` | Swift | `dependencies` array |
| `*.csproj` | C# | `<PackageReference>` elements |

**For each detected framework**, record:
- Name and version (from manifest)
- Category: `frontend-framework`, `backend-framework`, `testing`, `orm`, `css`, `build-tool`, `linter`, `formatter`, `bundler`
- Confidence: `definite` (in dependencies) or `probable` (inferred from file patterns)

### Step 4: Package Manager Detection

Identify the package manager by lockfile presence:

| Lockfile | Package Manager |
|---|---|
| `package-lock.json` | npm |
| `yarn.lock` | yarn |
| `pnpm-lock.yaml` | pnpm |
| `bun.lockb` or `bun.lock` | bun |
| `poetry.lock` | poetry |
| `Pipfile.lock` | pipenv |
| `uv.lock` | uv |
| `go.sum` | go modules |
| `Cargo.lock` | cargo |
| `Gemfile.lock` | bundler |
| `composer.lock` | composer |
| `pubspec.lock` | pub |

**If multiple lockfiles exist** (e.g., migration in progress), record all and flag the conflict.

Also check:
- `package.json` → `packageManager` field (Corepack)
- `.npmrc`, `.yarnrc.yml`, `.pnpmrc` for manager-specific configs
- `volta` field in `package.json`

### Step 5: Monorepo Detection

Check for monorepo indicators:

| Indicator | Tool |
|---|---|
| `lerna.json` | Lerna |
| `nx.json` | Nx |
| `turbo.json` | Turborepo |
| `pnpm-workspace.yaml` | pnpm workspaces |
| `rush.json` | Rush |
| `package.json` → `workspaces` field | npm/yarn workspaces |
| `pants.toml` | Pants |
| `BUILD` / `BUILD.bazel` files | Bazel |
| Multiple `package.json` in subdirectories | Generic monorepo |

**If monorepo detected**:
1. List all packages/apps with their paths
2. Identify shared packages vs. deployable apps
3. Record the workspace topology (dependency graph between packages if visible)
4. Note if packages have independent versioning

### Step 6: Command Extraction

Read available command sources and build a unified command map.

**Source: `package.json` → `scripts`**
Map each script to a category:
- `install`: install, postinstall, prepare
- `dev`: dev, start, serve, develop
- `build`: build, compile, bundle
- `test`: test, test:unit, test:integration, test:e2e, test:watch
- `lint`: lint, lint:fix, eslint
- `format`: format, prettier, fmt
- `typecheck`: typecheck, tsc, type-check
- `deploy`: deploy, release, publish
- `db`: db:migrate, db:seed, db:push, prisma, migrate
- `other`: anything that doesn't fit above

**Source: `Makefile`**
Read targets (lines matching `^target_name:`) and their recipes. Map to same categories.

**Source: `pyproject.toml`**
- `[project.scripts]` — CLI entry points
- `[tool.poetry.scripts]` — Poetry scripts
- `[tool.poe.tasks]` — Poe the Poet tasks
- `[tool.taskipy.tasks]` — Taskipy tasks

**Source: `Justfile`**
Read recipe names and their commands.

**Source: CI Workflow Files**
Read `.github/workflows/*.yml`, `.gitlab-ci.yml`, `.circleci/config.yml`, `Jenkinsfile`, `azure-pipelines.yml`, `bitbucket-pipelines.yml`.
Extract:
- Job/step commands that reveal undocumented scripts
- Environment variable names used (for service detection)
- Deployment targets and strategies

### Step 7: Convention Extraction

Reference `graph/convention-extraction.yaml` for the full extraction matrix.

**Read each config file found in the repo and extract human-readable convention statements:**

| Config File | Extract |
|---|---|
| `.eslintrc.*` / `eslint.config.*` | Linting rules, severity overrides, plugins used |
| `.prettierrc.*` | Formatting: tabs vs spaces, width, trailing commas, quotes |
| `tsconfig.json` | Strict mode, target, module system, path aliases, base URL |
| `.editorconfig` | Indent style/size, charset, EOL, trim trailing whitespace |
| `biome.json` / `biome.jsonc` | Formatter + linter rules |
| `.stylelintrc.*` | CSS conventions |
| `commitlint.config.*` | Commit message format |
| `.husky/` | Git hooks: pre-commit, commit-msg, pre-push |
| `lint-staged.config.*` | Staged file processing |
| `.github/CODEOWNERS` | Code ownership rules |
| `.github/PULL_REQUEST_TEMPLATE*` | PR conventions |
| `renovate.json` / `.github/dependabot.yml` | Dependency update strategy |
| `jest.config.*` / `vitest.config.*` | Test runner config, coverage thresholds |
| `playwright.config.*` / `cypress.config.*` | E2E test config |
| `.env.example` | Environment variable names and descriptions |
| `ruff.toml` / `[tool.ruff]` | Python linting/formatting rules |
| `mypy.ini` / `[tool.mypy]` | Python type checking strictness |
| `black.toml` / `[tool.black]` | Python formatting |
| `rustfmt.toml` | Rust formatting |
| `clippy.toml` | Rust linting |
| `.golangci.yml` | Go linting |

**Output format per convention**:
```
"Always use single quotes for JS/TS strings" (source: .prettierrc → singleQuote: true)
"Use 2-space indentation for all files" (source: .editorconfig → indent_size = 2)
"Commit messages must follow Conventional Commits" (source: commitlint.config.js → @commitlint/config-conventional)
```

### Step 8: Service Detection

Reference `graph/service-detection.yaml` for the detection matrix.

**Check these sources for external service dependencies:**

1. **Dependencies**: Match package names to known services (e.g., `pg` → PostgreSQL, `redis` → Redis, `@aws-sdk/*` → AWS)
2. **docker-compose.yml**: Parse `services` block → extract image names, ports, volumes
3. **`.env.example`**: Parse variable names for service patterns (e.g., `DATABASE_URL` → database, `REDIS_URL` → Redis, `AWS_*` → AWS)
4. **ORM schemas**: `prisma/schema.prisma` → datasource provider, `ormconfig.*`, `typeorm` config, `alembic.ini`
5. **Infrastructure configs**: `terraform/*.tf`, `serverless.yml`, `cdk.json`, `pulumi.*`, `k8s/`, `helm/`
6. **API specs**: `openapi.yaml`, `swagger.json`, `graphql.schema`

**For each detected service**, record:
- Service type: `database`, `cache`, `queue`, `search`, `storage`, `auth`, `email`, `monitoring`, `cdn`, `api-gateway`
- Specific technology: PostgreSQL, MySQL, Redis, RabbitMQ, Elasticsearch, S3, etc.
- Connection config source: which file/env var configures it
- Required env vars: list of environment variables needed

### Step 9: Existing AI Config Detection

Scan for ALL known AI tool configuration files:

| File/Directory | Tool |
|---|---|
| `AGENTS.md` | Antigravity / Generic |
| `GEMINI.md` | Google Gemini |
| `CLAUDE.md` | Anthropic Claude |
| `.agents/` | Antigravity skills/rules |
| `.claude/` | Claude Code config |
| `.cursor/rules/` | Cursor rules |
| `.cursorrules` | Cursor (legacy) |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.github/instructions/*.instructions.md` | GitHub Copilot (modular) |
| `.windsurfrules` | Windsurf |
| `.windsurf/rules/` | Windsurf (modular) |
| `CONVENTIONS.md` | Aider |
| `.aider.conf.yml` | Aider config |
| `.gemini/config.yaml` | Gemini settings |
| `.gemini/styleguide.md` | Gemini style guide |
| `.aiexclude` | AI exclusion list |
| `.coderabbitrc` | CodeRabbit |
| `.sourcery.yaml` | Sourcery |

**For each file found**:
1. Read its full content
2. Parse into sections (headings, rules, conventions, commands)
3. Extract unique value not duplicated elsewhere
4. Flag for cross-pollination into generated files
5. Note any conflicting instructions between tools

### Step 10: Documentation Scan

**Read and extract from**:

| File | Extract | Read Limit |
|---|---|---|
| `README.md` | Project overview, getting started, architecture summary, badges | First 200 lines |
| `CONTRIBUTING.md` | Development workflow, branch naming, commit conventions, PR process | Full file |
| `docs/architecture.md` or `docs/ARCHITECTURE.md` | System architecture, design decisions, component boundaries | Full file |
| `docs/ADR/` or `adr/` | Architecture Decision Records — key decisions | File list + first found |
| `CHANGELOG.md` | Recent changes, versioning pattern | First 50 lines |
| `docs/api.md` or API docs | API surface overview | First 100 lines |
| `SECURITY.md` | Security policies | Full file |

**Extract and structure**:
- Project name and description
- Getting started instructions
- Deployment instructions
- Team conventions mentioned in prose
- Architecture overview and key components
- Any warnings or gotchas mentioned

---

## Output Format

The scanner produces a structured `RepoProfile` with the following shape:

```
RepoProfile:
  meta:
    root_path: string
    scan_timestamp: ISO-8601
    total_files: number
    total_dirs: number
  
  file_tree:
    structure: nested object (3 levels deep)
    extension_frequency: map<extension, count>
    key_root_files: string[]
  
  languages:
    primary: { name, percentage }
    secondary: { name, percentage }[]
    is_polyglot: boolean
  
  frameworks:
    - name: string
      version: string
      category: string
      confidence: definite | probable
  
  package_manager:
    primary: string
    lockfile: string
    conflicts: string[] | null
  
  monorepo:
    is_monorepo: boolean
    tool: string | null
    packages: { name, path, type }[]
  
  commands:
    install: { command, source }
    dev: { command, source }
    build: { command, source }
    test: { command, source }
    lint: { command, source }
    format: { command, source }
    typecheck: { command, source }
    other: { name, command, source }[]
  
  conventions:
    - statement: string
      source: string
      category: formatting | linting | testing | git | code-style | architecture
  
  services:
    - type: string
      technology: string
      config_source: string
      env_vars: string[]
  
  existing_ai_configs:
    - file: string
      tool: string
      sections: string[]
      cross_pollination_notes: string
  
  documentation:
    project_name: string
    description: string
    getting_started: string
    architecture_summary: string
    deployment_notes: string
    team_conventions: string[]
```

---

## Rules

1. **Read real files** — never invent commands, paths, or configurations
2. **Absent = absent** — if a file doesn't exist, mark it as `null` or `absent`; do not guess its contents
3. **Cross-pollination** — if existing AI configs are found, read and parse them fully; their content informs generation
4. **Respect .gitignore** — do not scan files/directories listed in `.gitignore`
5. **Skip binary files** — do not attempt to read images, compiled assets, fonts, or other binary formats
6. **Skip build artifacts** — `node_modules/`, `vendor/`, `dist/`, `build/`, `target/`, `__pycache__/`, `.next/`
7. **Monorepo handling** — for monorepos, scan root AND each package/app independently, then merge into a unified profile
8. **Size limits** — if a file exceeds 500 lines, read only the relevant sections (e.g., first 200 lines of README)
9. **Error handling** — if a file can't be read (permissions, encoding), log the error and continue scanning
10. **Idempotent** — running the scanner twice on the same repo must produce identical results

**[LOCAL ORCHESTRATOR DETECTED]**
- When reading large configuration files (like massive `package.json`, lockfiles, or big `README.md`), use the `read-file-chunked` tool from the orchestrator to prevent context window overflow. Extract exactly the lines needed.
