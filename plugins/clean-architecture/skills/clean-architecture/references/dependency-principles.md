# Dependency Principles & Contracts

## 1. Dependency Inversion Principle (DIP)
- **Concept**: High-level modules (Domain/Application) should not depend on low-level modules (Infrastructure). Both should depend on abstractions (Contracts).
- **Mechanism**: The Application layer defines a `Port` (Interface). The Infrastructure layer implements that port.
- **Benefit**: You can swap your DB or Email provider without changing a single line of business logic.

## 2. Dependency Injection (DI)
- **Concept**: Providing a component with its dependencies from the outside rather than creating them internally.
- **Mechanism**: Use constructor injection. The Orchestrator/Main file "assembles" the components.
- **Example**:
  ```typescript
  // Constructor injection
  class UseCase {
    constructor(private repository: IUserRepository) {}
  }
  ```

## 3. Contracts (Interfaces)
- **Concept**: Formal agreements between layers.
- **Rule**: Contracts live in the **inner layer** (Domain or Application). The implementation lives in the **outer layer** (Infrastructure).

## 4. Frameworks as Plugins
- **Concept**: The Web Framework (Express/Fastify) or ORM (Prisma/TypeORM) should be treated as a plugin.
- **Rule**: Your system should be able to run without the framework (e.g., in a unit test).
- **Goal**: Keep the framework details isolated in the Infrastructure and Presentation layers.

## 5. Repositories vs. Gateways
- **Repository**: An abstraction over a collection of objects (Domain-centric).
- **Gateway**: An abstraction over an external system (Integration-centric).
- **Both**: Must be defined as interfaces in the Domain or Application layer.
