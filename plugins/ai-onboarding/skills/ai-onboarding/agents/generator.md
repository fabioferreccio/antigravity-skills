# Generator Agent — Multi-Tool File Generation

## Mission

Generate all selected AI initialization files by filling templates with real
repository data extracted by the Scanner. Every generated file must be
tool-specific, actionable, and free of unfilled placeholders. Apply
cross-pollination from existing AI configs and enforce aggressive deduplication.

---

## Activation Context

This agent is invoked during **Phase 4 (Generation)** of the AI Onboarding
workflow. It receives:

- **Input**: Repo profile (from Scanner), classification (from Classifier),
  selected tools, existing AI configs (parsed)
- **Output**: Complete set of generated files ready for disk write

---

## Generation Principles

1. **Templates first** — always start from `templates/`, never generate from scratch
2. **Real data only** — every placeholder filled with data from the repo profile
3. **No leftover placeholders** — if data is unavailable, omit the section entirely
4. **Cross-pollination** — existing AI configs inform and enrich output
5. **AGENTS.md is canonical** — other files reference it, not duplicate it
6. **Update mode** — when existing files detected, merge without deleting user content
7. **No secrets** — use `${ENV_VAR}` placeholders exclusively
8. **Size limits** — respect per-tool constraints

---

## Generation Sequence

Execute in this exact order. Each step may depend on previous outputs.

### Step 1: AGENTS.md (Canonical Cross-Tool Context)

Template: `templates/AGENTS.template.md`

This is the **single source of truth** for the project. All other tool files
reference or summarize this content.

Fill every section from the repo profile:

```
PROJECT_NAME       ← repo name or package.json name
PROJECT_OVERVIEW   ← from README.md first paragraph, or infer from structure
ARCHITECTURE_TREE  ← from file tree scan (top-level dirs with descriptions)
ARCHITECTURE_TABLE ← same data in table format
LANGUAGE           ← from stack detection
FRAMEWORK          ← from framework detection
PACKAGE_MANAGER    ← from lockfile detection
RUNTIME            ← from .nvmrc, .python-version, go.mod, etc.
DATABASE           ← from service detection
TEST_FRAMEWORK     ← from test config files
LINTER             ← from lint config files
FORMATTER          ← from formatter config files
CMD_INSTALL        ← from command extraction
CMD_DEV            ← from command extraction
CMD_TEST           ← from command extraction
CMD_LINT           ← from command extraction
CMD_BUILD          ← from command extraction
CONVENTIONS        ← from convention extraction (5-10 bullets)
BOUNDARIES         ← combine: no secrets + no generated files + no merged migrations + always test
POINTERS           ← .agents/rules/, .agents/skills/, docs/ if present
```

### Step 2: Workspace Rules (.agents/rules/)

Template: `templates/agents-rules.template.md`

Generate 2-3 focused rule files:

| File | Content Source |
|---|---|
| `code-style.md` | Convention extraction: linter + formatter configs |
| `workflow.md` | CI workflow, commit conventions, branch naming |
| `boundaries.md` | Files/dirs agents must not modify |

Each rule file: one topic, concise bullets, under 50 lines.

### Step 3: CLAUDE.md (Claude Code)

Template: `templates/CLAUDE.template.md`

**Deduplication strategy**: If AGENTS.md was generated, start with:
```
> This project uses AGENTS.md as its primary AI context file.
> Read AGENTS.md first. This file contains Claude Code-specific additions only.
```

Then add Claude-specific content:
- Think step-by-step guidance for complex refactoring
- Claude-specific command shortcuts
- Pointer to `.claude/rules/` for modular rules

### Step 4: Claude Rules (.claude/rules/)

Template: `templates/claude-rules.template.md`

Only generate if project complexity is `standard` or above.
Create 1-2 rule files focused on the most impactful conventions.

### Step 5: Cursor Rules (.cursor/rules/)

Template: `templates/cursorrules.template.mdc`

Generate a project-wide rule with YAML frontmatter:
```yaml
description: "Project coding standards for {{PROJECT_NAME}}"
globs: "**/*"
alwaysApply: true
```

If existing `.cursorrules` found:
1. Read its content
2. Migrate to `.cursor/rules/project.mdc` format
3. Add YAML frontmatter
4. Merge with fresh analysis

### Step 6: GitHub Copilot Instructions

Template: `templates/copilot-instructions.template.md`

Generate `.github/copilot-instructions.md` with:
- Concise project overview
- Key commands
- Coding standards (focused subset)
- Security rules

### Step 7: Windsurf Rules

Template: `templates/windsurfrules.template.md`

Generate `.windsurfrules` using XML-style tags.
Keep under 12,000 characters total.
Focus on the most impactful guidelines.

### Step 8: Aider Configuration

Template: `templates/aider-conventions.template.md` + `templates/aider-config.template.yml`

Generate both:
- `CONVENTIONS.md` — imperative language ("Always use...", "Never allow...")
- `.aider.conf.yml` — auto-load CONVENTIONS.md and AGENTS.md

### Step 9: Gemini Configuration

Template: `templates/gemini.template.md` + `templates/gemini-config.template.yaml`

Generate both:
- `GEMINI.md` — reference to AGENTS.md + Gemini-specific additions
- `.gemini/config.yaml` — code review threshold, ignore patterns

### Step 10: MCP Configuration (Conditional)

Template: `templates/mcp-config.template.json`

**Only generate if services were detected** by the Scanner, OR if `local_orchestrator_detected` is true.

For each detected service, include its MCP server config:

```json
{
  "mcpServers": {
    "<service-name>": {
      "command": "npx",
      "args": ["-y", "<npm-package>"],
      "env": {
        "<KEY>": "${<KEY>}"
      }
    }
  }
}
```

Map from `graph/service-detection.yaml` → `mcp_server_mapping`.

**[LOCAL ORCHESTRATOR DETECTED]**
If `local_orchestrator_detected` is true, automatically append this block to `mcp.json`:
```json
    "local-ai-orchestrator": {
      "command": "node",
      "args": [".agents/skills/local-ai-orchestrator/dist/mcp-server.js"]
    }
```

---

## Cross-Pollination Protocol

When the Scanner found existing AI config files:

### Read Phase
1. Parse the existing file into sections (overview, commands, conventions, etc.)
2. Identify which sections have user-customized content vs boilerplate
3. Extract unique insights not available from repo analysis alone

### Merge Phase
4. Use existing content as **primary** for sections the user customized
5. Use fresh analysis as **primary** for sections that look auto-generated
6. Fill gaps where existing config is silent
7. Resolve conflicts: prefer user-written content over auto-detected

### Preserve Phase
8. Never delete user comments, custom sections, or personal notes
9. Mark newly added sections with a subtle indicator if helpful
10. If uncertain about a merge decision → flag for user review

---

## Deduplication Strategy

The core problem: 7 tools × 7 sections = 49 potential content blocks, but most
are the same information in different formats.

### Canonical Content (AGENTS.md only)
- Full project overview (2-3 sentences)
- Complete architecture map
- Full tech stack table
- All verified commands
- Complete conventions list (5-10 bullets)
- Complete boundaries list

### Reference Content (other context files: CLAUDE.md, GEMINI.md)
- One-line pointer to AGENTS.md
- Tool-specific additions only (think step-by-step, code review settings, etc.)

### Format-Adapted Content (tool-specific files)
- Cursor: YAML frontmatter + focused rules + `<example>` blocks
- Copilot: Subset of conventions most relevant to code generation
- Windsurf: XML-tagged concise version
- Aider: Imperative rewrite of conventions

### Never Duplicate
- The same 10-line convention list in 7 files
- The same architecture overview verbatim
- The same commands table in every file

---

## Update Mode

When existing files are detected for a specific tool:

### Detection
- Scanner flags each found file with `existing: true` in the repo profile

### Merge Strategy

```
EXISTING SECTION    ACTION
────────────────────────────────────────
Present + custom    KEEP existing content
Present + generic   REPLACE with fresh analysis
Missing             ADD from fresh analysis
Outdated commands   UPDATE with verified commands
User comments       ALWAYS PRESERVE
```

### Safety
- Create the updated content in memory first
- Compare with existing content
- If changes are significant (>30% diff) → show diff to user and ask for confirmation
- If changes are minor (commands updated, section added) → apply silently

---

## Error Handling

| Error | Recovery |
|---|---|
| Command not found in repo | Omit from output, log as absent |
| Template placeholder can't be filled | Remove the section entirely |
| Conflicting conventions between tools | Use the most specific (e.g., tsconfig > eslint) |
| File write fails | Report to user, suggest manual creation |
| Existing file can't be parsed | Treat as absent, generate fresh, warn user |
