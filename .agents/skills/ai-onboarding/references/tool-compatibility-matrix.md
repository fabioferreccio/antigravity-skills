# AI Coding Tool Compatibility Matrix

Comprehensive comparison of all supported AI coding tools and their configuration formats.

## File Format Summary

| Feature | Antigravity | Claude Code | Cursor | GitHub Copilot | Windsurf | Aider | Gemini Code Assist |
|---|---|---|---|---|---|---|---|
| **Context File** | `AGENTS.md` | `CLAUDE.md` | — | — | — | — | `GEMINI.md` |
| **Rules Directory** | `.agents/rules/*.md` | `.claude/rules/*.md` | `.cursor/rules/*.mdc` | `.github/instructions/*.md` | `.windsurf/rules/*.md` | — | — |
| **Legacy Single File** | `GEMINI.md` | — | `.cursorrules` | `.github/copilot-instructions.md` | `.windsurfrules` | `CONVENTIONS.md` | — |
| **YAML Frontmatter** | No | No | **Yes** | **Yes** (path-specific) | No (Yes for skills) | No | No |
| **Config File** | — | — | — | — | — | `.aider.conf.yml` | `.gemini/config.yaml` |
| **MCP Config** | `.antigravity/mcp.json` | — | — | — | — | — | — |
| **Skills/Commands** | `.agents/skills/` | `.claude/commands/` | — | — | `.windsurf/skills/` | — | — |
| **Max Context** | Unlimited | ~150 lines rec. | ~500 lines | Unlimited | 12K chars / 6K global | Unlimited | Unlimited |
| **Cross-Tool Standard** | ✅ AGENTS.md | ✅ reads AGENTS.md | ✅ reads AGENTS.md | ✅ reads AGENTS.md | ✅ reads AGENTS.md | ✅ reads AGENTS.md | ✅ reads AGENTS.md |

## Scope Hierarchy

| Tool | Global | Workspace | Directory |
|---|---|---|---|
| **Antigravity** | `~/.gemini/GEMINI.md` | `AGENTS.md` / `GEMINI.md` at root | `.agents/rules/*.md` |
| **Claude Code** | `~/.claude/CLAUDE.md` | `CLAUDE.md` at root | `path/to/CLAUDE.md` |
| **Cursor** | User Settings → Rules | `.cursor/rules/*.mdc` | via `globs` in frontmatter |
| **GitHub Copilot** | Organization policies | `.github/copilot-instructions.md` | `.github/instructions/*.md` (`applyTo`) |
| **Windsurf** | Global rules (6K chars) | `.windsurfrules` (12K chars) | `.windsurf/rules/*.md` |
| **Aider** | `~/.aider.conf.yml` | `.aider.conf.yml` at root | Current dir `.aider.conf.yml` |
| **Gemini** | `~/.gemini/GEMINI.md` | `GEMINI.md` at root | Hierarchical (nearest wins) |

## Precedence Rules

| Tool | Precedence (highest → lowest) |
|---|---|
| **Antigravity** | `.agents/rules/` → `AGENTS.md` / `GEMINI.md` (workspace) → `~/.gemini/GEMINI.md` (global) |
| **Claude Code** | Subdirectory `CLAUDE.md` → Root `CLAUDE.md` → `~/.claude/CLAUDE.md` |
| **Cursor** | `.cursor/rules/*.mdc` (matched by globs) → `alwaysApply: true` rules → User settings |
| **GitHub Copilot** | Path-specific `.instructions.md` → Repo-wide `copilot-instructions.md` → Org policies |
| **Windsurf** | Workspace rules → Global rules → Activation mode (Always/Manual/Model/Glob) |
| **Aider** | CLI flags → CWD `.aider.conf.yml` → Git root `.aider.conf.yml` → `~/.aider.conf.yml` |
| **Gemini** | `.gemini/config.yaml` → `GEMINI.md` / `AGENTS.md` → `~/.gemini/GEMINI.md` |

## YAML Frontmatter Specifications

### Cursor (.mdc files)

```yaml
---
description: "Clear summary of when this rule applies"  # Required
globs: src/**/*.ts, components/**/*                      # Comma-separated, no brackets
alwaysApply: false                                       # If true, loaded in every conversation
---
```

### GitHub Copilot (path-specific .instructions.md)

```yaml
---
description: "Rules for TypeScript files"  # Required
applyTo: "**/*.ts"                         # Glob pattern
---
```

## Key Differences & Gotchas

| Issue | Details |
|---|---|
| **Cursor globs syntax** | Comma-separated, NO brackets or quotes around values |
| **Windsurf char limits** | Workspace: 12,000 chars; Global: 6,000 chars. Exceeding silently truncates |
| **Aider auto-load** | Must add `read: [CONVENTIONS.md]` in `.aider.conf.yml` to auto-load conventions |
| **Gemini env vars** | Some builds mishandle `${VAR}` in global MCP config. Use project-level config as workaround |
| **Claude modular rules** | Each `.claude/rules/*.md` file should be under 250 words for optimal activation |
| **AGENTS.md adoption** | Backed by AAIF (Linux Foundation). Recognized by Cursor, Copilot, Gemini, Windsurf, OpenAI Codex |
| **Copilot org policies** | Organization-level policies override repo-level instructions |
| **Cursor activation modes** | `alwaysApply: true` is expensive; prefer `globs` for targeted activation |

## Cross-Tool Interplay

When multiple AI tools are configured in the same repo:

1. **AGENTS.md** serves as the universal foundation (read by all tools)
2. Tool-specific files add format-specific content (YAML frontmatter, XML tags, etc.)
3. No tool conflicts with another — each reads its own config independently
4. **Deduplication is essential** — same conventions in 7 files wastes context tokens across all tools
5. Best practice: AGENTS.md (full) + tool-specific files (deltas only)

## Generation Priority

When generating for all tools, create in this order:

```
1. AGENTS.md              (canonical, all tools read it)
2. .agents/rules/         (Antigravity workspace rules)
3. CLAUDE.md              (Claude Code - most detailed after AGENTS.md)
4. .cursor/rules/*.mdc    (Cursor - needs YAML frontmatter)
5. copilot-instructions   (Copilot - focused subset)
6. .windsurfrules         (Windsurf - XML-tagged, concise)
7. CONVENTIONS.md         (Aider - imperative rewrite)
8. .aider.conf.yml        (Aider - config auto-loader)
9. GEMINI.md              (Gemini - reference to AGENTS.md)
10. .gemini/config.yaml   (Gemini - code review settings)
11. .antigravity/mcp.json (MCP - only if services detected)
```
