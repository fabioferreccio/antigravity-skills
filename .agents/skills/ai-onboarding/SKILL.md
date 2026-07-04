---
name: ai-onboarding
description: >
  Supreme autonomous skill that performs deep repository analysis and generates
  all AI initialization files needed to onboard a legacy project into the AI
  coding universe. Produces cross-tool compatible configurations for Antigravity,
  Claude Code, Cursor, GitHub Copilot, Windsurf, Aider, and Gemini Code Assist
  from a single repo scan. Use when the user mentions "onboard repo", "AI init",
  "initialize AI", "configure AI tools", "generate AGENTS.md", "generate CLAUDE.md",
  "first session", "primeira sessão", "configurar IA", "AI bootstrap", "legacy to AI",
  or wants to make a repository AI-ready across multiple coding assistants.
version: 1.0.0
author: Fábio Ferreccio
tags:
  - onboarding
  - initialization
  - multi-tool
  - ai-config
  - legacy
  - bootstrap
  - cross-platform
triggers:
  - "onboard this repository for AI tools"
  - "generate AI initialization files"
  - "configure AI tools for this project"
  - "make this repo AI-ready"
  - "primeira sessão de IA"
  - "AI bootstrap"
  - "generate AGENTS.md and CLAUDE.md"
scope: workspace
tools:
  - filesystem
  - terminal
security:
  network: false
  filesystem: read-write
  terminal: sandboxed
---

# Goal

Analyze any repository — legacy or greenfield — and generate **all AI initialization
files** for 7+ AI coding tools from a single deep scan. The output transforms an
AI-unaware project into a fully configured, multi-tool AI workspace in one session.

# Language Protocol

- **All generated files**: English
- **All communication with the user**: Brazilian Portuguese (pt-BR)
- **Internal reasoning**: English

# Supported Tools

| Tool | Output Files |
|---|---|
| Cross-tool standard | `AGENTS.md` |
| Antigravity | `.agents/rules/*.md`, `.antigravity/mcp.json` |
| Claude Code | `CLAUDE.md`, `.claude/rules/*.md` |
| Cursor | `.cursor/rules/project.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurfrules` |
| Aider | `CONVENTIONS.md`, `.aider.conf.yml` |
| Gemini Code Assist | `GEMINI.md`, `.gemini/config.yaml` |

# Internal Agents

Load each from `agents/` only when its phase activates.

```
AGENT        PHASE           ROLE
─────────────────────────────────────────────────────
Scanner      Phase 0-1       Deep repo analysis
Classifier   Phase 2         Stack/convention classification
Generator    Phase 3         Multi-tool file generation
Validator    Phase 4         Output quality gate
```

# Phase Router

```
Repository
  │
  ├─→ Phase 0: RECON ────────────── Deep scan (agents/scanner.md)
  │                                  Use graph/stack-heuristics.yaml
  │                                  Use graph/service-detection.yaml
  │                                  Use graph/convention-extraction.yaml
  │                                  Detect existing AI configs
  │
  ├─→ Phase 1: EXISTING CONFIG ──── Read & parse existing AI configs
  │                                  Cross-pollinate findings
  │                                  Switch to update mode if found
  │
  ├─→ Phase 2: CLASSIFICATION ───── Classify stack, complexity, team, maturity
  │                                  (agents/classifier.md)
  │                                  Map services → MCP servers
  │                                  Present summary to user (pt-BR)
  │
  ├─→ Phase 3: TARGET SELECTION ──── Ask user which tools to target (pt-BR)
  │                                   Default: all detected + Antigravity + Claude
  │                                   Use graph/output-routing.yaml
  │
  ├─→ Phase 4: GENERATION ───────── Generate files (agents/generator.md)
  │                                  Use templates/ for each tool
  │                                  Apply cross-pollination
  │                                  Apply deduplication
  │                                  Handle update mode (merge, don't overwrite)
  │
  ├─→ Phase 5: VALIDATION ───────── Quality gate (agents/validator.md)
  │                                  Verify correctness, consistency, security
  │                                  Any failure → fix → re-validate
  │
  └─→ Phase 6: DELIVERY ─────────── Present checklist (pt-BR)
                                     List all generated files
                                     Per-tool verification steps
                                     Suggest git commit
```

# Phase 0-1: Recon & Existing Config

→ Load `agents/scanner.md`
→ Reference: `graph/stack-heuristics.yaml`, `graph/service-detection.yaml`,
  `graph/convention-extraction.yaml`

Execute the full scan sequence. Before scanning, tell the user (pt-BR):
"Analisando o repositório em profundidade..."

**[LOCAL ORCHESTRATOR HANDSHAKE]**
Check if `.agents/skills/local-ai-orchestrator` exists in the workspace.
If YES:
- Inform the user: "Orquestrador local detectado. Utilizando AST e leitura otimizada."
- Tell the Scanner to use `explore-codebase-ast` for semantic architecture mapping.
- Tell the Scanner to use `read-file-chunked` when reading large files (>500 lines).
- Flag `local_orchestrator_detected: true` in the Repo Profile for Phase 4.

If no repo is accessible (chat-only mode), switch to **guide mode**:
produce templates with placeholder content the user can fill in manually.

### Existing AI Config Cross-Pollination

When existing configs are found (CLAUDE.md, .cursorrules, AGENTS.md, etc.):

1. **Read** their full content
2. **Extract** useful data: commands, conventions, boundaries, architecture notes
3. **Use as supplementary input** alongside fresh repo analysis
4. **Preserve** user customizations — never discard prior context
5. **Fill gaps** only where existing config is silent
6. **Switch to update mode** for that tool's output files

# Phase 2: Classification

→ Load `agents/classifier.md`

Classify across 4 dimensions:

```
DIMENSION     OPTIONS
──────────────────────────────────────────
Stack Type    frontend | backend | fullstack | library | cli | monorepo | mobile | desktop
Complexity    simple | standard | complex | enterprise
Team Context  solo | small-team | large-team | open-source
Maturity      greenfield | active-development | legacy | maintenance-mode
```

Present classification summary to user in pt-BR. Example:

```
📊 Análise do Repositório:
  • Stack: Backend (Node.js + Express + TypeScript)
  • Complexidade: Standard (45 arquivos, PostgreSQL)
  • Contexto: Time pequeno (3 contribuidores)
  • Maturidade: Desenvolvimento ativo
  • Serviços detectados: PostgreSQL, Redis, GitHub Actions
  • Configs de IA existentes: .cursorrules (será usado como base complementar)
```

# Phase 3: Target Selection

Ask the user (pt-BR, single question):

```
🎯 Quais ferramentas de IA você quer configurar?
   Padrão: todas detectadas + Antigravity + Claude Code

   Ferramentas disponíveis:
   1. Antigravity (AGENTS.md + .agents/rules/ + MCP)
   2. Claude Code (CLAUDE.md + .claude/rules/)
   3. Cursor (.cursor/rules/project.mdc)
   4. GitHub Copilot (.github/copilot-instructions.md)
   5. Windsurf (.windsurfrules)
   6. Aider (CONVENTIONS.md + .aider.conf.yml)
   7. Gemini Code Assist (GEMINI.md + .gemini/config.yaml)

   → Responda com os números ou "todas" (padrão).
```

→ Use `graph/output-routing.yaml` to determine exact file list.

# Phase 4: Generation

→ Load `agents/generator.md`
→ Use templates from `templates/`
→ Reference: `references/tool-compatibility-matrix.md`,
  `references/config-locations.md`

### Generation Sequence

1. **AGENTS.md** — canonical cross-tool context (full content)
2. **Workspace rules** — `.agents/rules/code-style.md`, `.agents/rules/workflow.md`,
   `.agents/rules/boundaries.md` (from extracted conventions)
3. **Tool-specific files** — in selection order, using templates
4. **MCP config** — `.antigravity/mcp.json` (if services detected OR local orchestrator detected)
   - If `local_orchestrator_detected` is true, automatically append the orchestrator 
     tools as a standard local MCP server in the generated `mcp.json`.

### Deduplication Rules

- `AGENTS.md` is the **single source of truth** — full project context
- `CLAUDE.md`: starts with `> See AGENTS.md for full project context.` + Claude-specific additions only
- `GEMINI.md`: starts with `> See AGENTS.md for full project context.` + Gemini-specific additions only
- Cursor/Copilot/Windsurf/Aider: focused format-specific content, not full project dump
- **Never** repeat the same 10-line convention list in 7 files

### Update Mode

When existing files are found for a tool:

1. Read existing content
2. Identify existing sections
3. Add missing sections only
4. Update stale info (commands that changed, deps that updated)
5. **Never delete user-added content**
6. If uncertain about a merge → ask user (pt-BR)

# Phase 5: Validation

→ Load `agents/validator.md`

```
DIMENSION       CHECK
─────────────────────────────────────────────────────────
Correctness     Commands reference real scripts
                File paths reference real dirs
                Dependencies match lockfiles
                YAML/JSON is syntactically valid

Consistency     Same project name everywhere
                Same commands everywhere
                No contradictory conventions

Security        No secrets in any file
                No hardcoded absolute paths
                MCP uses ${ENV_VAR} only

Quality         Files within size limits
                No unfilled {{placeholders}}
                Content is specific, not generic
                Each file adds unique value

Cross-Tool      AGENTS.md is canonical
                No full duplication across files
                User content preserved (update mode)
```

Any failure → fix and re-validate. Never present invalid output.

# Phase 6: Delivery

Present to user (pt-BR):

1. **File manifest** — list all generated/updated files with paths
2. **Per-tool verification** — how to confirm each tool reads its config:

```
✅ Checklist de verificação:

Antigravity:
  - [ ] Abra o repo → agente menciona fatos do AGENTS.md
  - [ ] /mcp mostra servidores configurados
  - [ ] /skills lista skills (se aplicável)

Claude Code:
  - [ ] Inicie uma sessão → agente usa contexto do CLAUDE.md
  - [ ] Regras em .claude/rules/ estão ativas

Cursor:
  - [ ] Abra o projeto → regras em .cursor/rules/ ativas
  - [ ] Verifique em Settings → Rules

GitHub Copilot:
  - [ ] Copilot Chat referencia instruções do projeto

Windsurf:
  - [ ] Cascade usa regras do .windsurfrules

Aider:
  - [ ] Execute `aider` → CONVENTIONS.md auto-carregado

Gemini:
  - [ ] Gemini CLI/IDE referencia GEMINI.md
```

3. **Git commit suggestion**:
```
git add .
git commit -m "chore: add AI coding tool configurations

Generated by ai-onboarding skill:
- AGENTS.md (cross-tool standard)
- Claude Code, Cursor, Copilot, Windsurf, Aider, Gemini configs
- MCP server configuration
- Workspace rules and conventions"
```

4. **Next steps** — one paragraph summarizing what was done and suggesting iterative refinement.

# Constraints

- Do NOT guess commands — read them from real config files
- Do NOT generate a 400-line AGENTS.md — supreme means dense, not long
- Do NOT duplicate content across tool files — deduplicate aggressively
- Do NOT include secrets in any generated file — use env-var placeholders
- Do NOT overwrite existing user content — merge in update mode
- Do NOT answer the user in English — artifacts EN, chat pt-BR
- Do NOT generate starter skills — focus on config files, rules, and commands
- ALWAYS verify commands against the repo before including them
- ALWAYS present the verification checklist at the end
- ALWAYS ask the user when uncertain (one question at a time, pt-BR)

# Output Format

```
## ✅ Onboarding Completo

Repositório: {{PROJECT_NAME}}
Stack:       {{STACK_SUMMARY}}
Ferramentas: {{TOOL_LIST}}

Arquivos gerados:
  ✅ AGENTS.md                           (cross-tool standard)
  ✅ .agents/rules/code-style.md         (workspace rules)
  ✅ .agents/rules/workflow.md           (workspace rules)
  ✅ .agents/rules/boundaries.md         (workspace rules)
  ✅ CLAUDE.md                           (Claude Code)
  ✅ .claude/rules/code-style.md         (Claude rules)
  ✅ .cursor/rules/project.mdc           (Cursor)
  ✅ .github/copilot-instructions.md     (GitHub Copilot)
  ✅ .windsurfrules                      (Windsurf)
  ✅ CONVENTIONS.md                      (Aider)
  ✅ .aider.conf.yml                     (Aider config)
  ✅ GEMINI.md                           (Gemini Code Assist)
  ✅ .gemini/config.yaml                 (Gemini config)
  ✅ .antigravity/mcp.json               (MCP servers)

Modo: {{NEW | UPDATE}}
Configs pré-existentes absorvidas: {{EXISTING_CONFIGS}}

Próximo passo: revise os arquivos → commit → teste cada ferramenta
```
