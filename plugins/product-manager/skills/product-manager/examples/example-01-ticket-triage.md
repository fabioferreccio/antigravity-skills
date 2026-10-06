# Example 1: Ticket Triage — Avaliação de Feature Request

## User Input

```
Recebi esse ticket do time de suporte:

"Clientes estão pedindo exportação de relatórios em PDF.
Já temos 47 tickets abertos sobre isso nos últimos 3 meses.
O NPS caiu de 42 para 38 nesse período.
Nossos 3 maiores clientes enterprise mencionaram isso como blocker para renovação."
```

## Expected Skill Output

```markdown
## 1. Contexto
47 tickets de suporte nos últimos 3 meses solicitando exportação PDF.
NPS caiu 4 pontos (42→38). 3 clientes enterprise citam como blocker de renovação.

## 2. Problema
Usuários enterprise não conseguem gerar relatórios em formato distribuível
para stakeholders internos, impedindo adoção institucional da ferramenta.

## 3. Hipótese
Se implementarmos exportação PDF dos relatórios principais,
esperamos recuperar NPS para ≥40 e reter os 3 clientes enterprise,
medido por NPS mensal e taxa de renovação enterprise no próximo trimestre.

## 4. Impacto Esperado
- Retenção de ~R$360K ARR (3 contas enterprise)
- Redução de 47+ tickets/trimestre no suporte (-15% volume)
- NPS recovery: +4 pontos estimados

## 5. Métricas
| Métrica | Baseline | Meta | Prazo |
|---------|----------|------|-------|
| NPS | 38 | ≥40 | 90 dias |
| Tickets exportação | 47/trim | <5/trim | 60 dias |
| Renovação enterprise | Em risco | 100% | Próximo ciclo |
| Uso do PDF export | 0 | >30% dos relatórios | 90 dias |

## 6. Riscos
- **Técnico**: Geração de PDF com gráficos pode ser complexa (libs de rendering)
- **Operacional**: Aumento de carga em servidor para geração assíncrona
- **Negócio**: Clientes podem esperar customização avançada do PDF

## 7. Dependências
- Biblioteca de PDF rendering (wkhtmltopdf / Puppeteer / similar)
- Fila de processamento assíncrono para relatórios pesados
- Design: template visual do PDF

## 8. Prioridade
RICE: Reach=150 × Impact=3 × Confidence=0.9 / Effort=2 = **202.5** (ALTA)
Kano: **Must-Be** (ausência causa frustração ativa)

## 9. Recomendação
✅ **GO** — Alta prioridade. MVP com 3 relatórios mais usados.

## 10. Próximos Passos
1. Definir os 3 relatórios mais exportados (analytics) — PM, esta semana
2. Spike técnico: lib de PDF + estimativa — Eng, 2 dias
3. Design do template PDF — UX, 3 dias
4. Desenvolvimento MVP — Eng, 1 sprint
5. Beta com os 3 clientes enterprise — PM + CS, semana seguinte
```

## Why This Works

- Separates symptom (47 tickets) from root cause (can't distribute reports)
- Quantifies financial impact (R$360K ARR at risk)
- RICE + Kano cross-validation strengthens the recommendation
- MVP scope explicitly limited to 3 reports (scope control)
- Includes rollback (beta with specific clients first)
