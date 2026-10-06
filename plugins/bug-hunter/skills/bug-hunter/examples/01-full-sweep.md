# Example: Full Sweep

This example demonstrates how the `bug-hunter` skill behaves when asked to scan a project for concrete bugs.

### Input
```
User request: "faça um workflow amplo para identificar bugs de incorretudes e possíveis problemas concretos por todo o projeto. colete tudo e coloque em um markdown de bugs para eu resolver depois."
```

### Agent Process

1. **Mapping**: The agent maps the `./src` directory and finds `payment.service.ts` and `pix.service.ts`.
2. **Hunting**: The agent reads the files.
   - Finds a potential race condition in `payment.service.ts` where a check `if (amount > 0)` is followed by a DB write without a lock.
   - Finds a null-safety issue in `pix.service.ts` where `request.user.id` is accessed without `?`.
3. **Adversarial Verification**:
   - The agent invokes the `qa-engineer` sub-agent with the snippet from `payment.service.ts`. The sub-agent confirms the race condition because there is no distributed lock or DB `SELECT FOR UPDATE`.
   - The agent invokes the sub-agent with the snippet from `pix.service.ts`. The sub-agent refutes the bug, noting that an upstream middleware guarantees `request.user` is never null.
4. **Reporting**: The agent compiles the results into a `BUGS.md` file, omitting the refuted null-safety issue.

### Expected Output

✅ Skill executed successfully. `BUGS.md` generated.

```markdown
# 🐛 Relatório de Bugs — MyProject

> Gerado em **2026-07-04** por workflow multi-agente de caça a bugs de corretude. Escopo: bugs de incorretude e problemas concretos.

## Cobertura — varredura completa

| Área | Status |
|---|---|
| src/services/ | ✅ verificação adversarial |

**Totais: 1 bugs reais confirmados** (1 por verificação adversarial + 0 por leitura direta) · 1 refutados.

---

## ✅ Confirmados por verificação adversarial (1)

### 1. Pagamento concorrente falha por falta de transação/lock no check-then-act

- **Local:** `src/services/payment.service.ts:45`
- **Severidade:** 🔴 Alta
- **Categoria:** race-condition

**Descrição:** O método `refundPayment` checa se o saldo é maior que zero e então cria a transação de estorno, tudo fora de um block transacional ou lock distribuído. 

**Cenário de falha:** Dois estornos simultâneos passam pela checagem de saldo antes que o primeiro commit, resultando em estorno duplo.

```ts
if (refundData.availableForRefund === 0) throw Error();
// ... sem lock:
await repository.create(refundObject);
```

**Correção sugerida:** Utilizar `$transaction` com `SELECT FOR UPDATE` ou um lock distribuído no Redis (com chave sendo o ID da transação original) envolvendo a leitura e a criação.

- [ ] Resolvido
```
