# backend-architect

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

The `backend-architect` skill acts as an elite Staff/Principal Backend Engineer and Software Architect. It guides the design, scaffolding, refactoring, and quality engineering of enterprise Node.js/TypeScript backend services, specializing in **NestJS**, **Clean Architecture**, **Domain-Driven Design (DDD)**, and strict **Multi-Tier Testing** (pure unit tests, Testcontainers integration suites, and E2E API tests).

It bridges the gap between high-level architectural theory and concrete framework execution, ensuring that business logic remains 100% decoupled from framework decorators while leveraging NestJS as a powerful dependency injection and HTTP engine via explicit injection tokens.

---

## When to Use

- Architecting or scaffolding a new backend service or module in **NestJS**.
- Designing rich domain models, Aggregates, Value Objects, and Domain Events in TypeScript.
- Decoupling Use Cases from framework decorators (`@Injectable()`) using Symbol/String injection tokens.
- Setting up Data Mappers for ORMs (Prisma, TypeORM, Kysely) to separate DB schemas from Domain Entities.
- Structuring a multi-tiered test suite:
  - Fast, pure unit tests without NestJS bootstrap overhead.
  - Integration tests with real PostgreSQL/Redis instances using **Testcontainers**.
  - E2E tests for controllers, validation pipes, and exception filters.
- Implementing distributed reliability patterns: Transactional Outbox, Idempotency Keys, and Result Pattern (`Result<T, E>`).
- Hardening production backends with structured logging (Pino), correlation IDs, and RBAC guards.

---

## When NOT to Use

- Frontend or component engineering (use `frontend-architect`).
- Pure database administration, index tuning, or raw query analysis (use `dba-agent`).
- Static code review and pull request feedback (use `code-review`).
- Simple script generation without architectural structure.

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
│   └── ports/                      # Outbound ports (gateways, buses)
│
├── infrastructure/                 # Technical Adapters & Plugins
│   ├── persistence/                # Prisma/TypeORM repositories & mappers
│   ├── gateways/                   # 3rd-party API adapters (Stripe, SES)
│   └── tokens/                     # Symbol DI tokens
│
├── presentation/                   # Inbound Transport
│   ├── controllers/                # HTTP/gRPC controllers
│   ├── dtos/                       # Request/Response validation DTOs
│   └── filters/                    # Global Domain Exception filters
│
└── <bounded-context>.module.ts     # NestJS IoC wiring module
```

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

To install the complete backend and data engineering ecosystem:

```bash
npx github:fabioferreccio/antigravity-skills install backend-architect clean-architecture codebase-design dba-agent migration-reviewer --global
```

---

## Usage Examples

### 1. Scaffolding a NestJS Clean Architecture Module
Say to the agent:
> *"Crie a arquitetura de um módulo de faturamento (billing) no NestJS com Clean Arch, DDD e Prisma, usando injeção de dependência desacoplada."*

The skill generates:
1. `Invoice` Aggregate Root with encapsulated business invariants.
2. `InvoiceRepositoryPort` interface.
3. Plain TypeScript `GenerateInvoiceUseCase` without `@Injectable()`.
4. `PrismaInvoiceRepository` with `InvoicePersistenceMapper`.
5. Symbol injection tokens and `BillingModule` provider wiring.

### 2. Multi-Tier Testing
Say to the agent:
> *"Gere a suíte de testes para este Use Case: um teste unitário puro com repositório in-memory e um teste de integração com Testcontainers."*

The skill produces:
1. Vitest/Jest unit test running in <10ms with zero mocks.
2. Integration test spinning up a real disposable PostgreSQL container.

---

## Limitations

- Requires Node.js $\ge$ 18 and TypeScript $\ge$ 5.0 with strict mode recommended.
- Testcontainers integration requires Docker to be running on the host machine.
- Highly specialized for TypeScript/Node.js ecosystems (NestJS, Fastify, Express).

---

## License

[MIT](../../LICENSE)
