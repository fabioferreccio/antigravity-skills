# bug-hunter

> **Version**: 1.1.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

A supreme, elite meta-skill designed to perform comprehensive, project-wide sweeps for concrete bugs **and** audit test quality. It operates on a multi-agent adversarial architecture:
- **Bug Hunting**: Hunts for issues spanning concurrency (race conditions), money precision, null-safety, logic flaws, memory leaks, resource exhaustion, and security vulnerabilities. It actively invokes sub-agents to act as "skeptics" to refute found bugs, ensuring zero false positives and high-signal reporting.
- **Test Auditing**: Evaluates existing test files, classifying them by effectiveness (efetivo, frágil, inconclusivo), diagnosing gaps, and recommending actions. It automatically infers financial risk to group tests into Tiers (e.g., Tier 1 for monetary paths).

## When to Use

- When preparing for a major release and needing a strict correctness audit.
- When stabilizing a legacy codebase filled with silent bugs or fragile tests.
- When you need a deep, visually-rich dashboard report of test quality and bug findings.

## When NOT to Use

- For style checking, linting, or simple code formatting.
- For purely theoretical architectural advice without concrete bug scenarios.

## Installation

### Local (workspace-scoped)

```bash
npx antigravity install bug-hunter
```

### Global (available everywhere)

```bash
npx antigravity install bug-hunter --global
```

## Usage

This skill activates automatically when:

- "faça um workflow amplo para identificar bugs de incorretudes e possíveis problemas concretos por todo o projeto"
- "varredura completa de bugs no projeto"
- "encontre bugs concretos e race conditions"
- "realize uma auditoria adversarial de corretude e de testes"
- "gere um relatório profundo de bugs reais e qualidade de testes"
- "audite os testes e classifique a eficácia"

## Examples

### Example 1: Full Project Sweep and Test Audit

**User says**: "faça um workflow amplo para identificar bugs e auditar a qualidade dos nossos testes. gere um relatorio estruturado."

**Agent does**:
1. Maps the project using `explore-codebase-ast` or chunked reading.
2. Identifies bugs (e.g., a race condition) and invokes a sub-agent to verify them.
3. Groups test files into Tiers (e.g., `payment` = Tier 1, `user` = Tier 3).
4. Evaluates tests, marking fragile tautological tests or identifying gaps.
5. Generates a comprehensive dual-part `BUGS.md` / `TEST-AUDIT.md` report.

## Limitations

- The adversarial verification phase consumes extra tokens and context. If context limits are reached, the agent will gracefully degrade to `leitura direta` (self-reflection).
- The skill does not write the fixes directly unless explicitly asked; its primary goal is high-quality discovery and reporting.

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## Changelog

See the main [CHANGELOG.md](../../CHANGELOG.md) for version history.

## License

[MIT](../../LICENSE)
