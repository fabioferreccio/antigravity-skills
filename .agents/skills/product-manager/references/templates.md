# Document Templates Reference

All templates below are in PT-BR by default (as configured in SKILL.md language rules).

---

## PRD (Product Requirements Document)

```markdown
# PRD: [Nome da Iniciativa]

**Autor**: [nome]
**Data**: [data]
**Status**: Rascunho | Em Revisão | Aprovado | Rejeitado
**Prioridade**: [RICE score] | [WSJF score]

---

## 1. Contexto
[Situação atual. Dados que motivam a iniciativa.]

## 2. Problema
[Dor real do usuário. Evidências: NPS, tickets, churn, analytics.]

## 3. Hipótese
> Se implementarmos [solução], esperamos [resultado mensurável],
> medido por [métrica primária], em [período].

## 4. Escopo

### Incluído (MVP)
- [ ] Funcionalidade 1
- [ ] Funcionalidade 2

### Explicitamente Excluído
- Item fora do escopo 1
- Item fora do escopo 2

## 5. Métricas de Sucesso

| Métrica | Baseline | Meta | Prazo |
|---------|----------|------|-------|
| [KPI 1] | [atual]  | [meta] | [quando] |
| [KPI 2] | [atual]  | [meta] | [quando] |

## 6. Experiência do Usuário
[Fluxo do usuário. User stories principais.]

## 7. Requisitos Técnicos
[APIs, integrações, dependências de infra.]

## 8. Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| [risco 1] | Alta/Média/Baixa | Alto/Médio/Baixo | [ação] |

## 9. Plano de Rollback
[O que fazer se a métrica de sucesso não for atingida.]

## 10. Cronograma

| Fase | Início | Fim | Responsável |
|------|--------|-----|-------------|
| Discovery | [data] | [data] | [nome] |
| Desenvolvimento | [data] | [data] | [nome] |
| QA | [data] | [data] | [nome] |
| Lançamento | [data] | [data] | [nome] |

## 11. Custo de Manutenção
[Estimativa de esforço contínuo pós-lançamento: monitoramento, suporte, evolução.]

## 12. Dependências
[Equipes, serviços, dados, aprovações necessárias.]
```

---

## User Story

```markdown
### US-[ID]: [Título]

**Como** [persona],
**Quero** [ação/funcionalidade],
**Para** [benefício/valor].

**Critérios de Aceite:**
- [ ] [critério verificável 1]
- [ ] [critério verificável 2]
- [ ] [critério verificável 3]

**Cenários de Borda:**
- [cenário atípico 1]: [comportamento esperado]
- [cenário atípico 2]: [comportamento esperado]

**Métricas**: [KPI que esta story impacta]
**Esforço**: [P/M/G ou story points]
**Dependências**: [outras stories, APIs, dados]
```

---

## ADR (Architecture Decision Record)

```markdown
# ADR-[ID]: [Título da Decisão]

**Data**: [data]
**Status**: Proposto | Aceito | Rejeitado | Substituído por ADR-[XX]

## Contexto
[Que situação motivou esta decisão?]

## Decisão
[O que foi decidido e por quê.]

## Alternativas Consideradas

| Alternativa | Prós | Contras | Custo |
|-------------|------|---------|-------|
| [opção A] | [vantagens] | [desvantagens] | [esforço] |
| [opção B] | [vantagens] | [desvantagens] | [esforço] |

## Consequências
- **Positivas**: [benefícios esperados]
- **Negativas**: [trade-offs aceitos]
- **Riscos**: [o que pode dar errado]

## Métricas de Validação
[Como saberemos se a decisão foi correta.]
```

---

## Epic Breakdown

```markdown
# Épico: [Nome]

## Visão Geral
[Objetivo do épico em 2-3 frases.]

## Slices (MVP → Completo)

### Slice 1: [nome] — MVP
- US-001: [título]
- US-002: [título]
**Valor entregue**: [o que o usuário já consegue fazer]

### Slice 2: [nome] — Melhoria
- US-003: [título]
- US-004: [título]
**Valor entregue**: [incremento de valor]

### Slice 3: [nome] — Polimento
- US-005: [título]
**Valor entregue**: [refinamento final]

## Mapa de Dependências
[Quais slices dependem de quais. Pode ser texto ou diagrama.]

## Matriz de Risco por Slice

| Slice | Risco Técnico | Risco de Negócio | Esforço |
|-------|---------------|-------------------|---------|
| 1 | Baixo | Baixo | 2 sprints |
| 2 | Médio | Baixo | 1 sprint |
| 3 | Baixo | Baixo | 1 sprint |
```

---

## A/B Experiment Spec

```markdown
# Experimento: [Nome]

## Hipótese
> Se [mudança], então [resultado], medido por [métrica].

## Variantes
- **Controle (A)**: [experiência atual]
- **Tratamento (B)**: [mudança proposta]

## Métricas

| Tipo | Métrica | Mudança Mínima Detectável |
|------|---------|---------------------------|
| Primária | [métrica] | [X%] |
| Guardrail | [métrica] | [não deve cair mais que Y%] |

## Segmentação
[Quem participa: % de tráfego, cohort, região.]

## Duração
[Tempo mínimo para significância estatística.]

## Critério de Sucesso
[Quando declaramos vencedor.]

## Plano de Rollback
[O que acontece se guardrail metrics forem violadas.]
```

---

## Backlog Prioritization Table

```markdown
# Priorização de Backlog — [Sprint/Trimestre]

| # | Item | RICE | WSJF | Kano | Recomendação |
|---|------|------|------|------|-------------|
| 1 | [item] | [score] | [score] | [categoria] | ✅ Go |
| 2 | [item] | [score] | [score] | [categoria] | ✅ Go |
| 3 | [item] | [score] | [score] | [categoria] | 🔍 Investigar |
| 4 | [item] | [score] | [score] | [categoria] | ❌ No-Go |

## Justificativas
- **Item 1**: [por que é prioridade]
- **Item 4**: [por que foi rejeitado]
```
