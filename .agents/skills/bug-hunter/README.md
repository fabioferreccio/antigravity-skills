# bug-hunter

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

A supreme, elite meta-skill designed to perform comprehensive, project-wide sweeps for concrete bugs. It operates on a multi-agent adversarial architecture: it hunts for issues spanning concurrency (race conditions), money precision, null-safety, unhandled async states, logic flaws, memory leaks, resource exhaustion, and security vulnerabilities (injections, weak crypto, auth bypass). It actively invokes sub-agents to act as "skeptics" to refute found bugs, ensuring zero false positives and high-signal reporting.

## When to Use

- When preparing for a major release and needing a strict correctness audit.
- When stabilizing a legacy codebase filled with silent bugs.
- When the user asks for a deep bug hunt across the entire project or specific critical modules.

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
- "realize uma auditoria adversarial de corretude"

## Examples

### Example 1: Full Project Sweep

**User says**: "faça um workflow amplo para identificar bugs de incorretudes e possíveis problemas concretos por todo o projeto. colete tudo e coloque em um markdown de bugs para eu resolver depois."

**Agent does**:
1. Maps the project using `explore-codebase-ast` or chunked reading.
2. Identifies a race condition in `payment.service.ts` and a null-safety issue in `webhook.service.ts`.
3. Spawns a sub-agent (`qa-engineer` or `security-engineer`) to adversarially verify both findings.
4. The sub-agent refutes the null-safety issue but confirms the race condition.
5. The primary agent generates a detailed `BUGS.md` report with the confirmed finding.

**Output**:
```markdown
# 🐛 Relatório de Bugs — zig-payments
...
## ✅ Confirmados por verificação adversarial (1)
### 1. refundPayment e cancelPayment têm check-then-act sem lock
...
```

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
