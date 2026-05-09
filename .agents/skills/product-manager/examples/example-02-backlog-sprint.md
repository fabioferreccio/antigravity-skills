# Example 2: Backlog Sprint — Priorização de Múltiplos Itens

## User Input

```
Preciso priorizar esses 5 itens para o próximo sprint:

1. Corrigir bug de timeout na tela de pagamento (afeta ~5% das transações)
2. Adicionar dark mode ao app mobile
3. Integração com API do banco XYZ para PIX automático
4. Refatorar módulo de notificações (código legado, 3 incidentes/mês)
5. Dashboard de métricas para o time comercial
```

## Expected Skill Output

```markdown
## 1. Contexto
5 itens candidatos ao próximo sprint. Mix de bug fix, feature, integração,
refactoring e tooling interno. Necessário priorizar por impacto real.

## 2. Análise por Item

### Item 1: Bug de Timeout no Pagamento
- **Tipo**: Bug / Must-Be (Kano)
- **Problema real**: 5% de transações falhando = perda direta de receita
- **RICE**: Reach=alto × Impact=3 × Confidence=0.9 / Effort=0.5 = **MUITO ALTO**
- **Recomendação**: 🔴 URGENTE — resolver primeiro

### Item 2: Dark Mode Mobile
- **Tipo**: Feature / Attractive (Kano)
- **Problema real**: Preferência estética, baixo impacto em retenção
- **RICE**: Reach=médio × Impact=0.5 × Confidence=0.5 / Effort=1 = **BAIXO**
- **Recomendação**: ⏸️ BACKLOG — não priorizar agora

### Item 3: Integração PIX Automático
- **Tipo**: Feature / Performance (Kano)
- **Problema real**: Reduz fricção no fluxo de pagamento, pode aumentar conversão
- **RICE**: Reach=alto × Impact=2 × Confidence=0.7 / Effort=2 = **MÉDIO-ALTO**
- **Recomendação**: ✅ GO no sprint, após o bug fix

### Item 4: Refatorar Notificações
- **Tipo**: Tech Debt / Must-Be (Kano)
- **Problema real**: 3 incidentes/mês = custo operacional + risco de indisponibilidade
- **RICE**: Reach=interno × Impact=2 × Confidence=0.8 / Effort=1.5 = **MÉDIO**
- **WSJF**: Time Criticality alta (incidentes crescentes)
- **Recomendação**: ✅ GO — combinar com bug fix para reduzir risco sistêmico

### Item 5: Dashboard Comercial
- **Tipo**: Tooling Interno / Performance (Kano)
- **Problema real**: Time comercial opera sem visibilidade, decisões por intuição
- **RICE**: Reach=baixo (time interno) × Impact=1 × Confidence=0.6 / Effort=2 = **BAIXO**
- **Recomendação**: 🔍 INVESTIGAR — qual decisão específica precisa desse dado?

## 3. Priorização Final

| # | Item | RICE | Kano | Veredicto |
|---|------|------|------|-----------|
| 1 | Bug timeout pagamento | 🔴 Muito Alto | Must-Be | ✅ Sprint atual |
| 2 | Refatorar notificações | 🟡 Médio | Must-Be | ✅ Sprint atual |
| 3 | Integração PIX | 🟢 Médio-Alto | Performance | ✅ Sprint atual |
| 4 | Dashboard comercial | ⚪ Baixo | Performance | 🔍 Investigar mais |
| 5 | Dark mode | ⚪ Baixo | Attractive | ⏸️ Backlog |

## 4. Próximos Passos
1. Bug fix de timeout → começar imediatamente
2. Refactoring notificações → parear com o bug fix
3. Spike técnico para integração PIX → estimar melhor
4. Dashboard: agendar discovery com time comercial antes de comprometer
5. Dark mode: revisitar no Q3 se NPS indicar demanda
```

## Why This Works

- Doesn't just rank — explains WHY each item has that priority
- Uses multiple frameworks (RICE + Kano) for cross-validation
- Rejects items without impact data (dark mode, dashboard)
- Groups related work (bug fix + refactoring)
- Suggests investigation instead of blind commitment for uncertain items
