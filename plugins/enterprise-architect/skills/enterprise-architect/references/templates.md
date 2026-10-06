# Output Templates Reference

Structured templates for each output mode of the Enterprise Architect Agent.

---

## Template 1: Full Governance Report (Default)

Use for: general architectural analysis, initiative evaluation, RFC review.

```markdown
## 1. Contexto Arquitetural
<!-- Estado atual: sistemas envolvidos, tecnologias, topologia -->

## 2. Problema
<!-- Problema sistêmico real — não o sintoma -->

## 3. Análise Sistêmica
<!-- Coupling, cohesion, bounded contexts violados, resiliência, padrões afetados -->

## 4. Riscos
| Risco | Tipo | Severidade | Probabilidade |
|---|---|---|---|
| <risco> | técnico / operacional / compliance / organizacional | 🔴🟠🟡 | alta / média / baixa |

## 5. Trade-offs
| Opção | Ganhos | Custos |
|---|---|---|
| <opção A> | <benefícios> | <perdas> |
| <opção B> | <benefícios> | <perdas> |

## 6. Recomendação
<!-- Solução preferida com justificativa arquitetural clara -->
**Decisão**: <escolha>
**Justificativa**: <raciocínio baseado em princípios>
**Blast Radius**: <sistemas afetados, tempo de recuperação>

## 7. Impacto Organizacional
<!-- Equipes afetadas, mudanças de processo, custo operacional estimado -->

## 8. Governança
<!-- Padrões a adotar, ADRs a criar/atualizar, contratos a formalizar -->

## 9. Próximos Passos
| Ação | Responsável | Prazo | Dependência |
|---|---|---|---|
| <ação concreta> | <time/role> | <curto/médio/longo prazo> | <dependência> |
```

---

## Template 2: ADR (Architecture Decision Record)

Use for: formalizing architectural decisions after analysis.

```markdown
# ADR-XXX: <Título da Decisão>

**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-XXX
**Date**: YYYY-MM-DD
**Deciders**: <times/pessoas envolvidas>

## Context

<Por que essa decisão está sendo tomada agora? Qual é a pressão ou necessidade?>

## Decision

<O que foi decidido? Seja específico e direto.>

## Alternatives Considered

| Alternativa | Por que foi rejeitada |
|---|---|
| <alt 1> | <razão> |
| <alt 2> | <razão> |

## Consequences

**Positive**:
- <consequência positiva>

**Negative**:
- <consequência negativa ou custo aceito>

**Risks**:
- <risco residual>

## Compliance Notes

<Qualquer consideração de LGPD, SOC2, políticas corporativas>

## Review Date

<Data para revisão desta decisão — recomendado: 6 meses>
```

---

## Template 3: Anti-Pattern Report

Use for: audit results when multiple anti-patterns are found.

```markdown
# Relatório de Anti-Patterns — <Sistema/Contexto>

**Data**: YYYY-MM-DD
**Escopo analisado**: <sistemas, serviços, ou domínios avaliados>

## Sumário Executivo

<2-3 linhas sobre os achados principais e severidade geral>

## Anti-Patterns Identificados

### 🔴 Críticos (ação imediata requerida)

#### <Nome do Anti-Pattern>
- **Onde**: <serviço / módulo / componente>
- **Sintoma observado**: <evidência específica>
- **Blast Radius**: <sistemas afetados>
- **Remediação recomendada**: <ação concreta>
- **Esforço estimado**: <baixo / médio / alto>

### 🟠 Altos (planejar para próximo trimestre)

#### <Nome do Anti-Pattern>
...

### 🟡 Médios (backlog técnico)

#### <Nome do Anti-Pattern>
...

## Plano de Remediação

| Prioridade | Anti-Pattern | Ação | Time | Prazo |
|---|---|---|---|---|
| 1 | <nome> | <ação> | <time> | <prazo> |

## Próximos Passos

1. <ação imediata>
2. <ação de planejamento>
3. <ação de governança>
```

---

## Template 4: Service Decomposition Proposal

Use for: recommending how to break apart a monolith or large service.

```markdown
# Proposta de Decomposição — <Serviço/Monolito>

## Bounded Contexts Identificados

| Contexto | Responsabilidades | Time Sugerido | Dados Proprietários |
|---|---|---|---|
| <contexto 1> | <lista> | <time> | <entidades de dados> |

## Mapa de Dependências Atual

<Diagrama textual ou lista de dependências entre módulos>

## Slices de Migração (Strangler Fig)

### Fase 1 (Curto prazo — <X meses>)
- Extrair: <capacidade>
- Estratégia: <como isolar sem quebrar>
- Gate de validação: <critério de sucesso>

### Fase 2 (Médio prazo — <X meses>)
...

### Fase 3 (Longo prazo — <X meses>)
...

## Contratos de Evento

| Evento | Produtor | Consumidores | Schema | Garantias |
|---|---|---|---|---|
| <evento> | <serviço> | <lista> | <link/spec> | at-least-once / exactly-once |

## Riscos da Migração

| Risco | Mitigação | Rollback |
|---|---|---|
| <risco> | <estratégia> | <como reverter> |
```
