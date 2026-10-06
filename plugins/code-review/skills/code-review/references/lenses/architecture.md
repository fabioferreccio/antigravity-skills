# Architecture Review Lens

Polyglot architecture review lens. Language-agnostic principles with language-specific red flags.

## Universal Principles
1. **Dependency direction**: dependencies must flow inward (toward domain/core)
2. **Domain logic** must not depend on infrastructure
3. **Controllers/handlers** must be thin (validate input, delegate to use case, return result)
4. **Interfaces/ports** should be defined by the consumer, not the provider
5. **No framework-specific code** in domain/core layer
6. **Single Responsibility**: each module has one reason to change
7. **Open/Closed**: extend behavior without modifying existing code
8. **Liskov Substitution**: subtypes must be substitutable
9. **Interface Segregation**: no client should depend on methods it doesn't use
10. **Dependency Inversion**: depend on abstractions, not concretions

## Language-Specific Red Flags

### TypeScript/JavaScript
- Domain importing from `@nestjs/*`, `express`, `fastify`
- Use cases importing Prisma, TypeORM, Sequelize directly
- Controllers with business logic (conditionals, calculations)
- `any` type in domain interfaces
- Concrete classes in constructor params instead of interfaces

### Java/Kotlin
- Domain classes with `@Entity`, `@Repository`, `@Service` (Spring annotations)
- Use cases importing JDBC, Hibernate directly
- Controllers with business logic
- Missing interface for repository
- Domain depending on `javax.persistence`

### Python
- Domain importing from `django.db`, `sqlalchemy`, `flask`
- Business logic in views/routes
- Models mixing domain logic with ORM concerns
- Missing abstract base classes for ports

### Go
- Domain packages importing infrastructure packages
- Handlers with business logic
- Missing interfaces for external dependencies
- Circular package dependencies

### Rust
- Domain crate depending on web framework crates
- Business logic in handler functions
- Missing trait definitions for ports

### Dart/Flutter
- Domain importing from `package:flutter/material.dart`
- Business logic in Widgets
- Cubits/BLoCs importing infrastructure directly
- Missing abstract classes for repositories

### C#/.NET
- Domain project referencing infrastructure projects
- Controllers with business logic
- DbContext in domain layer
- Missing interface for repository pattern

## Severity
- **Critico**: Layer violations (domain importing infra), tight coupling creating untestable code
- **Importante**: Convention deviations, legacy patterns when newer ones exist
- **Menor**: Style preferences, import ordering
