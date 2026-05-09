# Test Suite — enterprise-architect

## Evaluation Criteria

Each test is evaluated against 5 dimensions:
- **Completeness**: All 9 output sections present
- **Accuracy**: Anti-patterns and recommendations are architecturally sound
- **Precision**: No false positives (correct triggers, no unrelated activation)
- **Trade-off Awareness**: Every recommendation includes trade-offs
- **Governance**: ADR or policy recommendation included where relevant

---

## Valid Activation Tests (10 prompts)

### T-001: ADR Review
**Prompt**: "Revisa esse ADR onde decidimos usar GraphQL para todos os endpoints internos"
**Expected**: 9-section analysis, trade-off table, alternatives suggested, governance recommendation
**Pass criteria**: blast radius assessed, alternatives to GraphQL for internal APIs mentioned

### T-002: Topology Analysis
**Prompt**: "Analisa essa arquitetura: temos um API Gateway que chama 8 serviços síncronos em cadeia para renderizar a home do app"
**Expected**: Synchronous chain anti-pattern identified, async/BFF alternatives proposed
**Pass criteria**: latency multiplication risk quantified, BFF or aggregator recommended

### T-003: Bounded Context Validation
**Prompt**: "O nosso user-service também cuida de autenticação, autorização, perfil e preferências. Isso está certo?"
**Expected**: Low cohesion detected, bounded context split recommended
**Pass criteria**: At least 3 distinct contexts identified, split roadmap proposed

### T-004: Anti-Pattern Audit
**Prompt**: "Identificar anti-patterns em microsserviços onde 5 serviços compartilham o mesmo banco Postgres"
**Expected**: Shared database anti-pattern, database-per-service recommendation
**Pass criteria**: blast radius for DB failure assessed, migration phases proposed

### T-005: Event Design
**Prompt**: "Precisamos que quando um pagamento é aprovado, o sistema de fraude, o de notificação e o de auditoria sejam acionados"
**Expected**: Event-driven design with OrderApproved event, consumer topology, DLQ recommendation
**Pass criteria**: schema contract proposed, ordering guarantees addressed

### T-006: Service Decomposition
**Prompt**: "Nosso monolito Rails tem módulos de billing, shipping, inventory e catalog. Como decompor?"
**Expected**: 4 bounded contexts identified, strangler fig phases, dependency graph
**Pass criteria**: migration phases with validation gates, blast radius per phase

### T-007: Technology Lock-in Assessment
**Prompt**: "Queremos usar DynamoDB para todos os nossos serviços para simplificar"
**Expected**: Lock-in risk identified, abstraction layer recommended, exit strategy
**Pass criteria**: ADR creation recommended, evaluation checkpoint defined

### T-008: Observability Governance
**Prompt**: "Cada time usa um formato de log diferente e não temos traces distribuídos. Qual o impacto?"
**Expected**: Observability anti-pattern, standardization proposal, policy recommendation
**Pass criteria**: Operational impact of inconsistency quantified, OpenTelemetry or equivalent suggested

### T-009: SPOF Detection
**Prompt**: "Nosso serviço de autenticação não tem redundância e fica em uma única AZ"
**Expected**: SPOF classification, multi-AZ proposal, blast radius critical
**Pass criteria**: RTO impact quantified, redundancy options compared

### T-010: Circular Dependency Detection
**Prompt**: "O payment-service chama o account-service que chama de volta o payment-service para validar limites"
**Expected**: Circular dependency anti-pattern, extraction of shared logic recommended
**Pass criteria**: dependency cycle broken by introducing third component or event

---

## Misuse / Rejection Tests (3 prompts)

### M-001: UI Design Request
**Prompt**: "Como eu deveria organizar a interface do dashboard para mostrar métricas?"
**Expected behavior**: Agent should recognize this as UI/UX, not architecture — redirect to appropriate skill or clarify scope
**Pass criteria**: No architectural output produced for a pure UI question

### M-002: Code-Level Implementation
**Prompt**: "Como implemento o design pattern Strategy em Python?"
**Expected behavior**: This is a code-level question, not enterprise architecture — agent clarifies scope
**Pass criteria**: Agent redirects or asks for architectural context before proceeding

### M-003: Business Strategy Without Architecture Context
**Prompt**: "Devemos expandir para o mercado europeu?"
**Expected behavior**: This is a business decision, not architectural — agent asks for architectural implications to evaluate
**Pass criteria**: Agent asks what architectural constraints or decisions are involved before proceeding

---

## Edge Cases (3 prompts)

### E-001: Conflicting ADRs
**Prompt**: "O ADR-003 diz para usar REST e o ADR-007 diz para usar gRPC. Qual seguir?"
**Expected**: Conflict identification, context analysis to determine which applies, recommendation to supersede one ADR
**Pass criteria**: Both ADRs analyzed, governance escalation recommended, supersede action suggested

### E-002: Insufficient Context
**Prompt**: "Revisa nossa arquitetura"
**Expected**: Escalation protocol — agent lists what artifacts are needed
**Pass criteria**: Agent does NOT generate a generic analysis; stops and asks for specific artifacts

### E-003: Proposal That Increases Coupling
**Prompt**: "Queremos criar uma shared library com a lógica de negócio de todos os domínios para reutilizar entre serviços"
**Expected**: Domain logic in shared library anti-pattern identified, alternatives (events, published language) proposed
**Pass criteria**: Coupling increase quantified, governance decision recommended, alternative patterns provided

---

## Scoring Rubric

| Score | Criteria |
|---|---|
| 5/5 | All 9 sections present, trade-offs explicit, blast radius assessed, governance included |
| 4/5 | 8+ sections present, minor trade-off gap |
| 3/5 | Core analysis correct but missing governance or blast radius |
| 2/5 | Partial analysis, major sections missing |
| 1/5 | Generic response, no architectural rigor |
| 0/5 | Wrong activation or no output |

**Minimum acceptable score**: 4/5 for valid tests, correct rejection/escalation for misuse/edge cases.
