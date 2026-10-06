# Example: Onboarding a Python Monorepo

## User Request

> "Configura as ferramentas de IA pra esse monorepo Python."

## Repository Structure

```
acme-platform/
├── pyproject.toml                (workspace root, uv/poetry)
├── uv.lock
├── .python-version               (3.12)
├── .editorconfig
├── ruff.toml                     (linter + formatter)
├── mypy.ini                      (strict type checking)
├── docker-compose.yml            (postgres, redis, rabbitmq)
├── .github/workflows/ci.yml
├── .gitlab-ci.yml                ← dual CI!
├── CLAUDE.md                     ← existing AI config!
├── AGENTS.md                     ← existing AI config!
├── Makefile
├── packages/
│   ├── api/
│   │   ├── pyproject.toml        (FastAPI + SQLAlchemy + Alembic)
│   │   ├── src/api/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── middleware/
│   │   └── tests/
│   ├── worker/
│   │   ├── pyproject.toml        (Celery + RabbitMQ)
│   │   ├── src/worker/
│   │   │   ├── tasks/
│   │   │   └── handlers/
│   │   └── tests/
│   └── shared/
│       ├── pyproject.toml        (shared library)
│       └── src/shared/
│           ├── models/
│           ├── utils/
│           └── schemas/
├── infra/
│   ├── terraform/
│   └── k8s/
└── docs/
    ├── architecture.md
    └── api-reference.md
```

## Expected Agent Behavior

### Phase 0-1: Recon

```
🔍 Analisando o repositório em profundidade...

Análise concluída:
  • Tipo: Monorepo Python
  • Linguagem: Python 3.12
  • Package Manager: uv
  • Pacotes detectados: api (FastAPI), worker (Celery), shared (library)
  • Banco de dados: PostgreSQL (via SQLAlchemy + Alembic)
  • Cache: Redis
  • Mensageria: RabbitMQ
  • CI/CD: GitHub Actions + GitLab CI (dual)
  • Infra: Terraform + Kubernetes
  • Linter: Ruff
  • Type Checker: mypy (strict)
  • Configs de IA existentes: CLAUDE.md, AGENTS.md (serão usados como base)
```

### Phase 1: Cross-Pollination

Agent reads existing CLAUDE.md and AGENTS.md:

```
📋 Configs de IA pré-existentes analisadas:
  • CLAUDE.md: contém overview do projeto, convenções de código, comandos do Makefile
  • AGENTS.md: contém arquitetura detalhada e boundaries
  • Conteúdo será preservado e enriquecido com dados da análise
```

### Phase 2: Classification

```
📊 Classificação:
  • Stack: Monorepo (3 pacotes: API, Worker, Shared Library)
  • Complexidade: Enterprise (monorepo, múltiplos serviços, IaC)
  • Contexto: Time grande (CONTRIBUTING guide, PR templates, dual CI)
  • Maturidade: Desenvolvimento ativo (CI robusto, infra como código)
  • Serviços: PostgreSQL, Redis, RabbitMQ, GitHub, GitLab
  • MCP recomendados: PostgreSQL, GitHub
```

### Phase 3: Target Selection

User responds: "1, 2, 3, 6" (Antigravity, Claude, Cursor, Aider)

### Phase 4: Generation

Agent operates in **Update Mode** for AGENTS.md and CLAUDE.md:

```
Gerando arquivos de configuração...

📄 AGENTS.md — ATUALIZADO (seções adicionadas: Tech Stack, Conventions from ruff/mypy)
📄 .agents/rules/code-style.md — Ruff rules + mypy strict
📄 .agents/rules/workflow.md — Makefile targets, CI obrigatório
📄 .agents/rules/boundaries.md — não editar migrations merged, shared models imutáveis
📄 CLAUDE.md — ATUALIZADO (adicionado: referência ao AGENTS.md, regras Claude-específicas)
📄 .claude/rules/python-style.md — Python-specific: type hints, docstrings, import order
📄 .claude/rules/monorepo.md — package boundaries, shared lib usage rules
📄 .cursor/rules/project.mdc — com YAML frontmatter, focused rules
📄 CONVENTIONS.md — convenções imperativas para Aider
📄 .aider.conf.yml — auto-load CONVENTIONS.md + AGENTS.md, ruff como linter
📄 .antigravity/mcp.json — PostgreSQL + GitHub servers
```

### Phase 4 — Update Mode: AGENTS.md Merge

Original AGENTS.md had project overview and architecture. Agent adds missing sections:

```diff
 # acme-platform
 
 Enterprise platform for [existing description preserved].
 
 ## Architecture
 [existing architecture preserved, enhanced with package descriptions]
 
+## Tech Stack
+
+| Layer            | Technology       |
+|------------------|------------------|
+| Language         | Python 3.12      |
+| Framework        | FastAPI (API), Celery (Worker) |
+| Package Manager  | uv               |
+| Database         | PostgreSQL (SQLAlchemy + Alembic) |
+| Cache            | Redis            |
+| Messaging        | RabbitMQ         |
+| Type Checker     | mypy (strict)    |
+| Linter/Formatter | Ruff             |
+| Infrastructure   | Terraform + Kubernetes |

 ## Commands
-[existing commands preserved]
+[existing commands verified and updated]
+| Task       | Command              |
+| Install    | `make install`       |
+| Dev (API)  | `make run-api`       |
+| Dev (Worker)| `make run-worker`   |
+| Test       | `make test`          |
+| Lint       | `make lint`          |
+| Type Check | `make typecheck`     |
+| Migrate    | `make migrate`       |

+## Conventions
+
+- Type hints required on all function signatures (mypy strict)
+- Ruff enforced: E, F, I, UP, B, SIM rule sets
+- Line length: 88 characters (Ruff/Black compatible)
+- Import order: stdlib → third-party → local (isort via Ruff)
+- Google-style docstrings on all public functions
+- Shared models in `packages/shared/` — import, never duplicate
```

### Phase 6: Delivery

```
## ✅ Onboarding Completo

Repositório: acme-platform
Stack:       Monorepo Python (FastAPI + Celery + Shared Library)
Ferramentas: Antigravity, Claude Code, Cursor, Aider

Arquivos atualizados:
  ✅ AGENTS.md                           (ATUALIZADO — seções adicionadas)
  ✅ CLAUDE.md                           (ATUALIZADO — referência ao AGENTS.md)

Arquivos gerados:
  ✅ .agents/rules/code-style.md         (workspace rules)
  ✅ .agents/rules/workflow.md           (workspace rules)
  ✅ .agents/rules/boundaries.md         (workspace rules)
  ✅ .claude/rules/python-style.md       (Claude rules)
  ✅ .claude/rules/monorepo.md           (Claude rules)
  ✅ .cursor/rules/project.mdc           (Cursor)
  ✅ CONVENTIONS.md                      (Aider)
  ✅ .aider.conf.yml                     (Aider config)
  ✅ .antigravity/mcp.json               (MCP servers)

Modo: UPDATE (AGENTS.md e CLAUDE.md existentes preservados e enriquecidos)
Configs pré-existentes absorvidas: CLAUDE.md, AGENTS.md
```
