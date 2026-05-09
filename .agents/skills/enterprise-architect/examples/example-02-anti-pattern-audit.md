# Example 02 — Anti-Pattern Audit: Distributed Monolith

## Scenario

A fintech company has 12 microservices that were extracted from a monolith
over 2 years. Engineering leadership suspects the architecture has problems
because deployments still require coordination across teams and incidents
always involve multiple services.

**User prompt**:
> "Identifica anti-patterns na nossa arquitetura. Temos 12 microsserviços mas
> ainda precisamos coordenar deploys e os incidentes sempre batem em vários
> serviços ao mesmo tempo."

---

## Context Provided (Input)

```
Services: payment-service, user-service, account-service, 
          notification-service, fraud-detection, reporting-service,
          api-gateway, auth-service, card-service, ledger-service,
          compliance-service, audit-service

Known facts:
- payment-service, account-service, and ledger-service share the same PostgreSQL database
- Deployments of payment-service require deploying account-service first
- fraud-detection calls payment-service synchronously during transaction processing
- All services log to different formats (some JSON, some plaintext)
- reporting-service reads directly from ledger-service's database
```

---

## Agent Output

## 1. Contexto Arquitetural

12 serviços extraídos de um monolito. Sintomas de coupling estrutural:
deploys coordenados e incidentes com blast radius amplo sugerem que o
monolito foi particionado por camada técnica, não por domínio.

## 2. Problema

A arquitetura atual é um **Distributed Monolith** — os serviços são
deployados separadamente, mas operam com dependências tão rígidas que
perdemos os benefícios da decomposição sem eliminar os custos.

## 3. Análise Sistêmica

**Anti-patterns identificados**:

🔴 **Shared Database**: payment, account e ledger compartilham o mesmo
PostgreSQL. Mudança de schema afeta 3 equipes simultaneamente. Violação
crítica de bounded context.

🔴 **Deployment Coupling**: payment-service exige deploy prévio de
account-service. Independência de deploy — principal benefício de
microsserviços — está perdida.

🔴 **Synchronous Call Chain Crítica**: fraud-detection → payment-service
no caminho crítico de transação. Latência de fraud-detection afeta
diretamente o tempo de resposta de pagamento.

🟠 **Cross-Domain Database Access**: reporting-service lê diretamente
do banco do ledger-service. Violação de domain boundary.

🟡 **Observabilidade Inconsistente**: logs em formatos diferentes
(JSON vs plaintext) impedem correlação de traces em incidentes.

## 4. Riscos

| Risco | Tipo | Severidade | Probabilidade |
|---|---|---|---|
| Falha no PostgreSQL compartilhado → 3 serviços caem | Operacional | 🔴 Crítico | Média |
| fraud-detection lento → pagamentos lentos | Técnico | 🔴 Crítico | Alta |
| Schema change em ledger quebra reporting | Técnico | 🟠 Alto | Alta |
| Incidentes impossíveis de triage sem traces correlacionados | Operacional | 🟠 Alto | Alta |

## 5. Trade-offs

| Opção | Ganhos | Custos |
|---|---|---|
| Manter estado atual | Zero esforço imediato | Risco operacional crescente, tech debt acumulando |
| Separar databases (database-per-service) | Independência real, blast radius reduzido | 3-6 meses de migração, eventual consistency |
| Introduzir async para fraud-detection | Latência de pagamento desacopla de fraud | Complexidade de saga, consistência eventual |

## 6. Recomendação

**Fase 1 (imediato)**: Padronizar observabilidade — logs JSON + trace IDs
correlacionados em todos os serviços. Unblock: triage de incidentes.

**Fase 2 (30-60 dias)**: Tornar fraud-detection assíncrono via evento de
transação com decisão de fraud publicada de volta. Elimina synchronous chain.

**Fase 3 (60-180 dias)**: Database-per-service para payment, account e ledger.
Usar strangler fig — migrar uma entidade por vez com dual-write.

**Fase 4 (180+ dias)**: reporting-service migra para consumir eventos de
ledger ao invés de acessar banco diretamente.

**Blast Radius fase 3**: 🔴 Crítico — requer feature flags, rollback
automatizado por fase, e dry-run em staging por 2 semanas antes de produção.

## 7. Impacto Organizacional

- Times de payment, account e ledger precisam de ownership claro de dados
- SRE precisa implementar traces distribuídos (OpenTelemetry) antes de Fase 2
- Modelo de dados eventualmente consistente requer mudança cultural nas equipes

## 8. Governança

- Criar ADR-XXX: Database-per-service como padrão obrigatório
- Criar ADR-XXX: Async-first para chamadas no caminho crítico
- Publicar: Política de Observabilidade (formato de log, trace IDs, dashboards obrigatórios)
- Adicionar ao Definition of Done: "serviço tem dashboard + trace + alertas"

## 9. Próximos Passos

| Ação | Responsável | Prazo | Dependência |
|---|---|---|---|
| Implementar OpenTelemetry em todos os serviços | SRE | 2 semanas | — |
| Padronizar logs para JSON com trace_id | Todos os times | 2 semanas | — |
| Design async de fraud-detection | Arquitetura + Fraud team | 3 semanas | ADR aprovado |
| Iniciar migração database ledger (Fase 3) | Ledger team + Arquitetura | 60 dias | Fase 2 validada |
