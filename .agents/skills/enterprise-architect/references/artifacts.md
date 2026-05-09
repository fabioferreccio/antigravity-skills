# Artifacts Reference

Catalog of artifact types that the Enterprise Architect Agent can analyze as
input. For each type, the agent extracts specific signals to drive analysis.

---

## C4 Model (Context, Container, Component, Code)

**Signals extracted**:
- System context: external actors, dependent systems
- Container topology: services, databases, message brokers
- Component ownership: team boundaries, shared components
- Data flows: synchronous vs. asynchronous, protocol types

**Red flags**:
- Containers sharing a database
- Bidirectional dependencies between containers
- Single container receiving traffic from all others (hub pattern)

---

## Architecture Decision Records (ADRs)

**Signals extracted**:
- Decision: what was chosen and why
- Alternatives: what was rejected and why
- Consequences: known trade-offs and accepted costs
- Status: proposed / accepted / deprecated / superseded

**Red flags**:
- ADRs with no listed alternatives (decision was not evaluated)
- ADRs with no consequences section (trade-offs are hidden)
- Superseded ADRs still referenced as active

---

## API Contracts (OpenAPI, AsyncAPI, GraphQL Schema)

**Signals extracted**:
- Breaking vs. non-breaking changes
- Consumer dependency graph
- Versioning strategy
- Error handling and retry semantics

**Red flags**:
- No versioning strategy
- Internal implementation details exposed in public APIs
- Consumers not listed (unknown blast radius)

---

## Event Catalogs (Kafka topics, SNS/SQS queues, event buses)

**Signals extracted**:
- Producer-consumer topology
- Event schema versioning
- Ordering guarantees
- Dead-letter queue strategy

**Red flags**:
- Events with multiple producers (ownership conflict)
- No schema registry or schema enforcement
- Missing DLQ (silent failure risk)

---

## CI/CD Pipelines

**Signals extracted**:
- Deployment dependencies between services
- Shared build artifacts
- Environment promotion gates
- Rollback automation

**Red flags**:
- Services that cannot be deployed independently
- No automated rollback capability
- Shared mutable artifacts between pipelines

---

## Dependency Graphs (package.json, pom.xml, go.mod, etc.)

**Signals extracted**:
- Direct vs. transitive dependencies
- Circular imports
- Shared libraries with multiple consumers
- Version divergence across services

**Red flags**:
- Circular module dependencies
- Domain logic in shared infrastructure libraries
- Multiple services on different major versions of the same dependency

---

## Observability Configuration (dashboards, alerts, traces)

**Signals extracted**:
- Coverage: which services have dashboards?
- Consistency: same metrics/labels across services?
- Alerting: are SLOs defined? Are there runbooks?

**Red flags**:
- Services with no traces or logs
- Inconsistent metric naming across teams
- Alerts without runbooks

---

## Corporate Policies and Compliance Documents

**Signals extracted**:
- Data residency requirements
- Approved technology list
- Security standards (encryption, auth protocols)
- Regulatory constraints (LGPD, GDPR, SOC2, etc.)

**Red flags**:
- Architecture decisions that bypass policy without exception approval
- PII data flowing through unapproved systems
- Missing data lineage for regulated data
