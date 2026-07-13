# Example: Test Audit

This example demonstrates how the `bug-hunter` skill behaves when asked to audit tests and group them by financial risk.

### Input
```
User request: "audite os nossos testes na pasta precharge, focando em eficácia e gaps."
```

### Agent Process

1. **Domain & Risk Inference**: The agent identifies `precharge` handles financial recharges. It automatically infers it as **Tier 1 (Alto Risco)**.
2. **Evaluation**:
   - The agent reads `src/apis/precharge/helpers/precharge.test.ts`.
   - It finds `getSlugFromCtx > should return the slug when it exists in the context`.
   - It detects the test is missing imports, never runs in CI, and fails to cover empty slugs (`""`).
   - It classifies the test as `frágil`, with action `refatorar`, using technique `EP`.
   - It reads `user.test.ts` and detects non-deterministic dates relying on the system clock (`Date.now()`).
   - It marks `user.test.ts` as `frágil` due to date-boundary issues in CI (`BVA`).
3. **Reporting**: The agent formats the output.

### Expected Output

✅ Skill executed successfully. `TEST-AUDIT.md` generated.

```markdown
# 🐛 Auditoria de Qualidade de Teste — Precharge

> Gerado em **2026-07-13** por workflow multi-agente.

### Resumo Executivo
- **Domínios auditados**: 1/1
- **Testes efetivos**: 0
- **Testes frágeis + inconclusivos**: 2
- **Testes a remover**: 0

### Domínios por Risco Financeiro

| # | DOMÍNIO | RISCO | EFETIV. | STATUS |
|---|---|---|---|---|
| 1 | `precharge` | Tier 1 🔴 | 0% | VALIDADO |

---

### Detalhamento por Domínio

#### 🔵 precharge
`Risco: Tier 1` · `apis/precharge`

**Métricas**: 🔴 `2 frágeis` | 🟢 `0 efetivos` | 🟣 `0 inconclusivos` | ❌ `0 remover`

**Camadas sem cobertura**: Contrato — inexistente em todo o domínio. Nenhuma cobertura em middlewares de autenticação.

▼ **Relação dos testes auditados**

| TESTE | CAMADA | VEREDITO | AÇÃO | TÉCNICA | GAP |
|---|---|---|---|---|---|
| `helpers/precharge.test.ts:getSlugFromCtx > should return the slug...` | `unitário` | 🔴 `frágil` | 🛠️ `refatorar` | `EP` | **Problema**: O teste não roda e não cobre a borda de slug vazio. **Correção**: Renomear para `.spec.ts` para ser rodado em CI e testar caso em que o `slug` é string vazia esperando um throw. |
| `helpers/user.test.ts:isUserAboveAge > should return true...` | `unitário` | 🔴 `frágil` | 🛠️ `refatorar` | `BVA` | **Problema**: Não determinístico; usa a data real do sistema. **Correção**: Fixar o relógio global usando `jest.useFakeTimers()` e datas absolutas. |
```
