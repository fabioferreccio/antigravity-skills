# Architecture Anti-Patterns Reference

Catalog of recognized anti-patterns in enterprise systems. Each entry includes
symptoms, root causes, blast radius, and remediation strategy.

---

## Distributed Monolith

**Description**: Services are deployed independently but share state, databases,
or synchronous call chains that make independent operation impossible.

**Symptoms**:
- All services must be deployed together
- A single service failure cascades across the entire system
- Services share a database schema

**Blast Radius**: 🔴 Critical — entire system may fail together

**Remediation**:
- Introduce event-driven communication for cross-service state changes
- Migrate to per-service databases (database-per-service pattern)
- Implement circuit breakers at service boundaries

---

## Shared Database

**Description**: Multiple services read/write from the same database, creating
tight coupling at the data layer.

**Symptoms**:
- Schema changes require coordination across multiple teams
- One service can read or corrupt another service's data
- No clear data ownership

**Blast Radius**: 🔴 Critical — data corruption risk, deployment coupling

**Remediation**:
- Assign clear data ownership per service
- Migrate to database-per-service with eventual consistency
- Use events or APIs to share data across boundaries

---

## God Service / Mega-Service

**Description**: A single service owns too many responsibilities, becoming a
bottleneck for development, deployment, and scalability.

**Symptoms**:
- Service has > 5 distinct bounded contexts
- All teams must coordinate on the same deployment
- Single service receives > 50% of system traffic

**Blast Radius**: 🟠 High — performance and deployment bottleneck

**Remediation**:
- Identify bounded contexts within the service
- Extract capabilities into independent services incrementally
- Use strangler fig pattern for migration

---

## Synchronous Chain (Call Chain Anti-Pattern)

**Description**: Services are chained synchronously (A → B → C → D), creating
a failure cascade where any node failure breaks the entire chain.

**Symptoms**:
- End-to-end latency = sum of all service latencies
- One service timeout causes full chain failure
- Deep call stacks in distributed traces

**Blast Radius**: 🟠 High — latency multiplication, cascade failures

**Remediation**:
- Break chains with async events where consistency allows
- Introduce choreography over orchestration
- Add circuit breakers at each boundary

---

## Chatty Microservices

**Description**: Services make excessive inter-service calls for a single
user-facing operation, generating latency and network overhead.

**Symptoms**:
- A single API request triggers > 10 downstream calls
- High inter-service traffic in network topology
- Performance degrades under moderate load

**Blast Radius**: 🟡 Medium — latency and scalability impact

**Remediation**:
- Introduce aggregator pattern or BFF (Backend for Frontend)
- Cache frequently accessed data at appropriate layer
- Evaluate if some services should be merged

---

## Technology Zoo

**Description**: Excessive technology diversity without standardization creates
operational complexity, knowledge silos, and inconsistent observability.

**Symptoms**:
- > 3 different message brokers in use
- > 2 different database engines for the same use case
- No approved technology list

**Blast Radius**: 🟡 Medium — operational cost, hiring difficulty, security drift

**Remediation**:
- Publish and enforce an approved technology list
- Establish deprecation policy for non-standard technologies
- Create migration path to standardized alternatives

---

## Missing Event Schema Contract

**Description**: Events are produced and consumed without formal schema
definitions, creating implicit coupling and brittle integrations.

**Symptoms**:
- Breaking event changes not versioned
- No schema registry in use
- Consumer failures after producer-side changes

**Blast Radius**: 🟠 High — silent data corruption, cascading consumer failures

**Remediation**:
- Adopt a schema registry (Confluent Schema Registry, AWS Glue, etc.)
- Enforce schema versioning with backward/forward compatibility rules
- Treat event schemas as public API contracts

---

## SPOF (Single Point of Failure)

**Description**: A single component whose failure would cause the entire system
or a critical business capability to become unavailable.

**Symptoms**:
- No redundancy for a critical service
- No fallback or graceful degradation strategy
- Single availability zone deployment for critical components

**Blast Radius**: 🔴 Critical — complete outage risk

**Remediation**:
- Introduce redundancy (active-active or active-passive)
- Implement graceful degradation for non-critical dependencies
- Design for multi-AZ or multi-region where RTO requires it

---

## Circular Dependencies

**Description**: Two or more components depend on each other, preventing
independent deployment and creating coupling cycles.

**Symptoms**:
- Service A imports from Service B, and B imports from A
- Deployment of either service requires deploying both
- Tests for A require B to be running

**Blast Radius**: 🟠 High — deployment coupling, testing complexity

**Remediation**:
- Extract shared logic into a third, dependency-free module
- Introduce an abstraction layer (interface, event) to break the cycle
- Enforce dependency direction rules in CI (ArchUnit, Deptrac, etc.)
