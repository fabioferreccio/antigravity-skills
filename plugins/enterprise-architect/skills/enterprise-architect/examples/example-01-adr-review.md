# Example 01 — ADR Review: Kafka for All Events

## Scenario

A company has decided to use Apache Kafka as the message broker for
**all inter-service communication** across their microservices platform.
An initial ADR was drafted but not fully evaluated.

**User prompt**:
> "Revisa esse ADR. Decidimos usar Kafka para todos os eventos da plataforma."

---

## ADR Provided (Input)

```
ADR-007: Kafka como Broker Universal

Status: Proposed
Date: 2026-04-01

Context:
Precisamos de uma solução de mensageria para comunicação entre serviços.

Decision:
Usar Apache Kafka para todos os eventos da plataforma.

Consequences:
- Alta throughput
- Persistência de eventos
```

---

## Agent Output

### 🔍 OBSERVAÇÃO

**Artefato analisado**: ADR-007 (Apache Kafka como broker universal)  
**Sinais extraídos**:
- Escopo: 100% dos eventos da plataforma
- Alternativas consideradas: não documentadas
- Consequências: incompletas — apenas benefícios listados
- Status: Proposed — ainda não vinculante

**Red flags imediatos**:
- ADR sem alternativas documentadas
- Sem análise de trade-offs ou custos negativos
- Escopo "universal" sem justificativa de necessidade

---

## 1. Contexto Arquitetural

A decisão proposta visa padronizar toda comunicação assíncrona da plataforma
em Apache Kafka. O ADR foi redigido sem análise de alternativas e sem
documentação de consequências negativas.

## 2. Problema

O ADR não avalia se Kafka é a solução adequada para **todos** os casos de
uso — alguns padrões de comunicação (ex: request/reply com baixa latência,
eventos simples com baixo volume) podem ser melhor servidos por alternativas
mais simples.

## 3. Análise Sistêmica

**Coupling introduzido**:
- Todos os serviços passam a depender de uma infraestrutura centralizada
- Kafka se torna um SPOF de mensageria — sua indisponibilidade afeta toda a plataforma

**Complexidade operacional**:
- Kafka requer gestão de brokers, partições, replication factors, consumer groups
- Curva de aprendizado significativa para debugging de consumer lag e offset management

**Lock-in risk**:
- Kafka tem semântica própria (offsets, partitions) que vaza para o código dos consumidores
- Migração futura requer reescrita de todos os consumers

## 4. Riscos

| Risco | Tipo | Severidade | Probabilidade |
|---|---|---|---|
| Kafka indisponível → 100% dos serviços afetados | Operacional | 🔴 Crítico | Média |
| Equipes sem experiência com Kafka introduzem consumer bugs | Técnico | 🟠 Alto | Alta |
| Casos de uso simples over-engineered com Kafka | Técnico | 🟡 Médio | Alta |
| Lock-in sem abstraction layer | Estratégico | 🟠 Alto | Alta |

## 5. Trade-offs

| Opção | Ganhos | Custos |
|---|---|---|
| Kafka universal | Throughput alto, event replay, auditoria | Complexidade operacional, lock-in, SPOF |
| Kafka + alternativa leve (SQS/RabbitMQ) | Cada caso no broker adequado | Dois brokers para operar, inconsistência |
| Kafka + abstraction layer | Desacopla código do broker | Custo de implementação, overhead |

## 6. Recomendação

✅ **Usar Kafka** para eventos de alta throughput e casos que precisam de replay.  
⚠️ **Não universalizar** — adotar política de escolha de broker por caso de uso.  
✅ **Introduzir abstraction layer** (interface de mensageria) para desacoplar código dos consumidores do broker específico.  

**Blast Radius**: Crítico — toda a plataforma depende do Kafka. Exige multi-AZ deployment e runbook de failover documentado.

## 7. Impacto Organizacional

- Todos os times precisam de treinamento em Kafka antes de migrar
- Time de plataforma/SRE precisa de expertise em Kafka ops
- Custo de infraestrutura aumenta (cluster Kafka vs. managed queues simples)

## 8. Governança

- ADR-007 deve ser **revisado** para incluir: alternativas consideradas, critérios de escolha de broker, abstraction layer decision
- Criar ADR-008 para a abstraction layer de mensageria
- Publicar **Technology Policy**: quando usar Kafka vs. quando usar alternativa mais simples

## 9. Próximos Passos

| Ação | Responsável | Prazo | Dependência |
|---|---|---|---|
| Revisar ADR-007 com seção de alternativas | Arquitetura | 1 semana | — |
| Definir critérios de seleção de broker | Arquitetura + SRE | 2 semanas | ADR-007 revisado |
| Design da abstraction layer de mensageria | Time de plataforma | 1 mês | ADR-008 |
| Plano de capacitação Kafka | Engineering Managers | 1 mês | ADR-007 aceito |
