# backend-architect

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

The `backend-architect` skill acts as an elite Staff/Principal Backend Engineer and Software Architect. It guides the design, scaffolding, refactoring, and quality engineering of enterprise Node.js/TypeScript backend services, specializing in **NestJS**, **Clean Architecture**, **Domain-Driven Design (DDD)**, **Multi-Tier Testing** (pure unit tests, Testcontainers integration suites), **Distributed Caching & BullMQ Queues**, **OpenTelemetry & Pino Observability**, **Universal Compliance (LGPD, GDPR, PCI DSS)**, and **Monorepo Engineering (Turborepo/Nx)**.

It bridges the gap between high-level architectural theory and concrete framework execution, ensuring that business logic remains 100% decoupled from framework decorators while leveraging NestJS as a powerful dependency injection and HTTP engine via explicit injection tokens.

---

## Key Pillars & Capabilities

1. **Interactive Planning & Anti-Steamroll Protocol**: Always performs situational diagnosis, generates a visual Mermaid architecture plan with explicit trade-offs and "whys", and requests user approval before touching files.
2. **AI Context Awareness**: Inspects if the project already has AI rules (`.agents/`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`). If missing, guides the user and recommends running `ai-onboarding`.
3. **Decoupled Clean Architecture in NestJS**: 4 strict layers where Domain and Application layers are 100% pure TypeScript without `@Injectable()` or ORM imports.
4. **Rich Domain Modeling (DDD)**: Aggregate Roots, immutable Value Objects, domain invariants, and decoupled repository ports.
5. **High-Performance Redis & Asynchronous Messaging**:
   - Cache-Aside patterns, TTLs, automatic invalidation via `@keyv/redis` and `cache-manager`.
   - Asynchronous background jobs via **BullMQ** (`@nestjs/bullmq`) with concurrency, exponential backoff retries, and Dead Letter Queues (DLQ).
   - Redis Pub/Sub and microservices transport.
6. **Resilience, Availability & Traffic Control**:
   - Deep health probes via `@nestjs/terminus` (database ping, Redis broker, V8 memory heap/RSS, disk).
   - Graceful shutdown (`enableShutdownHooks()`) with connection draining.
   - Distributed rate limiting via `@nestjs/throttler` backed by Redis.
   - Memory leak defense and stream-based data handling.
7. **Observability & Universal Compliance**:
   - Contextual structured logging via `nestjs-pino` with `x-correlation-id`.
   - Distributed tracing and metrics with **OpenTelemetry** (OTel SDK).
   - Universal data redaction conforming to **LGPD**, **GDPR** (PII), and **PCI DSS** (zero PAN/CVV logging).
8. **Monorepos & Change-Based Deployments**:
   - Monorepo patterns with Turborepo and Nx.
   - Change-based CI/CD builds (`turbo run build --filter=...[origin/main]`).
   - Architectural linting with `dependency-cruiser` to prevent layer violations.

---

## When to Use

- Architecting or scaffolding a new backend service or module in **NestJS**.
- Designing rich domain models, Aggregates, Value Objects, and Domain Events in TypeScript.
- Decoupling Use Cases from framework decorators using Symbol/String injection tokens.
- Setting up Redis caching, BullMQ background queues, and Dead Letter Queues.
- Implementing production health checks, graceful shutdown, and distributed rate limiting.
- Configuring structured logging with Pino and end-to-end tracing with OpenTelemetry.
- Enforcing compliance masking (LGPD, GDPR, PCI DSS) across logs and error filters.
- Managing multi-service monorepos and setting up change-based differential CI/CD pipelines.
- Structuring multi-tiered test suites (Unit, Testcontainers integration, E2E).

---

## When NOT to Use

- Frontend or component engineering (use `frontend-architect`).
- Pure database administration, index tuning, or raw query analysis (use `dba-agent`).
- Static code review and pull request feedback (use `code-review`).
- Simple scripts or utility functions without architectural structure.

---

## Architecture: The 4 Clean Layers in NestJS

```
src/modules/<bounded-context>/
├── domain/                         # Pure TypeScript — ZERO external dependencies
│   ├── entities/                   # Aggregate Roots & Entities with invariants
│   ├── value-objects/              # Immutable Value Objects with validation
│   ├── events/                     # Domain Events
│   ├── exceptions/                 # Explicit Domain Exceptions
│   └── repositories/               # Repository Port interfaces
│
├── application/                    # Application Orchestration
│   ├── use-cases/                  # Commands & Queries
│   └── ports/                      # Outbound ports (gateways, buses, queues)
│
├── infrastructure/                 # Technical Adapters & Plugins
│   ├── persistence/                # Prisma/TypeORM repositories & mappers
│   ├── cache/                      # Redis cache adapters & distributed locks
│   ├── jobs/                       # BullMQ producers and consumers
│   ├── observability/              # Pino logger & OTel tracer configs
│   └── tokens/                     # Symbol DI tokens
│
├── presentation/                   # Inbound Transport
│   ├── controllers/                # HTTP/gRPC controllers
│   ├── dtos/                       # Request/Response validation DTOs
│   ├── guards/                     # RBAC & Throttler guards
│   └── filters/                    # Global Domain Exception filters (RFC 7807)
│
└── <bounded-context>.module.ts     # NestJS IoC wiring module
```

---

## Reference Guides

Detailed specialized engineering guides available in `references/`:

| Guide | Description |
|---|---|
| [`interactive-planning-protocol.md`](./references/interactive-planning-protocol.md) | AI context discovery, onboarding check, and plan-first anti-steamroll protocol |
| [`nestjs-clean-architecture.md`](./references/nestjs-clean-architecture.md) | Bounded context structure, Symbol injection tokens, decoupled IoC |
| [`ddd-domain-modeling.md`](./references/ddd-domain-modeling.md) | Aggregates, Value Objects, Domain Events, and business invariant encapsulation |
| [`redis-cache-and-messaging.md`](./references/redis-cache-and-messaging.md) | Redis caching, BullMQ background queues, exponential retries, and DLQ |
| [`resilience-and-availability.md`](./references/resilience-and-availability.md) | Terminus probes, memory heap monitoring, graceful shutdown, and Redis throttler |
| [`security-and-observability.md`](./references/security-and-observability.md) | OpenTelemetry tracing, Pino structured logging, LGPD/GDPR/PCI DSS redaction |
| [`monorepo-and-tooling.md`](./references/monorepo-and-tooling.md) | Turborepo/Nx change-based deploy, dependency-cruiser, and Quality Gate hooks |
| [`testing-strategy.md`](./references/testing-strategy.md) | Unit tests (AAA/pure TS), Testcontainers (real DB/Redis), E2E with Supertest |
| [`adapters-and-infrastructure.md`](./references/adapters-and-infrastructure.md) | Data Mapper pattern, Unit of Work port, and RFC 7807 exception filters |
| [`resilience-and-patterns.md`](./references/resilience-and-patterns.md) | Result Pattern, Transactional Outbox, and Idempotency keys |

---

## Installation

### Antigravity (Default)

```bash
# Workspace-scoped
npx github:fabioferreccio/antigravity-skills install backend-architect

# Global
npx github:fabioferreccio/antigravity-skills install backend-architect --global
```

### Claude Code

```bash
# Global
npx github:fabioferreccio/antigravity-skills install backend-architect --claude --global
```

### Bundled Suite (Recommended)

To install the complete backend, database, and architectural ecosystem:

```bash
npx github:fabioferreccio/antigravity-skills install backend-architect clean-architecture codebase-design dba-agent migration-reviewer --global
```

---

## Limitations

- Requires Node.js $\ge$ 18 and TypeScript $\ge$ 5.0 with strict mode recommended.
- Testcontainers integration requires Docker to be running on the host machine.
- Highly specialized for TypeScript/Node.js ecosystems (NestJS, Fastify, Express).

---

## License

[MIT](../../LICENSE)
