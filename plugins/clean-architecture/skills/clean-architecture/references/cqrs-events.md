# CQRS & Events

## 1. CQRS Overview

Command Query Responsibility Segregation separates **write models** (Commands) from **read models** (Queries). Each side can scale, optimize, and evolve independently.

**When to use**: high-read/low-write ratio, complex query projections, event-driven systems, polyglot persistence.

## 2. Commands (Write Intent)

Immutable objects that express intent to change state. They carry data, not behavior.

```typescript
interface ICommand {
  readonly commandName: string;
  readonly timestamp: Date;
  readonly correlationId?: string;
}
interface ICommandHandler<TCommand, TResult = void> {
  handle(command: TCommand): Promise<TResult>;
}
```

- One handler per command (SRP). Handlers live in the Application layer.
- Commands may return a `IResult<T>` or `void`. Never return full read models.

## 3. Queries (Read Intent)

Queries fetch data without side effects. They are idempotent and cacheable.

```typescript
interface IQuery { readonly queryName: string; }
interface IQueryHandler<TQuery, TResult> { handle(query: TQuery): Promise<TResult>; }
```

- Query handlers may bypass the Domain layer and read directly from optimized projections.
- Never mutate state inside a query handler.

## 4. Domain Events vs Integration Events

### Domain Events (`IDomainEvent`)

Intra-aggregate, in-process notifications about something that **already happened**.

| Field | Type | Purpose |
|---|---|---|
| eventId | string | Unique event identifier |
| eventName | string | Past-tense name (e.g., `OrderPaid`, `UserRegistered`) |
| occurredOn | Date | Timestamp of occurrence |
| aggregateId | string | Source aggregate ID |
| payload | Record | Event-specific data |

- Raised by Aggregates via `IHasDomainEvents`. Dispatched after persistence (in the same transaction boundary).

### Integration Events (`IIntegrationEvent`)

Cross-context or cross-service notifications published via a Message Bus.

| Field | Type | Purpose |
|---|---|---|
| eventId | string | Unique event identifier |
| eventName | string | Past-tense name |
| occurredOn | Date | Timestamp of occurrence |
| sourceContext | string | Originating bounded context |
| payload | Record | Minimal data + IDs (avoid large payloads) |

- Published **after** the domain transaction commits successfully.

## 5. Event Bus vs Message Bus

| Concern | `IEventBus` | `IMessageBus` |
|---|---|---|
| Scope | In-process | Cross-service |
| Transport | Memory | Kafka, RabbitMQ, SQS |
| Methods | `publish`, `publishAll`, `subscribe` | `send`, `publish`, `subscribe` |
| Events | Domain Events | Integration Events |

## 6. Outbox / Inbox Pattern

Reliable event delivery for distributed systems — avoids dual-write problems.

- **Outbox (`IOutboxMessage`)**: Store integration events in the same DB transaction as aggregate changes. A background processor publishes them asynchronously.
- **Inbox (`IInboxMessage`)**: Idempotent consumer that deduplicates incoming events using `eventId`. Prevents double-processing on retries.

## 7. Event Sourcing (Brief)

Instead of persisting current state, persist the **sequence of domain events**. Rebuild state by replaying the event stream.

- Pairs naturally with CQRS: events feed read-side projections.
- **When to consider**: Full audit trail required, complex temporal queries, undo/replay capabilities.
- **Trade-off**: Increases complexity — use only when the benefits justify the cost.

## 8. Anti-Patterns

- ❌ Queries that mutate state (violates CQS principle).
- ❌ Overly large event payloads — prefer IDs + minimal context; let consumers query for details.
- ❌ Synchronous event handling that blocks the main command flow.
- ❌ Missing `correlationId` — makes distributed tracing impossible.
- ❌ Publishing integration events before the transaction commits (data may roll back).
