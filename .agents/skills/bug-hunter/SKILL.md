---
name: bug-hunter
description: >
  Supreme autonomous skill that performs a comprehensive, multi-agent codebase
  sweep to identify concrete bugs (correctness, concurrency, monetary, logic,
  memory, and security flaws). Uses an adversarial verification process via
  sub-agents to refute false positives before generating a highly detailed,
  actionable markdown report.
version: 1.0.0
author: Fábio Ferreccio
tags:
  - auditing
  - bug-hunting
  - multi-agent
  - adversarial-review
  - quality-assurance
  - cybersecurity
triggers:
  - "faça um workflow amplo para identificar bugs de incorretudes e possíveis problemas concretos por todo o projeto"
  - "varredura completa de bugs no projeto"
  - "encontre bugs concretos e race conditions"
  - "realize uma auditoria adversarial de corretude"
  - "gere um relatório profundo de bugs reais"
scope: workspace
tools:
  - filesystem
  - terminal
  - mcp
  - subagents
security:
  network: false
  filesystem: read-write
  terminal: sandboxed
---

# Goal

Execute an elite, exhaustive bug-hunting workflow across the entire codebase. This skill goes beyond static analysis by employing **Adversarial Verification** via sub-agents to prove or refute potential bugs. The final output is a deterministic, highly detailed markdown report focused solely on *real, concrete bugs* (ignoring mere stylistic preferences), using extensive taxonomy from software engineering and cybersecurity.

# Instructions

1. **Mapping Phase**
   - Read the project structure. If the project is large, utilize the `explore-codebase-ast` skill or `read-file-chunked` to map domains, controllers, services, and infrastructure without blowing up the context window.
   - Identify critical areas: payment gateways, database transactions, concurrency controls, authentication layers.

2. **Hunting Phase (Direct Reading)**
   - Scan the codebase looking for the following broad taxonomy of issues:
     - `race-condition` (check-then-act without locks, non-atomic updates)
     - `null-safety` (missing optional chaining, unsafe type assertions)
     - `dinheiro` / `precision` (floating-point math with currency, rounding errors)
     - `async` (unhandled promise rejections, missing awaits, floating promises)
     - `logica` (inverted guards, unreachable code, flawed business rules)
     - `memory-leak` (unbounded caches, unclosed connections)
     - `resource-exhaustion` (missing timeouts on network calls, unbounded retries)
     - `data-integrity` (partial commits, missing foreign keys, orphaned records)
     - `auth` (bypassable guards, hardcoded secrets, weak token validation)
     - `injections` / `crypto` (unsanitized inputs, weak algorithms)
   - For every suspicious pattern found, formulate a **Failure Scenario** and classify its **Severity** (Alta 🔴, Média 🟡, Baixa 🟢).

3. **Adversarial Verification Phase (Sub-Agents)**
   - For all high and medium severity findings, you **MUST invoke a sub-agent** (e.g., using `invoke_subagent` with a `qa-engineer` or `security-engineer` persona) to perform an adversarial review.
   - **Prompt to Sub-Agent**: Provide the code snippet, the surrounding context, and your hypothesis of the bug. Command the sub-agent to: *"Act as a skeptical reviewer. Your goal is to REFUTE this bug. Look for external locks, global error handlers, or database constraints that might mitigate this issue. If you cannot refute it, confirm it."*
   - Await the sub-agent's response. If the sub-agent successfully refutes the bug, discard it. If confirmed, mark it as `✅ verificação adversarial`.
   - If sub-agent tokens/budget are exhausted, fallback to `✅ leitura direta` (self-reflection).

4. **Reporting Phase**
   - Compile all confirmed findings into a single `BUGS.md` file in the workspace or as requested by the user.
   - The report MUST strictly follow the structure defined in the `Output Format` section.

# Conventions

- **Language**: User interaction and the final markdown report MUST be in Brazilian Portuguese (PT-BR). Internal reasoning and agent prompts in English.
- **Quality Standard**: Do NOT report stylistic issues (e.g., "use const instead of let", "extract to function"). Report only issues that cause runtime failures, data corruption, financial loss, or security breaches.
- **Evidence**: Every bug MUST include the exact file path, line number, a detailed failure scenario, the problematic code snippet, and a suggested fix.

# Constraints

- Do NOT execute destructive commands.
- Do NOT hallucinate code. Verify the exact lines using `view_file` or `grep_search`.
- ALWAYS respect the user's focus (e.g., if they asked for correctness, focus heavily on race conditions and logic, though security vulnerabilities like injections should still be logged if concrete).

# Output Format

The final report must exactly match this structure:

```markdown
# 🐛 Relatório de Bugs — <nome-do-projeto>

> Gerado em **<data>** por workflow multi-agente de caça a bugs. Escopo: bugs de incorretude e problemas concretos.

## Cobertura — varredura completa

| Área | Status |
|---|---|
| <pasta/modulo> | ✅ verificação adversarial |
| <pasta/modulo> | ✅ leitura direta |

**Totais: <N> bugs reais confirmados** (<X> por verificação adversarial + <Y> por leitura direta) · <Z> refutados.

---

## ✅ Confirmados por verificação adversarial (<X>)

### 1. <Título descritivo da falha e impacto>

- **Local:** `<caminho/do/arquivo.ts>:<linha>`
- **Severidade:** 🔴 Alta / 🟡 Média / 🟢 Baixa
- **Categoria:** `<taxonomia>`

**Descrição:** <Explicação profunda do porquê o código falha, focando no mecanismo do erro.>

**Cenário de falha:** <Passo a passo prático de como o bug é trigado em produção.>

```<linguagem>
<snippet do código com o bug>
```

**Correção sugerida:** <Como consertar o código (ex: adicionar lock, usar transação, sanitizar input, etc).>

- [ ] Resolvido

---
```
