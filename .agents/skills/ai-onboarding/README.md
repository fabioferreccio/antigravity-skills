# ai-onboarding

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

The **AI Onboarding** skill is a supreme autonomous operator that performs deep repository analysis and generates **all AI initialization files** needed to onboard any legacy project into the AI coding universe. From a single repo scan, it produces cross-tool compatible configurations for **Antigravity, Claude Code, Cursor, GitHub Copilot, Windsurf, Aider, and Gemini Code Assist** — making any repository instantly AI-ready across every major coding assistant.

## Architecture

```
ai-onboarding/
├── SKILL.md                          ← Lean kernel: phase routing + orchestration
├── README.md                         ← This file
├── agents/                           ← 4 internal cognitive agents
│   ├── scanner.md                    Deep repo analysis (Phase 0-1)
│   ├── classifier.md                 Stack/convention classification (Phase 2)
│   ├── generator.md                  Multi-tool file generation (Phase 3-4)
│   └── validator.md                  Output quality gate (Phase 5)
├── templates/                        ← 13 per-tool output templates
│   ├── AGENTS.template.md            Cross-tool standard
│   ├── CLAUDE.template.md            Claude Code context
│   ├── claude-rules.template.md      .claude/rules/*.md modular rules
│   ├── cursorrules.template.mdc      Cursor rules (YAML frontmatter)
│   ├── copilot-instructions.template.md  GitHub Copilot repo-wide
│   ├── copilot-rule.template.md      GitHub Copilot path-specific
│   ├── windsurfrules.template.md     Windsurf rules
│   ├── aider-conventions.template.md Aider CONVENTIONS.md
│   ├── aider-config.template.yml     Aider .aider.conf.yml
│   ├── gemini.template.md            Gemini Code Assist context
│   ├── gemini-config.template.yaml   .gemini/config.yaml
│   ├── mcp-config.template.json      MCP server config
│   └── agents-rules.template.md      .agents/rules/ workspace rules
├── references/                       ← On-demand documentation
│   ├── tool-compatibility-matrix.md  Feature matrix across all AI tools
│   ├── config-locations.md           Where each tool reads its config
│   ├── stack-detection-patterns.md   How to identify languages/frameworks
│   └── mcp-server-catalog.md         Known MCP servers by service type
├── graph/                            ← Structured knowledge graphs
│   ├── stack-heuristics.yaml         Stack detection decision tree
│   ├── service-detection.yaml        External service/MCP detection
│   ├── convention-extraction.yaml    Convention extraction from configs
│   └── output-routing.yaml           File generation decision matrix
├── examples/
│   ├── onboard-node-api.md           Node.js Express API walkthrough
│   └── onboard-python-monorepo.md    Python monorepo walkthrough
└── tests/
    └── test-onboarding-lifecycle.md  13-case eval suite
```

## Design Principles

| Principle | Implementation |
|---|---|
| **Scan, don't guess** | Every fact verified against real files in the repo |
| **One analysis, all tools** | Single deep scan produces configs for 7+ tools |
| **AGENTS.md is canonical** | Other files reference it, never fully duplicate |
| **Update, don't overwrite** | Existing AI configs are preserved and enriched |
| **Cross-pollinate** | Existing .cursorrules enriches CLAUDE.md and vice versa |
| **Dense, not long** | AGENTS.md under 150 lines; supreme means concise |

## When to Use

- **First-time AI setup**: Repository has never been configured for AI tools
- **Legacy project onboarding**: Bring an older project into the AI coding ecosystem
- **Multi-tool standardization**: Want consistent AI config across all tools
- **Migration**: Moving from one AI tool to another (e.g., Cursor → Claude)
- **Config refresh**: Existing AI configs are outdated or incomplete

## When NOT to Use

- For creating new **skills** → use `skill-creator`
- For **code review** → use `code-review`
- For **auditing existing skills** → use `repository-maintainer`
- For **single-tool config** → just create the file manually
- When the project is **not a code repository** (docs-only, media)

## Supported Tools

| Tool | Generated Files | Key Format |
|---|---|---|
| **Cross-tool** | `AGENTS.md` | Plain Markdown (AAIF standard) |
| **Antigravity** | `.agents/rules/*.md`, `.antigravity/mcp.json` | Markdown + JSON |
| **Claude Code** | `CLAUDE.md`, `.claude/rules/*.md` | Plain Markdown |
| **Cursor** | `.cursor/rules/project.mdc` | Markdown with YAML frontmatter |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Plain Markdown |
| **Windsurf** | `.windsurfrules` | Markdown with XML tags |
| **Aider** | `CONVENTIONS.md`, `.aider.conf.yml` | Markdown + YAML |
| **Gemini** | `GEMINI.md`, `.gemini/config.yaml` | Markdown + YAML |

## Workflow

```
User Request → Phase 0: Recon (deep scan) → Phase 1: Existing Config (cross-pollinate)
→ Phase 2: Classification (stack, complexity, team, maturity)
→ Phase 3: Target Selection (which AI tools?)
→ Phase 4: Generation (templates + real data)
→ Phase 5: Validation (correctness, security, consistency)
→ Phase 6: Delivery (file manifest, checklist, commit)
```

## Operating Modes

| Mode | When | Behavior |
|---|---|---|
| **New** | No existing AI configs | Full generation from scratch |
| **Update** | Existing configs found | Merge: add missing sections, preserve user content |
| **Guide** | No repo access (chat-only) | Produce copy-pasteable templates |

## Language Rules

| Context | Language |
|---|---|
| User conversation | Brazilian Portuguese (pt-BR) |
| Internal reasoning | English |
| Generated files | English |

## Examples

### Example 1: Node.js Express API

**User says**: "Configure AI tools for this project"

**Agent does**:
1. Scans repo: TypeScript + Express + Prisma + PostgreSQL + Redis
2. Classifies: Backend, Standard complexity, Small team
3. Asks which tools to target
4. Generates 14 files (AGENTS.md + 7 tool configs + 3 rules + MCP)
5. Validates all files
6. Presents checklist

See [onboard-node-api.md](examples/onboard-node-api.md) for full walkthrough.

### Example 2: Python Monorepo (Update Mode)

**User says**: "Configura as ferramentas de IA pra esse monorepo"

**Agent does**:
1. Scans repo: Python + FastAPI + Celery + PostgreSQL + RabbitMQ
2. Detects existing CLAUDE.md and AGENTS.md
3. Enters Update Mode: reads existing configs, preserves content
4. Adds missing sections, enriches with fresh analysis
5. Generates new tool configs (Cursor, Aider, etc.)

See [onboard-python-monorepo.md](examples/onboard-python-monorepo.md) for full walkthrough.

## Limitations

- Does not generate **starter skills** — focuses on configuration files
- MCP server catalog is limited to well-known servers — custom servers need manual config
- Guide mode produces generic templates — less specific than repo-scan mode
- Cannot verify external service connectivity (just detects from config)
- Large monorepos may take longer to scan (depth limited to 3 levels)

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## Changelog

See the main [CHANGELOG.md](../../../CHANGELOG.md) for version history.

## License

[MIT](../../../LICENSE)
