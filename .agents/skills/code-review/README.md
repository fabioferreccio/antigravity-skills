# code-review

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

Code Review is a polyglot cognitive system that performs comprehensive code review across architecture, security, simplicity, testing, database, frontend, API contracts, i18n, and error handling lenses. It works with any programming language and framework, orchestrating up to 9 specialized parallel review agents to produce a unified, severity-classified report. When a MR/PR URL is provided, the skill can post anchored inline comments directly on GitHub, GitLab, or Bitbucket.

The agent simulates a Staff Engineer review pipeline — Index → Detect → Dispatch → Analyze → Aggregate → Present — to ensure every code change is thoroughly evaluated before merging.

## When to Use

- You have a branch ready for merge and want a thorough review before opening a MR/PR
- You received a MR/PR link and want inline comments posted automatically
- You want an in-depth review of a single file (design, patterns, edge cases)
- You need a second opinion on code quality from multiple expert perspectives
- You want to enforce architecture and security standards across a polyglot codebase

## When NOT to Use

- Code generation or scaffolding (use language-specific generators)
- Refactoring guidance (use `clean-architecture` for structural refactoring)
- Deployment or infrastructure review (use `devops-agent`)
- Database migration approval (use `migration-reviewer`)
- Schema design from scratch (use `dba-agent`)

## Compatibility

This skill follows the [Agent Skills open standard](https://agentskills.io/specification) and is compatible with:

| Client | Status |
|---|---|
| **Antigravity** (Google) | ✅ Fully supported |
| **Claude Code** (Anthropic) | ✅ Fully supported |
| **VS Code Copilot** (Agent Skills spec) | ✅ Compatible |

## Installation

### Antigravity (default)

```bash
# Workspace-scoped
npx antigravity install code-review

# Global
npx antigravity install code-review --global
```

### Claude Code

```bash
# Workspace-scoped (.claude/skills/)
npx antigravity install code-review --claude

# Global (~/.claude/skills/)
npx antigravity install code-review --claude --global
```

### Both clients at once

```bash
npx antigravity install code-review --all-clients
```

## Usage

This skill activates automatically when:

- User asks to review a branch (e.g., "revisa meu branch feature/xyz")
- User provides a MR/PR URL for review (GitHub, GitLab, Bitbucket)
- User asks to review a specific file (e.g., "revisa o arquivo src/services/payment.service.ts")
- User asks for a code review without specific context (e.g., "pode revisar meu código?")
- User says "review before merge" or "review antes de mergear"

### Review Modes

| Mode | Trigger | Behavior |
|---|---|---|
| **Branch Review** | Branch name detected | Diffs against main/master, reviews all changed files |
| **MR/PR Review** | GitHub/GitLab/Bitbucket URL | Fetches PR metadata + diff, offers inline comment posting |
| **File Review** | File path detected | Reads entire file + dependencies, produces focused review with Migration Plan |
| **Implicit Review** | Generic review request | Detects current branch or asks for clarification |

### Supported Languages and Frameworks

| Language | Frameworks / Ecosystems |
|---|---|
| TypeScript / JavaScript | NestJS, Express, Next.js, React, Angular, Vue |
| Java | Spring Boot, Quarkus, Micronaut |
| Python | Django, FastAPI, Flask |
| Go | Gin, Echo, Fiber, stdlib |
| Rust | Actix, Axum, Rocket |
| Dart | Flutter, Shelf |
| C# | .NET, ASP.NET Core, Blazor |
| PHP | Laravel, Symfony |
| Ruby | Rails, Sinatra |
| Elixir | Phoenix, LiveView |

## Workflow

```
Input (branch name / MR URL / file path / generic request)
  │
  ├─→ Phase 1: INDEX ───────────── Build or load project context index
  ├─→ Phase 2: DETECT ──────────── Identify languages, frameworks, complementary skills
  ├─→ Phase 3: DISPATCH ─────────── Launch parallel review agents
  ├─→ Phase 4: AGGREGATE ────────── Merge findings, resolve conflicts, classify severity
  └─→ Phase 5: PRESENT ─────────── Unified report (pt-BR) + optional inline posting
```

### Review Agents

| Agent | Focus Area |
|---|---|
| architecture-reviewer | Layer violations, dependency direction, coupling, cohesion |
| security-reviewer | Injection, auth flaws, secrets exposure, OWASP patterns |
| simplicity-reviewer | Unnecessary complexity, dead code, over-engineering |
| testing-reviewer | Coverage gaps, missing edge cases, test quality |
| database-reviewer | N+1 queries, missing indexes, raw SQL injection |
| frontend-reviewer | Accessibility, performance, component patterns |
| api-contracts-reviewer | Breaking changes, versioning, schema consistency |
| i18n-reviewer | Hardcoded strings, locale handling, RTL support |
| error-handling-reviewer | Swallowed errors, missing try/catch, error propagation |

> Not all agents are launched for every review. The skill selects agents based on the files touched and detected technologies.

## Output Format

Findings are classified by severity:

| Severity | Label | Meaning |
|---|---|---|
| 🔴 | **Crítico** | Must fix before merge — security flaws, data loss risk, broken contracts |
| 🟡 | **Importante** | Should fix — architecture violations, missing tests, poor patterns |
| 🔵 | **Menor** | Nice to fix — naming, style, minor simplifications |

The report always includes:
- **Resumo**: High-level summary of the review
- **Findings by severity**: Grouped with file, line, what, why, and fix
- **Pontos Fortes**: Positive observations about the code
- **Inline comment offer**: When reviewing a MR/PR

For single-file reviews, a **Migration Plan** section is appended with steps ordered from low to high risk.

## Features

- **Polyglot**: Applies language-appropriate conventions for 10+ languages
- **Project Indexing**: Builds a persistent context index on first run, reuses on subsequent reviews
- **Complementary Skill Detection**: Automatically detects and delegates to skills like `clean-architecture`, `dba-agent`, or `security-engineer` when specialized knowledge is needed
- **Anchored Inline Comments**: Posts comments on the exact diff line in GitHub, GitLab, or Bitbucket using platform APIs
- **Parallel Review Agents**: Up to 9 specialized agents run concurrently for fast, thorough reviews
- **Severity Classification**: Consistent Crítico / Importante / Menor classification across all languages
- **Pre-existing Issue Detection**: Separates issues that already existed from issues introduced by the current change
- **Positive Feedback**: Always highlights what was done well, not just what needs fixing
- **Conflict Resolution**: When multiple agents flag the same line, priority rules determine which finding wins

## Examples

### Example 1: Branch Review

**User says**: "revisa meu branch feature/add-payment-gateway"

**Agent does**:
1. Runs diff against main, indexes project
2. Detects TypeScript + NestJS + Clean Architecture
3. Launches architecture, security, simplicity, and testing agents
4. Presents unified review with severity-classified findings
5. Offers to post inline comments if a MR/PR exists

### Example 2: MR/PR Review with Inline Posting

**User says**: "review this PR https://github.com/myorg/myapp/pull/456"

**Agent does**:
1. Fetches PR metadata and diff via GitHub API
2. Runs parallel review agents on changed files
3. Presents findings and asks to post inline comments
4. Posts anchored comments on the exact diff lines

### Example 3: Single File Review

**User says**: "revisa o arquivo src/domain/entities/order.entity.ts"

**Agent does**:
1. Reads the file and all its dependencies
2. Runs focused review agents (no diff context)
3. Presents findings with a Migration Plan section

See `examples/` directory for detailed input/output examples.

## Limitations

- Cannot analyze runtime behavior — performs static code review only
- Large diffs (>1000 lines) may need to be reviewed in parts to maintain quality
- Bitbucket inline comments require manual personal access token setup
- First run on a project requires indexing, which adds approximately 30 seconds
- Cannot access private repositories without pre-configured CLI authentication (gh, glab)

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

> The skill reads git tokens from existing CLI configurations (`gh`, `glab`) for posting inline comments on MR/PR platforms. It never stores, logs, or transmits these tokens outside the local environment.

## Changelog

See the main [CHANGELOG.md](../../CHANGELOG.md) for version history.

## License

[MIT](../../LICENSE)
