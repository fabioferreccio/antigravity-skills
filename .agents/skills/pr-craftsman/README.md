# pr-craftsman

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

`pr-craftsman` is a supreme Pull Request engineering skill designed to eliminate reviewer fatigue and PR bottlenecks. It inspects local git diffs, calculates the operational blast radius, classifies decision reversibility according to the One-Way vs. Two-Way Door framework, generates intuitive Mermaid diagrams, and outputs human-friendly PR descriptions.

## Key Features

- **Blast Radius Analysis**: Automatically scores changes into Tier 1 (Critical), Tier 2 (Feature), or Tier 3 (Cosmetic).
- **Decision Doors Classification**: Flags One-Way Doors (irreversible schema/auth/payment changes) vs. Two-Way Doors (reversible, fast-track merges).
- **Visual Architecture Diagrams (Show-Me)**: Auto-generates Mermaid flowcharts, sequence diagrams, or state transitions to visualize changes before and after.
- **Reviewer Roadmap**: Generates a step-by-step "Where to Start" reading order for human reviewers.

## When to Use

- When preparing to open a Pull Request or Merge Request on GitHub, GitLab, or Bitbucket.
- When an AI agent has completed feature implementation and you want a high-signal description.
- When needing to communicate technical risk and rollback viability to team leads.

## When NOT to Use

- For performing the actual code review (use `code-review`).
- For writing unit or integration tests (use `qa-engineer`).
- For database lock analysis only (use `migration-reviewer`).

## Usage

Activate the skill by typing any of the following triggers:
- `"craft pr"`
- `"gerar pull request"`
- `"criar descrição de pr"`
- `"generate pr description"`
- `"preparar pr"`

## Security & Permissions

- Network access: `false` (operates entirely offline via local git).
- Filesystem: `read-write` (can write PR drafts locally).
- Terminal: `sandboxed` (runs read-only `git diff`, `git log` commands).
