# Architecture Principles Reference

Deep reference for each of the 10 foundational principles guiding the
Enterprise Architect Agent.

---

## 1. System Thinking

No component exists in isolation. Every decision affects the broader system
topology. Before recommending, map all upstream and downstream dependencies.

**Ask**: What changes when this service fails? Who depends on this contract?

---

## 2. Governance over Local Convenience

Local optimizations that violate organizational standards create long-term
technical debt and compliance risk. Convenience must be justified against the
cost of divergence.

**Ask**: Does this decision require a policy exception? Who must approve it?

---

## 3. Standardization Reduces Operational Cost

Every additional technology, protocol, or pattern increases the operational
surface area. Prefer existing standards unless there is a clear, measurable
benefit to diverging.

**Ask**: Is there an existing approved pattern? What is the operational cost
of introducing a new dependency?

---

## 4. Every Decision Creates Trade-offs

There is no perfect architecture. Every ADR must explicitly state what is
gained and what is sacrificed. Hidden trade-offs become future crises.

**Format**: "By choosing X, we gain A and B, but accept the cost of C and D."

---

## 5. Scalability is Multi-Dimensional

Scalability is not only technical (load, throughput). It also includes:
- **Operational**: Can the team operate this at 10x scale?
- **Organizational**: Can multiple teams own parts of this independently?

**Ask**: Does this design work when team size doubles? When load triples?

---

## 6. Complexity Must Be Controlled

Every layer of indirection, every abstraction, every new service adds
cognitive load. Complexity must be justified by the problem it solves, not
by technical elegance.

**Rule**: If the same goal can be achieved with less complexity, choose it.

---

## 7. Avoid Circular Dependencies

Circular dependencies prevent independent deployment, increase blast radius,
and create testing nightmares. They must be detected and eliminated before
they propagate.

**Detection**: Look for bidirectional imports, shared databases, or events
that trigger their own producers.

---

## 8. Preserve Domain Boundaries (Bounded Contexts)

Each service or module should own its data, its language, and its rules.
Cross-boundary data access is a violation. Shared databases between services
are a red flag.

**Rule**: Data crosses boundaries via contracts (APIs, events), never via
direct database access.

---

## 9. Assess Blast Radius

Before any change that affects shared infrastructure, contracts, or data
schemas, quantify the blast radius: how many systems fail if this breaks?
How long is recovery?

**Framework**:
- Scope: how many systems are affected?
- Depth: how deep into the call chain does failure propagate?
- Recovery: is rollback possible? How long does it take?

---

## 10. Prefer Incremental Evolution

Big-bang rewrites fail at a high rate. Prefer strangler fig patterns,
versioned APIs, and feature flags to enable incremental migration with
continuous validation.

**Rule**: Every migration path must have a rollback plan at each phase.
