---
name: bug-hunter
description: >
  Supreme autonomous skill that performs a comprehensive, multi-agent codebase
  sweep to identify concrete bugs AND structurally audit existing tests. It uses 
  an adversarial verification process to refute false positives for bugs, and 
  evaluates test effectiveness, fragility, and coverage gaps, generating a highly 
  detailed, dual-dashboard markdown report.
version: 1.1.0
author: Fábio Ferreccio
tags:
  - auditing
  - bug-hunting
  - test-quality
  - multi-agent
  - adversarial-review
  - quality-assurance
  - cybersecurity
triggers:
  - "faça um workflow amplo para identificar bugs de incorretudes e possíveis problemas concretos por todo o projeto"
  - "varredura completa de bugs no projeto"
  - "encontre bugs concretos e race conditions"
  - "realize uma auditoria adversarial de corretude e de testes"
  - "gere um relatório profundo de bugs reais e qualidade de testes"
  - "audite os testes e classifique a eficácia"
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

Execute an elite, exhaustive **Bug-Hunting and Test Auditing** workflow across the entire codebase. This skill operates in an integrated, dual-mode fashion:
1. **Bug Hunting**: It scans for concrete correctness, security, and monetary bugs, employing **Adversarial Verification** via sub-agents to prove or refute potential bugs.
2. **Test Auditing**: It evaluates existing test files, classifying them by effectiveness, diagnosing gaps, and recommending actions, prioritizing domains by automatically inferred financial risk (Tiers).

The final output is a deterministic, highly detailed markdown report focused solely on *real, concrete bugs* and *actionable test quality metrics*, ignoring mere stylistic preferences.

# Instructions

The workflow always executes both phases.

### Phase 1: Codebase Bug Sweep
1. **Mapping Phase**: Map domains, controllers, services, and infrastructure using `explore-codebase-ast` or `read-file-chunked`.
2. **Hunting Phase**: Scan for: `race-condition`, `null-safety`, `dinheiro/precision`, `async`, `logica`, `memory-leak`, `resource-exhaustion`, `data-integrity`, `auth`, `injections/crypto`. Formulate a **Failure Scenario** and classify **Severity** (Alta 🔴, Média 🟡, Baixa 🟢).
3. **Adversarial Verification Phase**: For high and medium severity findings, you **MUST invoke a sub-agent** to perform an adversarial review. Prompt the sub-agent to: *"Act as a skeptical reviewer. Your goal is to REFUTE this bug. If you cannot refute it, confirm it."*
4. Compile findings using the **Part 1 Output Format**.

### Phase 2: Test Quality Audit
1. **Domain & Risk Inference**: Group tests by domains (e.g., `precharge`, `pix`, `user`). Automatically infer the financial risk of each domain:
   - **Tier 1 (Alto Risco)**: Any domain handling direct money (e.g., generating money, double refunds, duplicate withdrawals, payment processing, fiscal).
   - **Tier 2 (Risco Médio)**: Integration layers, critical system state, business rules not directly transacting money.
   - **Tier 3 (Risco Baixo)**: View layers, opt-outs, profile edits without financial impact.
2. **Test Evaluation**: For each test, evaluate:
   - **Veredito**: `efetivo` (tests real behavior robustly), `fragil` (brittle, tautological, non-deterministic, time-dependent), `inconclusivo`.
   - **Ação**: `manter`, `refatorar`, `remover`.
   - **Técnica**: Identify the testing technique (e.g., `EP` - Equivalence Partitioning, `BVA` - Boundary Value Analysis, `adivinhacao-erro`, `mock-excessivo`).
   - **Gap**: Describe clearly why the test fails to add value (e.g., "Mocking implementation details", "Time-dependent execution failing in CI") and how to fix it.
3. Compile findings using the **Part 2 Output Format**.

# Conventions

- **Language**: User interaction and the final markdown report MUST be in Brazilian Portuguese (PT-BR). Internal reasoning and agent prompts in English.
- **Quality Standard**: Do NOT report stylistic issues.
- **Evidence**: Include exact file paths, line numbers, and actionable fixes.

# Constraints

- Do NOT execute destructive commands.
- Do NOT hallucinate code or tests.
- ALWAYS respect the automatic risk inference rule: anything involving money is Tier 1.

# Output Format

The final report must exactly match this structure (combining both parts in one or multiple markdown files):

```markdown
# 🐛 Relatório de Bugs e Auditoria de Testes — <nome-do-projeto>

> Gerado em **<data>** por workflow multi-agente. Escopo: incorretudes concretas e eficácia de testes.

---

## PARTE 1: Auditoria de Bugs

### Cobertura — varredura completa

| Área | Status |
|---|---|
| <pasta/modulo> | ✅ verificação adversarial |

**Totais: <N> bugs reais confirmados** (<X> por verificação adversarial + <Y> por leitura direta) · <Z> refutados.

### ✅ Confirmados por verificação adversarial (<X>)

#### 1. <Título descritivo da falha e impacto>
- **Local:** `<caminho/do/arquivo.ts>:<linha>`
- **Severidade:** 🔴 Alta / 🟡 Média / 🟢 Baixa
- **Categoria:** `<taxonomia>`

**Descrição:** <Explicação profunda>
**Cenário de falha:** <Passo a passo prático>
```<linguagem>
<snippet>
```
**Correção sugerida:** <Sugestão>
- [ ] Resolvido

---

## PARTE 2: Auditoria de Qualidade de Teste

### Resumo Executivo
- **Domínios auditados**: <N>/<Total>
- **Testes efetivos**: <N>
- **Testes frágeis + inconclusivos**: <N>
- **Testes a remover**: <N>

### Domínios por Risco Financeiro

| # | DOMÍNIO | RISCO | EFETIV. | STATUS |
|---|---|---|---|---|
| 1 | `payment` | Tier 1 🔴 | 15% | CONCLUÍDO |
| 2 | `user` | Tier 3 🟢 | 80% | VALIDADO |

---

### Detalhamento por Domínio

#### 🔵 <nome_do_dominio>
`Risco: Tier X` · `<caminho/do/dominio>`

**Métricas**: 🔴 `<N> frágeis` | 🟢 `<N> efetivos` | 🟣 `<N> inconclusivos` | ❌ `<N> remover`

**Camadas sem cobertura**: `<detalhe das partes críticas do domínio que não têm testes>`

▼ **Relação dos testes auditados**

| TESTE | CAMADA | VEREDITO | AÇÃO | TÉCNICA | GAP |
|---|---|---|---|---|---|
| `<arquivo>:<nome_do_teste>` | `unitário` | 🔴 `frágil` | 🛠️ `refatorar` | `adivinhacao-erro` | **Problema**: O teste é tautológico e nunca quebra em CI. **Correção**: Mockar o serviço via injeção e assertar a chamada correta. |
| `<arquivo>:<nome_do_teste>` | `integração` | 🟢 `efetivo` | ✅ `manter` | `BVA` | Cobertura limpa de borda de datas. |
```
