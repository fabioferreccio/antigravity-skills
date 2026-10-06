# Error Handling in Clean Architecture

Errors are classified by the layer that originates them. Inner-layer exceptions must never leak implementation details to outer layers.

## 1. Domain Exceptions (Level 1)

Business rule / invariant violations thrown by Entities and Value Objects.
Examples: `InsufficientFundsError`, `InvalidCPFError`, `OverdraftLimitExceededError`.

- Carry a unique **error code** (e.g., `DOMAIN.INSUFFICIENT_FUNDS`).
- Contain a descriptive message; never reference HTTP status codes or infrastructure concepts.
- Extend a base `DomainException` class to enable typed catch blocks.

## 2. Application Exceptions (Level 2)

Use Case precondition failures thrown when orchestration logic cannot proceed.
Examples: `UserNotFoundError`, `UnauthorizedError`, `ValidationError`, `ConflictError`.

- Thrown **after** a port call returns unexpected state (e.g., repository returns `null`).
- May wrap a Domain Exception to add application context (correlation ID, input DTO snapshot).

## 3. Infrastructure Exceptions (Level 3–4)

Technical failures from adapters interacting with external systems.
Examples: `DatabaseConnectionError`, `ExternalServiceTimeoutError`, `FileStorageError`.

- Must be caught at the adapter boundary and translated into an Application or Domain exception.
- Infrastructure details (connection strings, vendor error codes) must **never** reach the Domain layer.

## 4. Error Boundaries

Rule: every layer crossing is an error boundary. Inner exceptions are caught and wrapped.

```
Presentation → catches ApplicationException → maps to HTTP status + JSON body
Application  → catches DomainException → wraps with correlation context
Infrastructure → catches vendor errors → throws ApplicationException or retries
```

Infrastructure errors should **NEVER** leak to Domain. The Domain layer throws; it never catches infrastructure concerns.

## 5. Result Pattern (Alternative to Thrown Exceptions)

A monadic `IResult<T>` eliminates try/catch coupling and makes failure a first-class return value.

```typescript
interface IError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

interface IResult<T = void> {
  readonly isSuccess: boolean;
  readonly isFailure: boolean;
  readonly value?: T;
  readonly error?: IError;
}
```

- **When to use**: Use Cases that have multiple, expected failure paths (validation, authorization).
- **When NOT to use**: Truly exceptional situations (DB down, OOM) — throw those.
- Combine with discriminated unions for exhaustive pattern matching at the boundary.

## 6. Good Practices

- Build a custom exception hierarchy: `DomainException` → `ApplicationException` → `InfrastructureException`.
- Include machine-readable `code` fields — clients switch on codes, not messages.
- Keep error messages descriptive for developers; sanitize before exposing to end-users.
- Log the full error + stack trace at the boundary; return a safe summary to the caller.

## 7. Anti-Patterns

- ❌ Catching generic `Error` and swallowing it silently.
- ❌ Leaking stack traces or vendor error details to API clients.
- ❌ Using HTTP status codes (`404`, `500`) inside Domain or Application layers.
- ❌ Throwing strings instead of typed error objects.
- ❌ Returning `null` to signal failure instead of an explicit error or Result.
