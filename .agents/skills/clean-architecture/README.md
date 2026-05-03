# clean-architecture

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Antigravity Architect

## Overview

A world-class, senior-level cognitive skill for designing, refactoring, and auditing software systems using **Clean Architecture**, **SOLID** principles, and **DDD (Domain-Driven Design)**. It uses a modular, reference-based knowledge system to provide precise guidance while maintaining high token efficiency.

## Key Features

- **Layer-Specific Modules**: Specialized logic for Domain (Entities/Services), Application (Use Cases/Sagas), Infrastructure (Repositories/Gateways), and Presentation (Controllers/Presenters).
- **Complexity Escalation**: Automatic guidance on when to transition from simple Use Cases to complex **Orchestrators** or **Sagas**.
- **SOLID Guidance**: Every architectural suggestion is backed by SRP, OCP, LSP, ISP, and DIP.
- **DDD Integration**: First-class support for Aggregates, Value Objects, and Bounded Contexts.
- **Testing Mastery**: Integrated strategy for Unit, Integration, and E2E testing using TDD and Triple AAA (Arrange, Act, Assert).
- **Framework as Plugin**: Ensuring your business logic remains agnostic of Web Frameworks (Express/Fastify) or ORMs (Prisma/TypeORM).

## Usage

This skill activates automatically when you discuss system architecture, layers, refactoring, or testing.

### Automated Knowledge Routing
The agent uses a modular RAG system to load only the relevant context for your request:
- `references/layers.md`: For system organization.
- `references/solid.md` & `references/ddd.md`: For core principles.
- `references/orchestrators.md`: For complex transaction flows.
- `references/testing.md`: For quality and testability.

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

## License

MIT
