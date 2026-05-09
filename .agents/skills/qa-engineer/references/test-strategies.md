# Test Strategy Selection Guide

## Decision Matrix

Use this guide to select the right test strategy for any scenario.

---

## Layer Definitions

| Layer       | Scope                              | Speed    | Isolation        | Cost   |
|-------------|-------------------------------------|----------|------------------|--------|
| Unit        | Single function or class            | Fastest  | Full (all mocked)| Low    |
| Integration | Module + real dependencies (DB, API)| Medium   | Partial          | Medium |
| E2E         | Full user flow through UI/API       | Slowest  | None (real stack)| High   |
| Contract    | API schema between services         | Fast     | Full             | Low    |
| Performance | Throughput, latency, memory         | Variable | None             | High   |
| Mutation    | Test quality (kills surviving mutants) | Slow  | Full             | High   |

---

## Selection Rules

### Use Unit Tests when:
- Logic is pure (deterministic, no I/O)
- Testing boundary values, edge cases, error paths
- Function has clear input/output contract
- Speed is critical (TDD inner loop)

### Use Integration Tests when:
- Testing a service with a real database or cache
- Validating SQL queries, transactions, locks
- Testing concurrent access patterns
- Verifying third-party SDK behavior with real response shapes

### Use E2E Tests when:
- Validating a complete user journey (login → checkout → confirmation)
- Testing across process boundaries (frontend + backend + DB)
- Verifying browser-specific behavior
- Regression testing for user-visible flows

### Use Contract Tests when:
- A microservice API has multiple consumers
- An API schema is evolving
- Preventing breaking changes from propagating to consumers
- Validating that a provider meets consumer expectations

### Use Performance Tests when:
- A latency SLA is defined (e.g., p99 < 200ms)
- A throughput requirement exists (e.g., 1000 req/s)
- A feature involves heavy I/O or computation
- Load patterns are unpredictable or spiky

---

## Test Pyramid (Target Ratios)

```
         ┌─────────────┐
         │    E2E      │  10%  ← Fewer, critical paths only
         ├─────────────┤
         │ Integration │  20%  ← Key boundaries and DB interactions
         ├─────────────┤
         │    Unit     │  70%  ← Fast, deterministic, comprehensive
         └─────────────┘
```

**Anti-pattern**: Inverted pyramid (more E2E than unit) — slow, brittle, expensive.

---

## Framework Selection

### JavaScript / TypeScript
- **Unit**: Vitest (preferred for ESM), Jest
- **Integration**: Jest + Supertest, Vitest + testcontainers
- **E2E**: Playwright (preferred), Cypress
- **Contract**: Pact.js, OpenAPI Validator
- **Performance**: k6, Artillery

### Python
- **Unit**: Pytest, unittest
- **Integration**: Pytest + SQLAlchemy + testcontainers
- **E2E**: Playwright, Selenium
- **Performance**: Locust, k6

### Java
- **Unit**: JUnit 5, AssertJ
- **Integration**: Spring Boot Test, Testcontainers
- **E2E**: Selenium, Playwright
- **Performance**: Gatling, k6

---

## When to Use Mocks vs. Real Dependencies

| Situation                              | Use Mock | Use Real |
|----------------------------------------|----------|----------|
| Unit testing pure logic                | ✅        | ❌        |
| Integration testing DB queries         | ❌        | ✅        |
| Integration testing external API       | ✅        | ❌        |
| E2E testing the full stack             | ❌        | ✅        |
| Testing error paths (timeout, 503)     | ✅        | ❌        |
| Testing data persistence               | ❌        | ✅        |
