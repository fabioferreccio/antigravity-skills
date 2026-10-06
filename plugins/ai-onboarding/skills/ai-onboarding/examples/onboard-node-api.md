# Example: Onboarding a Node.js Express API

## User Request

> "Quero configurar IA para este projeto."

## Repository Structure

```
my-express-api/
├── package.json            (Express + TypeScript + Prisma + Jest)
├── package-lock.json
├── tsconfig.json            (strict: true)
├── .eslintrc.json           (airbnb-typescript)
├── .prettierrc              (semi: false, singleQuote: true)
├── .editorconfig
├── .env.example             (DATABASE_URL, REDIS_URL, JWT_SECRET)
├── docker-compose.yml       (postgres:15, redis:7)
├── .github/workflows/ci.yml
├── .cursorrules             ← existing AI config!
├── prisma/
│   └── schema.prisma        (datasource: postgresql)
├── src/
│   ├── app.ts
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   └── utils/
├── tests/
│   ├── unit/
│   └── integration/
└── README.md
```

## Expected Agent Behavior

### Phase 0-1: Recon

Agent reports in Portuguese:

```
🔍 Analisando o repositório em profundidade...

Análise concluída:
  • Linguagem: TypeScript
  • Framework: Express.js
  • ORM: Prisma
  • Package Manager: npm
  • Banco de dados: PostgreSQL (via docker-compose + Prisma)
  • Cache: Redis (via docker-compose)
  • CI/CD: GitHub Actions
  • Testes: Jest
  • Config de IA existente: .cursorrules (será usado como base complementar)
```

### Phase 2: Classification

```
📊 Classificação:
  • Stack: Backend (Node.js + Express + TypeScript)
  • Complexidade: Standard (32 arquivos, PostgreSQL + Redis)
  • Contexto: Time pequeno (CONTRIBUTING.md ausente, 2 committers)
  • Maturidade: Desenvolvimento ativo (CI configurado, testes presentes)
```

### Phase 3: Target Selection

```
🎯 Quais ferramentas de IA você quer configurar?

   Detectadas no repositório:
   ✓ Cursor (arquivo .cursorrules existente)

   Recomendadas:
   1. Antigravity (AGENTS.md + .agents/rules/ + MCP)
   2. Claude Code (CLAUDE.md + .claude/rules/)
   3. Cursor (.cursor/rules/project.mdc) — ATUALIZAÇÃO do .cursorrules existente
   4. GitHub Copilot (.github/copilot-instructions.md)
   5. Windsurf (.windsurfrules)
   6. Aider (CONVENTIONS.md + .aider.conf.yml)
   7. Gemini Code Assist (GEMINI.md + .gemini/config.yaml)

   → Responda com os números ou "todas" (padrão).
```

User responds: "todas"

### Phase 4: Generation

Agent reads `.cursorrules` first (cross-pollination), then generates:

```
Gerando arquivos de configuração...

📄 AGENTS.md — contexto cross-tool (fonte canônica)
📄 .agents/rules/code-style.md — TypeScript strict, Airbnb, Prettier
📄 .agents/rules/workflow.md — CI obrigatório, Jest antes de commit
📄 .agents/rules/boundaries.md — não editar migrations merged, .env proibido
📄 CLAUDE.md — referência ao AGENTS.md + guia Claude-específico
📄 .claude/rules/code-style.md — regras de estilo para Claude
📄 .cursor/rules/project.mdc — migração do .cursorrules com YAML frontmatter
📄 .github/copilot-instructions.md — instruções repo-wide
📄 .windsurfrules — formato XML-tagged
📄 CONVENTIONS.md — convenções imperativas (Aider)
📄 .aider.conf.yml — config com auto-lint
📄 GEMINI.md — referência ao AGENTS.md + config Gemini
📄 .gemini/config.yaml — threshold de code review
📄 .antigravity/mcp.json — PostgreSQL + GitHub servers
```

### Phase 4 — Sample Generated AGENTS.md

```markdown
# my-express-api

REST API for [project purpose]. Built with Express.js and TypeScript,
using Prisma ORM with PostgreSQL and Redis for caching.

## Architecture

- `src/routes/` — HTTP route definitions
- `src/controllers/` — Request handling, input validation
- `src/services/` — Business logic, framework-agnostic
- `src/repositories/` — Data access via Prisma
- `src/middleware/` — Auth, error handling, logging
- `src/utils/` — Shared utilities
- `prisma/` — Schema and migrations
- `tests/unit/` — Unit tests (mirrors src/ structure)
- `tests/integration/` — Integration tests with test DB

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: Express.js
- **ORM**: Prisma
- **Runtime**: Node.js 20
- **Package Manager**: npm

## Commands

- Install: `npm install`
- Run dev: `npm run dev`
- Test: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`
- DB migrate: `npx prisma migrate dev`
- DB generate: `npx prisma generate`

## Conventions

- TypeScript strict mode — no `any`, no implicit returns
- Airbnb style guide (via ESLint)
- Prettier: no semicolons, single quotes, 100 char width
- Controllers handle HTTP only — business logic in services
- Repository pattern for all data access
- Jest for testing — arrange/act/assert pattern
- Conventional Commits (feat:, fix:, chore:)

## Boundaries — never do

- Never commit `.env` files or secrets
- Never edit Prisma migrations that are already merged
- Never modify `package-lock.json` manually
- Never put business logic in controllers or routes
- Always run `npm test` before declaring a task complete
```

### Phase 4 — Sample Generated .antigravity/mcp.json

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Phase 5: Validation

```
✅ Validação:
  • Comandos verificados: npm install, npm run dev, npm test, npm run lint, npm run build ✅
  • Paths verificados: src/routes/, src/controllers/, src/services/, prisma/ ✅
  • Segurança: nenhum segredo encontrado ✅
  • Consistência: mesmo nome/stack em todos os arquivos ✅
  • YAML frontmatter: válido (.cursor/rules/project.mdc) ✅
  • JSON: válido (.antigravity/mcp.json) ✅
```

### Phase 6: Delivery

```
## ✅ Onboarding Completo

Repositório: my-express-api
Stack:       Backend (Node.js + Express + TypeScript + Prisma)
Ferramentas: Antigravity, Claude Code, Cursor, Copilot, Windsurf, Aider, Gemini

Arquivos gerados:
  ✅ AGENTS.md                           (cross-tool standard)
  ✅ .agents/rules/code-style.md         (workspace rules)
  ✅ .agents/rules/workflow.md           (workspace rules)
  ✅ .agents/rules/boundaries.md         (workspace rules)
  ✅ CLAUDE.md                           (Claude Code)
  ✅ .claude/rules/code-style.md         (Claude rules)
  ✅ .cursor/rules/project.mdc           (Cursor — migrado do .cursorrules)
  ✅ .github/copilot-instructions.md     (GitHub Copilot)
  ✅ .windsurfrules                      (Windsurf)
  ✅ CONVENTIONS.md                      (Aider)
  ✅ .aider.conf.yml                     (Aider config)
  ✅ GEMINI.md                           (Gemini Code Assist)
  ✅ .gemini/config.yaml                 (Gemini config)
  ✅ .antigravity/mcp.json               (MCP servers)

Modo: NEW (com cross-pollination do .cursorrules existente)
Configs pré-existentes absorvidas: .cursorrules

Próximo passo: revise os arquivos → commit → teste cada ferramenta
```
