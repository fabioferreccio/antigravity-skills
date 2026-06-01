# Level 1: Entities (Enterprise Business Rules)

## Definition
Entities encapsulate the most general and high-level business rules. They are the least likely to change when something external changes. An Entity is uniquely identified by an ID — two entities with the same ID are considered the same regardless of attribute differences.

## Identity & Equality

Entities are equal when their IDs match, not when their attributes match. Use the `IEntity<ID>` pattern to enforce this:

```typescript
interface IEntity<ID = string> {
  readonly id: ID;
  equals(other: IEntity<ID>): boolean;
}
```

- **When to use**: Every domain object that has a lifecycle and must be tracked across time.
- **Anti-pattern**: Comparing entities by attribute equality (e.g., two `User` objects with the same email are NOT equal unless their IDs match).

## Aggregate Roots

An Aggregate Root is the entry point for a consistency boundary — a cluster of entities and value objects treated as a single transactional unit.

```typescript
interface IAggregateRoot<ID = string> extends IEntity<ID> {
  readonly version: number;
}
```

- **Rule**: Only Aggregate Roots have repositories. Child entities are accessed through the root.
- **Rule**: Reference other aggregates by ID only — never hold direct object references across aggregate boundaries.
- **Rule**: One transaction = one aggregate. Cross-aggregate consistency is eventual (via Domain Events).

## Value Objects

Value Objects have no identity. Equality is determined by comparing all attributes. They are immutable — any "change" produces a new instance.

```typescript
interface IValueObject<T> {
  readonly value: T;
  equals(other: IValueObject<T>): boolean;
}
```

- **Examples**: `Money`, `CPF`, `Email`, `DateRange`, `Address`, `Coordinates`.
- **Benefit**: Encapsulates validation logic and prevents "Primitive Obsession".
- **Anti-pattern**: Making Value Objects mutable or giving them an ID field.

## Auditable Entities

Track creation, modification, and soft-deletion metadata. Infrastructure fills these automatically — the domain declares the contract.

```typescript
interface IAuditableEntity<ID = string> extends IEntity<ID> {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
  readonly createdBy?: string;
  readonly updatedBy?: string;
}
```

- **When to use**: Any entity requiring an audit trail (regulatory, compliance, debugging).
- **Rule**: Auto-fill `createdAt`/`updatedAt` in Infrastructure (repository or middleware), not in the Entity constructor.

## Versioning (Optimistic Concurrency)

Prevent lost updates in concurrent environments by checking the version before persisting.

```typescript
interface IVersionable {
  readonly version: number;
}
```

- **Mechanism**: On update, the repository checks `WHERE version = :currentVersion`. If the row was already modified, a `ConcurrencyException` is thrown.
- **When to use**: Aggregates with high write contention or collaborative editing.

## Multi-Tenancy

Isolate data per tenant at the entity level. The `tenantId` acts as a mandatory filter in all queries.

```typescript
interface IMultiTenant {
  readonly tenantId: string;
}
```

- **Rule**: Repositories must enforce tenant filtering automatically — never rely on Use Cases to remember to filter.
- **Anti-pattern**: Storing `tenantId` only at the request level and forgetting to propagate it to queries.

## Domain Events in Entities

Entities collect domain events during state changes. Events are dispatched after successful persistence, not during business logic execution.

```typescript
interface IHasDomainEvents {
  readonly domainEvents: ReadonlyArray<IDomainEvent>;
  addDomainEvent(event: IDomainEvent): void;
  clearDomainEvents(): void;
}
```

- **Flow**: Entity mutates → collects event → Repository persists → Infrastructure dispatches events → Handlers react.
- **Anti-pattern**: Dispatching events inside the entity method (before persistence succeeds).

## Specification Pattern

Encapsulate reusable business rule predicates. Compose complex conditions from simple building blocks.

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

- **Example**: `ActiveUserSpec.and(PremiumUserSpec)` — reusable across Use Cases, repositories, and domain services.
- **When to use**: When the same business rule appears in multiple places, or when rules need runtime composition.

## Entity Lifecycle

```
Creation → Validation → Persistence → Retrieval → Update → Soft Delete
```

| Phase | Responsibility | Layer |
|---|---|---|
| **Creation** | Factory or constructor with invariant validation | Domain |
| **Validation** | Business rules enforced by the Entity itself | Domain |
| **Persistence** | Mapper converts to persistence model, repository saves | Infrastructure |
| **Retrieval** | Repository fetches, mapper reconstitutes domain entity | Infrastructure |
| **Update** | Entity methods enforce invariants, version incremented | Domain |
| **Soft Delete** | `deletedAt` set, entity excluded from default queries | Infrastructure |

## Good Practices
- **Purity**: Should be pure data structures or objects with methods that only depend on other entities and value objects.
- **Independence**: Must not import anything from `Use Cases`, `Adapters`, or `Frameworks`.
- **Validation**: Business invariants should be validated within the entity (e.g., a `Price` value object cannot be negative).
- **Encapsulation**: Expose behavior through methods, not raw setters. Prefer `order.addItem(item)` over `order.items.push(item)`.
- **Self-Documenting**: Entity method names should reflect ubiquitous language (`account.withdraw(amount)` not `account.update()`).

## Bad Practices (Anti-patterns)
- Importing a database library (e.g., TypeORM) into an Entity.
- Adding UI-specific formatting logic.
- Using framework-specific decorators (e.g., `@Column`) — unless using a mapper to keep the domain entity clean.
- Exposing public setters that bypass invariant validation.
- Entities depending on infrastructure services (e.g., calling a repository from within an entity method).
- Anemic Domain Model: entities with only getters/setters and no business logic.

## When to Use
Use for concepts that exist even if the application didn't exist (e.g., "Account", "Transaction", "User"). If the concept has a lifecycle and must be uniquely identified, it is an Entity.
