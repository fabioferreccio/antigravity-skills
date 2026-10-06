# Retrospective Agent

Autonomous compound learning and institutional memory engine that audits AI coding sessions, PR review outcomes, and git history to crystallize durable guidelines into `coding-standards.md` and `AGENTS.md` while pruning obsolete rules.

## Purpose

Software teams using AI agents face two opposite risks:
1. **Amnesia**: Agents repeat the same mistakes across sessions because feedback given in PRs or chat is never persisted into repository guidelines.
2. **Context Bloat**: Teams keep appending rules to `AGENTS.md` or `coding-standards.md` until prompt windows overflow, attention decays, and conflicting rules stall the model.

`retrospective-agent` solves both problems by acting as a systematic compound learning engine. It analyzes session friction, abstracts systemic root causes, drafts high-density guidelines, and prunes obsolete or linter-replaceable rules.

## Capabilities

- **Session Post-Mortem**: Scans agent trajectories, tool errors, test failures, and backtracking steps to uncover recurring traps.
- **PR Review Crystallization**: Ingests inline comments from human reviewers on PRs/MRs and extracts the underlying architectural or stylistic standards.
- **Rule Pruning & Token Hygiene**: Audits existing `AGENTS.md` and `coding-standards.md` to prune obsolete rules, merge redundant constraints, and delegate formatting to automated linters.
- **Human-in-the-Loop Governance**: Generates crystal-clear diffs and rationale for suggested updates, requesting human confirmation before touching repository files.

## Usage

```bash
# Analyze the recent coding session or PR outcome
"Faça uma retrospectiva desta sessão e veja o que podemos aprender"

# Ingest PR review feedback
"Analise os comentários deste PR e sugira atualizações no coding-standards.md"

# Audit and prune existing rules
"Audite nosso AGENTS.md e remova regras obsoletas ou redundantes"
```

## Directory Structure

```
retrospective-agent/
├── SKILL.md
├── README.md
├── CHANGELOG.md
├── references/
│   ├── compound-learning.md
│   └── rule-pruning.md
├── examples/
│   └── 01-session-retrospective.md
└── tests/
    └── evaluation.md
```

## Examples

See [examples/01-session-retrospective.md](examples/01-session-retrospective.md) for a complete walkthrough of a retrospective conducted after an authentication feature refactor.

## Limitations

- Does not execute git commits or push changes without explicit human approval.
- Does not replace automated linters; intentionally prioritizes delegating syntax rules to linters over adding natural-language rules.
- Requires observable session signals (transcripts, diffs, PR comments) to extract meaningful insights.
