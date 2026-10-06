# Design Patterns in Clean Architecture

## 1. Factories
- **Role**: Creating complex objects (Entities or Aggregates) while hiding the creation logic.
- **Types**:
  - **Domain Factory**: Inside Level 1, creates entities from raw data with invariant validation.
  - **Infrastructure Factory**: Inside Level 4, creates complex database clients or SDK instances.
- **When to use**: When object construction requires multiple steps, conditional logic, or external data lookups.
- **Anti-pattern**: Using constructors with 10+ parameters instead of a factory.

## 2. Strategy Pattern
- **Role**: Switching between different algorithms or providers at runtime.
- **Example**: Choosing between `PixPayment`, `CreditCardPayment`, and `BoletoPayment`.
- **Implementation**: Define a port interface in the Application layer; provide multiple implementations in Infrastructure. Use DI to select the strategy.

## 3. Decorators
- **Role**: Adding cross-cutting concerns (Logging, Caching, Transactions) without polluting the Use Case.
- **Example**: A `TransactionDecorator` that wraps a Use Case and commits/rollbacks the DB transaction.
- **Benefit**: Each concern is isolated, composable, and independently testable.

## 4. Mappers (Expanded)

Bidirectional data transformation between layers. Each layer has its own model — mappers bridge them.

```typescript
interface IMapper<Domain, Persistence, DTO = Domain> {
  toDomain(raw: Persistence): Domain;
  toPersistence(domain: Domain): Persistence;
  toDTO?(domain: Domain): DTO;
}
```

- **Constraint**: Mappers should live in the **Outer Layer** (e.g., `UserMapper` in Infrastructure converts DB Model → Entity).
- **When to use**: Always. Never pass raw database models or framework objects into the domain.
- **Anti-pattern**: Using a single shared model across all layers (tight coupling).

## 5. Specification Pattern

Encapsulate reusable business rule predicates with composable AND/OR/NOT operations.

```typescript
interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

interface ICompositeSpecification<T> extends ISpecification<T> {
  and(other: ISpecification<T>): ICompositeSpecification<T>;
  or(other: ISpecification<T>): ICompositeSpecification<T>;
  not(): ICompositeSpecification<T>;
}
```

- **Example**: `ActiveUserSpecification.and(PremiumUserSpecification)` — compose complex eligibility checks from simple predicates.
- **Where it lives**: Domain layer (Level 1). Specifications express pure business rules.
- **When to use**: When the same condition appears in multiple Use Cases, when rules must be composed at runtime, or when building query filters from domain logic.
- **Anti-pattern**: Embedding complex boolean conditions inline in Use Cases instead of extracting them into named Specifications.

## 6. Repository Segregation (Interface Segregation Principle)

Split the repository interface so each consumer depends only on the operations it needs.

```typescript
interface IReadRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  exists(id: ID): Promise<boolean>;
}

interface IWriteRepository<T, ID = string> {
  save(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: ID): Promise<void>;
}

interface ISearchableRepository<T> {
  search(criteria: ISpecification<T>): Promise<T[]>;
  count(criteria: ISpecification<T>): Promise<number>;
}
```

- **Benefit**: A query-only Use Case injects `IReadRepository` — no access to destructive write operations.
- **CQRS alignment**: Read models and write models can have entirely different repository interfaces and even different storage backends.
- **Anti-pattern**: A single `IRepository` with 15+ methods where every consumer has access to everything.

## 7. Unit of Work

Coordinates multi-repository transactions. Ensures atomicity across multiple aggregate writes within a single Use Case.

```typescript
interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getRepository<T>(name: string): T;
}
```

- **Where it lives**: Interface defined in Application layer; implementation in Infrastructure.
- **When to use**: When a Use Case must persist changes to multiple aggregates atomically (e.g., transfer money between two accounts).
- **Anti-pattern**: Opening transactions inside individual repositories — the Use Case must control the transactional boundary.

## 8. Policy Pattern

Encapsulate authorization or business policy rules that evaluate a context and return a decision.

```typescript
interface IPolicy<TContext> {
  evaluate(context: TContext): Promise<boolean>;
}
```

- **Example**: `CanEditArticlePolicy` receives `{ userId, articleOwnerId, userRole }` and returns whether access is allowed.
- **Where it lives**: Application layer. Policies may depend on ports (e.g., `ICurrentUser`) but never on infrastructure.
- **Anti-pattern**: Scattering `if (user.role === 'admin')` checks across controllers and Use Cases.

## 9. Middleware / Pipeline

Chain of responsibility for cross-cutting concerns in the HTTP or messaging layer.

```typescript
interface IMiddleware {
  handle(request: unknown, next: () => Promise<unknown>): Promise<unknown>;
  readonly order: number;
}
```

- **Examples**: Authentication, logging, rate limiting, CORS, request tracing.
- **Order matters**: Authentication before authorization before rate limiting before business logic.
- **Where it lives**: Presentation/Infrastructure layer (Level 3–4). Never in Domain or Application.
- **Anti-pattern**: Putting business logic in middleware — middleware handles infrastructure concerns only.
