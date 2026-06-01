# clean-architecture

> **Version**: 1.1.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

A world-class, senior-level cognitive skill for designing, refactoring, and auditing software systems using **Clean Architecture**, **SOLID** principles, and **DDD (Domain-Driven Design)**. It uses a modular, reference-based knowledge system to provide precise guidance while maintaining high token efficiency.

> **Note**: While examples use TypeScript, all principles are **language-agnostic** and apply equally to Go, Java, C#, Python, and other languages.

## Key Features

- **Layer-Specific Modules**: Specialized logic for Domain (Entities/Services), Application (Use Cases/Sagas), Infrastructure (Repositories/Gateways), and Presentation (Controllers/Presenters).
- **Complexity Escalation**: Automatic guidance on when to transition from simple Use Cases to complex **Orchestrators** or **Sagas**.
- **SOLID Guidance**: Every architectural suggestion is backed by SRP, OCP, LSP, ISP, and DIP.
- **DDD Integration**: First-class support for Aggregates, Value Objects, Bounded Contexts, and Domain Events.
- **CQRS & Events**: Command/Query separation, Domain Events vs Integration Events, Event Bus/Message Bus patterns.
- **Error Handling**: Structured error boundaries across layers with Result pattern support.
- **Contracts Catalog**: Comprehensive interface reference covering ~50 contracts organized by layer.
- **Anti-Patterns**: Before/after refactoring examples for common Clean Architecture violations.
- **Observability**: Logging, metrics, and tracing guidance following cross-cutting best practices.
- **Testing Mastery**: Integrated strategy for Unit, Integration, and E2E testing using TDD and Triple AAA (Arrange, Act, Assert).
- **Framework as Plugin**: Ensuring your business logic remains agnostic of Web Frameworks (Express/Fastify) or ORMs (Prisma/TypeORM).

## What's New in v1.1.0

- **Bug Fix**: Corrected file references in SKILL.md (`adapters.md`/`drivers.md` → `adapters-drivers.md`)
- **New Modules**: `error-handling.md`, `cqrs-events.md`, `anti-patterns.md`, `contracts-catalog.md`, `observability.md`
- **Enriched Modules**: All existing reference modules significantly expanded with interface contracts and deeper guidance
- **Example Tests**: Both examples now include unit tests following Triple AAA pattern
- **Golden Answers**: Eval suite now includes expected responses and scoring rubric
- **Updated Graph**: Dependency graph now includes Shared Kernel, Cross-Cutting, and CQRS nodes
- **Level 2.5 Disclaimer**: Orchestrators module now clearly states this is a practical extension

## Usage

This skill activates automatically when you discuss system architecture, layers, refactoring, testing, CQRS, error handling, contracts, interfaces, or observability.

### Automated Knowledge Routing
The agent uses a modular RAG system to load only the relevant context for your request:

| Module | Topic |
|---|---|
| `references/entities.md` | Pure business rules, Value Objects, Aggregates |
| `references/use-cases.md` | Application flows, validation, authorization |
| `references/orchestrators.md` | Complex flows, Sagas, compensation |
| `references/adapters-drivers.md` | Controllers, Repositories, Gateways, Middleware |
| `references/layers.md` | System organization |
| `references/dependency-principles.md` | DIP, DI, Contracts, Shared Kernel |
| `references/solid.md` | SRP, OCP, LSP, ISP, DIP |
| `references/ddd.md` | Aggregates, Bounded Contexts, Domain Events |
| `references/patterns.md` | Factories, Strategy, Specification, Unit of Work |
| `references/testing.md` | TDD, Triple AAA, Testability Matrix |
| `references/error-handling.md` | Exception boundaries, Result pattern |
| `references/cqrs-events.md` | CQRS, Event Sourcing, Event/Message Bus |
| `references/anti-patterns.md` | Code smells, before/after refactoring |
| `references/contracts-catalog.md` | Interface catalog (~50 contracts by layer) |
| `references/observability.md` | Logging, metrics, tracing |

## Example: Multi-Acquirer Payment Gateway

**User**: "Preciso criar um motor de pagamentos que aceite Pix e Cartão usando múltiplos adquirentes."

**Agent**:
1. Identifies the need for a **Strategy Factory** and a **Saga**.
2. Loads `references/patterns.md` and `references/orchestrators.md`.
3. Defines the `IPaymentProvider` contract in the Domain.
4. Implements the `PaymentStrategyFactory` to switch between Adyen/Stripe/Stone at runtime.
5. Provides a testing plan using **Arrange, Act, Assert**.

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## Limitations

- Examples are primarily in TypeScript (principles are language-agnostic)
- Focuses on backend architecture (not frontend frameworks like React/Angular)
- Does not cover infrastructure provisioning (Terraform, Kubernetes)

## License

MIT
