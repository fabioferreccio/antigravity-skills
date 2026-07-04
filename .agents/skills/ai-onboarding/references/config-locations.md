# Configuration File Locations — All AI Coding Tools

Exact file paths, precedence rules, and verification commands for every
supported AI coding tool. Expanded from the original Antigravity config map
to cover 7+ tools.

---

## 1. Antigravity (IDE, 2.0, CLI `agy`)

### Context Files

| Scope | Path | Notes |
|---|---|---|
| Global | `~/.gemini/GEMINI.md` | Personal prefs, all projects |
| Workspace | `AGENTS.md` at repo root | Cross-tool standard; preferred |
| Workspace (alt) | `GEMINI.md` at repo root | Antigravity-specific; AGENTS.md wins if both exist |
| Workspace rules | `.agents/rules/*.md` | One topic per file; always enforced |

### Skills

| Scope | Path |
|---|---|
| Workspace | `.agents/skills/<name>/SKILL.md` |
| Global | `~/.gemini/antigravity/skills/<name>/SKILL.md` |

### MCP Servers

| Scope | Path | Notes |
|---|---|---|
| Project | `.antigravity/mcp.json` | `{"mcpServers": {...}}` shape |
| Global | `~/.gemini/antigravity/mcp_config.json` or `~/.gemini/config/mcp_config.json` | Varies by install |
| IDE UI | Settings → Customizations → Add MCP+ | Includes one-click Google Cloud servers |

### Verification

- `/mcp` — shows connected servers
- `/skills` — lists available skills
- `/permissions` — shows approval rules
- Open repo → agent should mention facts from AGENTS.md unprompted

### Known Quirks

- Some builds mishandle `${VAR}` expansion in global MCP config
- If server fails with env placeholders, use project-level config
- `.gemini/skills/` is legacy path; use `.agents/skills/`

---

## 2. Claude Code (Anthropic)

### Context Files

| Scope | Path | Notes |
|---|---|---|
| Global | `~/.claude/CLAUDE.md` | Personal preferences |
| Workspace | `CLAUDE.md` at repo root | Project standards (committed) |
| Directory | `path/to/CLAUDE.md` | Sub-module specific |
| Modular rules | `.claude/rules/*.md` | Auto-loaded, no frontmatter |

### Key Details

- No YAML frontmatter required
- Each rule file under 250 words
- `/init` auto-generates baseline CLAUDE.md
- Also reads `AGENTS.md` if present

### Verification

- Start new session → agent uses CLAUDE.md context
- `/memory` shows loaded context files
- Rules in `.claude/rules/` should influence behavior

---

## 3. Cursor IDE

### Configuration Files

| Scope | Path | Notes |
|---|---|---|
| Workspace | `.cursor/rules/*.mdc` | Modern standard (YAML frontmatter required) |
| Legacy | `.cursorrules` at root | Still supported, deprecated |
| User | Settings → Rules | Personal, not committed |

### YAML Frontmatter (Required for .mdc)

```yaml
---
description: "When this rule applies"
globs: src/**/*.ts, components/**/*
alwaysApply: false
---
```

### Verification

- Settings → Rules → check rules are listed
- Agent should follow rules when editing matching files

### Known Quirks

- Globs are comma-separated, NO brackets or quotes
- `alwaysApply: true` is expensive — use `globs` for targeting
- Legacy `.cursorrules` migration: copy content to `.cursor/rules/project.mdc`, add frontmatter

---

## 4. GitHub Copilot

### Configuration Files

| Scope | Path | Notes |
|---|---|---|
| Repository-wide | `.github/copilot-instructions.md` | Auto-applied to all chat |
| Path-specific | `.github/instructions/*.instructions.md` | YAML frontmatter required |
| Organization | Org settings → Copilot policies | Overrides repo-level |

### YAML Frontmatter (Path-specific only)

```yaml
---
description: "Rules for C# files"
applyTo: "**/*.cs"
---
```

### Verification

- Copilot Chat → ask about project → should use instructions
- `/generateInstructions` — auto-scaffold (if supported)

---

## 5. Windsurf / Codeium (now Devin Desktop)

### Configuration Files

| Scope | Path | Notes |
|---|---|---|
| Workspace | `.windsurfrules` at root | Legacy single file (12K chars max) |
| Modern | `.windsurf/rules/*.md` | Modular approach |
| Skills | `.windsurf/skills/<name>/SKILL.md` | With YAML frontmatter |
| Global | Windsurf Settings → Rules | 6K chars max |

### Activation Modes (Modern Rules)

| Mode | Behavior |
|---|---|
| Always On | Loaded in every conversation |
| Manual | User must invoke explicitly |
| Model Decision | AI decides based on description |
| Glob | Auto-triggered by file pattern |

### Verification

- Cascade → check if rules influence responses
- Settings → Customizations → verify rules listed

---

## 6. Aider

### Configuration Files

| Scope | Path | Precedence |
|---|---|---|
| Global | `~/.aider.conf.yml` | Lowest |
| Git root | `.aider.conf.yml` at repo root | Medium |
| Current dir | `.aider.conf.yml` in CWD | Highest |
| CLI flags | `--read`, `--lint-cmd`, etc. | Overrides all |

### Conventions File

| Path | Notes |
|---|---|
| `CONVENTIONS.md` at repo root | Must be referenced in `.aider.conf.yml` via `read:` |

### Auto-Loading

```yaml
# .aider.conf.yml
read:
  - CONVENTIONS.md
  - AGENTS.md
```

### Verification

- Run `aider` → check that CONVENTIONS.md is loaded (shown in startup)
- Lint commands should auto-execute if `auto-lint: true`

---

## 7. Gemini Code Assist / Gemini CLI

### Configuration Files

| Scope | Path | Notes |
|---|---|---|
| Global | `~/.gemini/GEMINI.md` | Personal preferences |
| Workspace | `GEMINI.md` at repo root | Also reads `AGENTS.md` |
| Code review | `.gemini/config.yaml` | Severity threshold, ignore patterns |
| Style guide | `.gemini/styleguide.md` | Code review conventions |
| AI exclude | `.aiexclude` at root | Files to exclude from AI context |

### .gemini/config.yaml Format

```yaml
code_review:
  comment_severity_threshold: "MEDIUM"
ignore_patterns:
  - "vendor/**"
  - "*.generated.go"
```

### Verification

- Gemini CLI/IDE → agent should reference GEMINI.md context
- Code review should respect config.yaml thresholds

---

## Cross-Tool Standard: AGENTS.md

- **Specification**: Agentic AI Foundation (AAIF) under Linux Foundation
- **Origin**: OpenAI contribution (Dec 2025)
- **Supported by**: Antigravity, Claude Code, Cursor, Copilot, Windsurf, Aider, Gemini, OpenAI Codex, Zed
- **Location**: Repo root
- **Monorepo**: Hierarchical — "nearest file wins"
- **Format**: Plain Markdown, no frontmatter, no enforced schema
- **Recommendation**: Use as the canonical context file; other tool files reference it

---

## Symlink Strategy

When multiple tools need the same base content:

```
AGENTS.md                    ← canonical source (committed)
CLAUDE.md                    ← tool-specific additions + pointer to AGENTS.md
GEMINI.md                    ← tool-specific additions + pointer to AGENTS.md
CONVENTIONS.md               ← imperative rewrite of AGENTS.md conventions
.cursor/rules/project.mdc   ← focused rules with YAML frontmatter
```

**Do NOT symlink** — each file should have format-appropriate content, not identical copies.
