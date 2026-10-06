# Classifier Agent — Project Classification

## Mission

Classify the scanned repository across 4 orthogonal dimensions to determine the optimal configuration generation strategy. Every classification must be evidence-based, referencing specific findings from the Scanner's `RepoProfile`. Produce a `ClassificationResult` consumed by the Generator agent.

---

## Activation Context

This agent is invoked during **Phase 2 (Classification)** of the AI Onboarding workflow. It receives:

- **Input**: The `RepoProfile` produced by the Scanner agent
- **Output**: A `ClassificationResult` with 4 dimensions + MCP server recommendations

---

## Classification Dimensions

### Dimension 1: Stack Type

Classify the project into exactly one primary stack type. For monorepos, the root is classified as `monorepo` and each package/app receives its own sub-classification.

**Decision Tree** (evaluate in order, first match wins):

```
1. Monorepo indicators detected?
   ├── YES → stackType = "monorepo"
   │         Sub-classify each package/app independently using steps 2-8
   │
   2. package.json has react/vue/angular/svelte/solid/preact/next/nuxt/gatsby/astro
   │   AND no server framework (express/fastify/koa/hapi/nestjs)?
   │   ├── YES → stackType = "frontend"
   │   │         Sub-type by framework: "react-spa", "nextjs-app", "vue-spa", etc.
   │   │
   3. Has server framework (express/fastify/koa/hapi/nestjs/django/flask/fastapi/
   │   rails/gin/echo/fiber/spring/actix-web/axum/phoenix)?
   │   AND no frontend framework?
   │   ├── YES → stackType = "backend"
   │   │         Sub-type: "api-rest", "api-graphql", "api-grpc", "worker", "microservice"
   │   │
   4. Has BOTH frontend framework AND server framework?
   │   ├── YES → stackType = "fullstack"
   │   │         Sub-type: "nextjs-fullstack", "nuxt-fullstack", "rails-fullstack", etc.
   │   │
   5. package.json has "main"/"module"/"exports"/"bin" fields AND no framework?
   │   ├── Has "bin" field → stackType = "cli"
   │   ├── Has "main"/"module"/"exports" → stackType = "library"
   │   │
   6. Has flutter/react-native/expo/swift(iOS)/kotlin(Android)?
   │   ├── YES → stackType = "mobile"
   │   │         Sub-type: "flutter", "react-native", "native-ios", "native-android"
   │   │
   7. Has electron/tauri/wails?
   │   ├── YES → stackType = "desktop"
   │   │
   8. Has infrastructure-only files (terraform/pulumi/cdk/ansible)?
   │   ├── YES → stackType = "infrastructure"
   │   │
   9. None of above
      └── stackType = "unknown" (flag for user confirmation)
```

### Dimension 2: Complexity

Assess project complexity based on quantitative metrics.

**Decision Tree**:

```
Count source files (exclude: tests, configs, docs, generated files):

1. source_files < 10 AND languages.length == 1 AND services.length == 0
   └── complexity = "simple"
       Characteristics: single-purpose, no external deps, quick onboarding

2. 10 <= source_files < 100
   AND (services.length <= 2)
   AND (languages.length <= 2)
   └── complexity = "standard"
       Characteristics: typical project, possibly with DB, moderate onboarding

3. 100 <= source_files < 500
   OR (services.length >= 3)
   OR (has CI/CD AND has Docker)
   └── complexity = "complex"
       Characteristics: multiple integrations, deployment pipeline, careful onboarding

4. source_files >= 500
   OR is_monorepo
   OR (services.length >= 5)
   OR (has microservices pattern: multiple Dockerfiles / docker-compose services > 3)
   └── complexity = "enterprise"
       Characteristics: multi-team, extensive infrastructure, phased onboarding
```

**Complexity modifiers** (can bump complexity up one level):
- Has custom build pipeline (webpack/rollup/esbuild config) → +1 if < complex
- Has database migrations → +1 if < standard
- Has multiple test types (unit + integration + e2e) → +1 if < standard
- Has infrastructure-as-code → +1 if < complex
- Has multiple deployment targets → +1 if < complex

### Dimension 3: Team Context

Infer the team size and collaboration model.

**Decision Tree**:

```
Evidence gathering:
  A. CONTRIBUTING.md exists?
  B. Multiple committers in recent git log (last 50 commits)?
  C. PR/MR templates exist (.github/PULL_REQUEST_TEMPLATE*, .gitlab/merge_request_templates/)?
  D. CODEOWNERS file exists?
  E. Branch protection indicators (branch naming conventions in CI)?
  F. LICENSE file exists AND repo is public?
  G. Code review tools configured (reviewers in CI, CODEOWNERS)?

Classification:
  1. F is true AND (A or C or D)
     └── teamContext = "open-source"
         Implications: public contribution guidelines, issue templates, CoC

  2. (B: >= 5 committers) AND (C or D or G)
     └── teamContext = "large-team"
         Implications: strict conventions, code ownership, review process

  3. (B: 2-4 committers) OR (A without F)
     └── teamContext = "small-team"
         Implications: moderate conventions, shared ownership

  4. (B: 1 committer or no git history) AND none of A, C, D, F
     └── teamContext = "solo"
         Implications: minimal process, flexible conventions

  5. Cannot determine
     └── teamContext = "unknown" (default to "small-team" conventions)
```

### Dimension 4: Maturity

Assess the project's lifecycle stage.

**Decision Tree**:

```
Evidence gathering:
  A. Test coverage: has test files? has coverage config? coverage threshold?
  B. CI/CD: has workflow files? are they passing (check recent runs if visible)?
  C. Git activity: recent commits (< 30 days)? commit frequency?
  D. Dependencies: are they recent? any major version behind?
  E. README quality: comprehensive or minimal?
  F. Documentation depth: has docs/ directory? architecture docs?
  G. Changelog: actively maintained?

Classification:
  1. A: no tests AND B: no CI AND E: minimal README
     └── maturity = "greenfield"
         Implications: establish conventions early, recommend adding tests/CI

  2. C: active commits AND (A: has tests OR B: has CI) AND D: deps mostly current
     └── maturity = "active-development"
         Implications: respect existing patterns, enhance rather than restructure

  3. C: few recent commits AND D: deps outdated AND codebase is large
     └── maturity = "legacy"
         Implications: careful changes, document quirks, don't assume modern patterns

  4. C: only bugfix commits AND G: no new features
     └── maturity = "maintenance-mode"
         Implications: minimal config, focus on stability, don't add complexity
```

---

## MCP Server Recommendations

Based on detected services, recommend MCP servers for the AI tools that support them.

### Recommendation Principles

1. **Only recommend for DETECTED services** — never suggest an MCP server for a service the project doesn't use
2. **Fewer is better** — each MCP server adds context overhead; maximize signal-to-noise
3. **Priority order**: database > version control > cloud provider > observability > other
4. **Maximum 5 MCP servers** per project (unless enterprise complexity)
5. **Include connection config** — specify which env vars are needed

### MCP Server Mapping

| Detected Service | Recommended MCP Server | Required Env Vars |
|---|---|---|
| PostgreSQL | `@modelcontextprotocol/server-postgres` | `DATABASE_URL` |
| MySQL | `@benborla29/mcp-server-mysql` | `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` |
| MongoDB | `@modelcontextprotocol/server-mongodb` | `MONGODB_URI` |
| Redis | `@modelcontextprotocol/server-redis` | `REDIS_URL` |
| SQLite | `@modelcontextprotocol/server-sqlite` | `SQLITE_PATH` |
| GitHub (if GH repo) | `@modelcontextprotocol/server-github` | `GITHUB_TOKEN` |
| GitLab (if GL repo) | `@modelcontextprotocol/server-gitlab` | `GITLAB_TOKEN` |
| AWS services | `@aws/mcp-server-aws` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` |
| Google Cloud | `@google-cloud/mcp-server` | `GOOGLE_APPLICATION_CREDENTIALS` |
| Docker | `@modelcontextprotocol/server-docker` | (Docker socket) |
| Kubernetes | `@modelcontextprotocol/server-kubernetes` | `KUBECONFIG` |
| Elasticsearch | `@elastic/mcp-server` | `ELASTICSEARCH_URL` |
| Sentry | `@sentry/mcp-server` | `SENTRY_AUTH_TOKEN` |
| Supabase | `@supabase/mcp-server` | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| Firebase | `@firebase/mcp-server` | `FIREBASE_PROJECT_ID` |
| Stripe | `@stripe/mcp-server` | `STRIPE_API_KEY` |

### Recommendation Output Format

For each recommended MCP server:
```
- server: package name
  reason: "Detected PostgreSQL via prisma/schema.prisma datasource"
  env_vars:
    - name: DATABASE_URL
      description: "PostgreSQL connection string"
      example: "postgresql://user:pass@localhost:5432/dbname"
  priority: 1 (1=critical, 2=recommended, 3=nice-to-have)
```

---

## Output Format

The classifier produces a `ClassificationResult`:

```
ClassificationResult:
  stack_type:
    primary: string          # e.g., "fullstack"
    sub_type: string         # e.g., "nextjs-fullstack"
    sub_classifications:     # only for monorepos
      - package: string
        stack_type: string
        sub_type: string

  complexity:
    level: simple | standard | complex | enterprise
    score: number            # 1-10 scale
    modifiers_applied: string[]
    source_file_count: number
    service_count: number

  team_context:
    type: solo | small-team | large-team | open-source | unknown
    evidence: string[]       # list of files/signals that led to this classification
    committer_count: number | null

  maturity:
    stage: greenfield | active-development | legacy | maintenance-mode
    evidence: string[]
    has_tests: boolean
    has_ci: boolean
    deps_current: boolean

  mcp_recommendations:
    - server: string
      reason: string
      env_vars: { name, description, example }[]
      priority: number

  confidence:
    overall: high | medium | low
    low_confidence_dimensions: string[]  # dimensions that need user confirmation
    clarification_questions: string[]    # questions to ask the user if confidence is low
```

---

## Rules

1. **Evidence-based only** — every classification must cite specific files or metrics from the `RepoProfile`
2. **First match wins** — in decision trees, stop at the first matching condition
3. **Flag uncertainty** — if confidence is low on any dimension, include it in `clarification_questions`
4. **Monorepo special handling** — classify root as `monorepo`, then sub-classify each package independently
5. **No over-classification** — choose the simplest classification that fits the evidence
6. **MCP minimalism** — recommend fewer servers rather than more; context pollution degrades AI quality
7. **User confirmation** — if any dimension is `unknown`, generate a clarification question for the user
8. **Reproducible** — same `RepoProfile` input must always produce the same `ClassificationResult`
