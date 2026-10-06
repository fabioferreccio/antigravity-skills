# Level 2: Use Cases (Application Business Rules)

## Definition
Use Cases orchestrate the flow of data to and from entities, and direct those entities to use their enterprise-wide business rules to achieve the goals of the use case. Each Use Case represents a single application-specific action.

## Standard Contract

Every Use Case implements a uniform interface. This enables decorators, logging, and generic middleware.

```typescript
interface IUseCase<Input = void, Output = void> {
  execute(input: Input): Promise<Output>;
}
```

- **Input**: A plain DTO (Data Transfer Object) — never a framework request object.
- **Output**: A domain result or DTO — never an HTTP response.
- **Naming**: `CreateUserUseCase`, `ProcessPaymentUseCase`, `CancelOrderUseCase`.

## Input Validation

Validate DTOs before processing. Throw validation errors early to avoid partial state changes.

```typescript
interface IValidator<T> {
  validate(input: T): Promise<string[]>;
  isValid(input: T): Promise<boolean>;
}
```

- **Rule**: Structural/format validation (required fields, types, ranges) belongs in the Application layer.
- **Rule**: Business invariant validation (uniqueness, state transitions) belongs in the Domain layer.
- **Anti-pattern**: Validating inside the controller — validation results may differ across entry points (HTTP, CLI, Event).

## Authorization Checks

Authorization belongs in the Application layer, not scattered across controllers or middleware.

```typescript
interface IPolicy<TContext> {
  evaluate(context: TContext): Promise<boolean>;
}

interface IAuthorizationService {
  authorize<TContext>(policy: IPolicy<TContext>, context: TContext): Promise<void>;
}
```

- **When to use**: Before executing the core logic of a Use Case. If the policy fails, throw an `UnauthorizedError`.
- **Example**: `CanEditArticlePolicy` checks that the current user is the author or an admin.
- **Anti-pattern**: Embedding authorization checks in every controller or mixing them with business rules.

## Supporting Ports

Testable abstractions for cross-cutting concerns injected into Use Cases:

| Port | Purpose | Test Benefit |
|---|---|---|
| `ICurrentUser` | Who is logged in (id, roles, tenantId) | Stub any user identity |
| `IDateProvider` | Current date/time | Deterministic time in tests |
| `IIdGenerator` | Generate unique IDs | Predictable IDs in snapshots |
| `ILogger` | Structured logging | Silent or captured in tests |

- **Rule**: Never call `new Date()` or `uuid()` directly in a Use Case — inject the provider.

## Error Handling

Two approaches for communicating errors from Use Cases:

### Approach A: Result Type (Recommended)
```typescript
interface IResult<T> {
  readonly isSuccess: boolean;
  readonly isFailure: boolean;
  readonly value?: T;
  readonly error?: IError;
}
```
- **Benefit**: Explicit control flow, no try/catch chains, composable.
- **Trade-off**: More verbose, requires unwrapping.

### Approach B: Thrown Exceptions
- **Benefit**: Simpler code when errors are truly exceptional.
- **Trade-off**: Invisible control flow, easy to forget to catch.

**Recommendation**: Use `IResult<T>` for expected failures (validation, not found, conflict). Use exceptions for unexpected failures (infrastructure errors, bugs).

## Application Services

When a workflow requires coordinating multiple Use Cases but doesn't warrant a full Orchestrator/Saga, use an Application Service.

```typescript
interface IApplicationService {
  readonly name: string;
}
```

- **Distinct from Orchestrator**: Application Services coordinate within a single bounded context. Orchestrators coordinate across contexts or microservices.
- **Distinct from Domain Service**: Application Services depend on infrastructure ports. Domain Services operate purely on domain objects.
- **When to use**: Multi-step workflows within a single bounded context that share transactional boundaries.

## Good Practices
- **Single Responsibility**: One Use Case per task (e.g., `CreateUserUseCase`, `ProcessPaymentUseCase`).
- **Input/Output Ports**: Define clear interfaces for the data coming in and going out.
- **Independence**: Must not know about the database or UI. It calls **Interfaces** (Ports) implemented by outer layers.
- **Idempotency**: Design Use Cases to be safely re-executable when possible (especially for event-driven flows).
- **Thin orchestration**: The Use Case coordinates — heavy logic belongs in Entities or Domain Services.

## Bad Practices (Anti-patterns)
- A single Use Case that handles Create, Read, Update, and Delete (CRUD).
- Calling a Web API directly from the Use Case.
- Handling HTTP response codes (e.g., returning 404). Return domain errors or `IResult` instead.
- Calling other Use Cases directly — use an Orchestrator or Application Service for coordination.
- Mixing read and write logic in one Use Case — apply CQRS: separate `Command` (write) from `Query` (read).
- Injecting the entire DI container instead of specific ports.
- Returning domain entities directly — map to DTOs to avoid leaking internal structure.

## Single Use Case Example
```typescript
interface CreateUserPort {
  execute(data: CreateUserDTO): Promise<IResult<UserDTO>>;
}
```
