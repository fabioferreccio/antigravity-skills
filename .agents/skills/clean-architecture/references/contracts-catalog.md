# Contracts Catalog

> Contracts are defined in the **inner layer**; implementations live in the **outer layer**.

## Domain Contracts (Level 1)

| Contract | Signature | Purpose |
|---|---|---|
| `IEntity<ID>` | `{ readonly id: ID; equals(other: IEntity<ID>): boolean }` | Identity-based equality |
| `IAggregateRoot<ID>` | `extends IEntity<ID>, IHasDomainEvents` | Transactional consistency boundary |
| `IValueObject` | `{ equals(other: IValueObject): boolean }` | Structural equality, immutable |
| `IDomainEvent` | `{ eventId: string; eventName: string; occurredOn: Date; aggregateId: string; payload: Record<string, unknown> }` | Something that happened in the domain |
| `IHasDomainEvents` | `{ domainEvents: IDomainEvent[]; clearEvents(): void }` | Aggregate event collection |
| `IDomainService` | `(marker interface)` | Stateless cross-entity logic |
| `IFactory<Input, Output>` | `{ create(input: Input): Output }` | Complex object construction |
| `ISpecification<T>` | `{ isSatisfiedBy(candidate: T): boolean }` | Business rule predicate |
| `ICompositeSpecification<T>` | `extends ISpecification<T> { and(other): this; or(other): this; not(): this }` | Combinable specification |
| `IRepository<T, ID>` | `extends IReadRepository<T, ID>, IWriteRepository<T, ID>` | Full aggregate persistence |
| `IReadRepository<T, ID>` | `{ findById(id: ID): Promise<T \| null>; findAll(): Promise<T[]> }` | Read-only access |
| `IWriteRepository<T, ID>` | `{ save(entity: T): Promise<void>; delete(id: ID): Promise<void> }` | Write-only access |
| `ISearchableRepository<T>` | `{ search(criteria: IFilterRequest): Promise<IPaginatedResult<T>> }` | Filtered search |
| `ITransactionManager` | `{ run<T>(work: () => Promise<T>): Promise<T> }` | Transaction boundary |
| `IUnitOfWork` | `{ commit(): Promise<void>; rollback(): Promise<void> }` | Aggregate transaction scope |
| `IAuditableEntity` | `{ createdAt: Date; updatedAt: Date; createdBy?: string; updatedBy?: string }` | Audit trail fields |
| `IVersionable` | `{ version: number }` | Optimistic concurrency control |
| `IMultiTenant` | `{ tenantId: string }` | Tenant isolation marker |

## Application Contracts (Level 2)

| Contract | Signature | Purpose |
|---|---|---|
| `IUseCase<Input, Output>` | `{ execute(input: Input): Promise<Output> }` | Single application action |
| `IApplicationService` | `(marker interface)` | Multi-step orchestration |
| `ISaga<Input, Output>` | `{ execute(input: Input): Promise<Output>; compensate(input: Input): Promise<void> }` | Distributed transaction with rollback |
| `ICommand` | `{ commandName: string; timestamp: Date; correlationId?: string }` | Write intent DTO |
| `ICommandHandler<TCmd, TResult>` | `{ handle(command: TCmd): Promise<TResult> }` | Command processor |
| `IQuery` | `{ queryName: string }` | Read intent DTO |
| `IQueryHandler<TQuery, TResult>` | `{ handle(query: TQuery): Promise<TResult> }` | Query processor |
| `IEventBus` | `{ publish(event: IDomainEvent): Promise<void>; subscribe<T>(handler: (e: T) => void): void }` | In-process domain event pub/sub |
| `IMessageBus` | `{ send(command: ICommand): Promise<void>; publish(event: IIntegrationEvent): Promise<void>; subscribe<T>(handler: (e: T) => void): void }` | Cross-service messaging |
| `IIntegrationEvent` | `{ eventId: string; eventName: string; occurredOn: Date; sourceContext: string; payload: Record<string, unknown> }` | Cross-context event |
| `IIntegrationEventHandler<T>` | `{ handle(event: T): Promise<void> }` | Integration event processor |
| `IValidator<T>` | `{ validate(input: T): IResult<void> }` | Input validation |
| `IPolicy<TContext>` | `{ evaluate(context: TContext): boolean }` | Authorization rule |
| `ICurrentUser` | `{ userId: string; roles: string[]; tenantId?: string }` | Authenticated user context |

### Service Ports (Application Layer)

| Port | Signature | Purpose |
|---|---|---|
| `IAuthorizationService` | `{ authorize(user: ICurrentUser, action: string, resource: string): Promise<boolean> }` | Permission check |
| `ICacheService` | `{ get<T>(key: string): Promise<T \| null>; set<T>(key: string, value: T, ttl?: number): Promise<void>; delete(key: string): Promise<void> }` | Caching abstraction |
| `IEmailService` | `{ send(to: string, subject: string, body: string): Promise<void> }` | Email delivery |
| `INotificationService` | `{ notify(userId: string, message: string, channel: string): Promise<void> }` | Push / in-app notifications |
| `IFileStorageService` | `{ upload(path: string, content: Buffer): Promise<string>; download(path: string): Promise<Buffer>; delete(path: string): Promise<void> }` | File persistence |
| `ITokenService` | `{ sign(payload: Record<string, unknown>): string; verify(token: string): Record<string, unknown> }` | JWT / token management |
| `IPasswordHasher` | `{ hash(plain: string): Promise<string>; compare(plain: string, hashed: string): Promise<boolean> }` | Password hashing |
| `IFeatureFlagService` | `{ isEnabled(flag: string, context?: Record<string, unknown>): boolean }` | Feature toggling |
| `IConfigurationService` | `{ get<T>(key: string): T }` | Runtime configuration |
| `IDateProvider` | `{ now(): Date }` | Testable clock |
| `IIdGenerator` | `{ generate(): string }` | Deterministic ID generation |

## Infrastructure Contracts (Level 3–4)

| Contract | Signature | Purpose |
|---|---|---|
| `IDatabaseConnection` | `{ connect(): Promise<void>; disconnect(): Promise<void>; isConnected(): boolean }` | DB lifecycle |
| `IMigration` | `{ up(): Promise<void>; down(): Promise<void> }` | Schema migration |
| `ISeeder` | `{ run(): Promise<void> }` | Data seeding |
| `IOutboxMessage` | `{ id: string; eventName: string; payload: string; createdAt: Date; processedAt?: Date }` | Reliable event delivery |
| `IInboxMessage` | `{ id: string; eventId: string; receivedAt: Date; processedAt?: Date }` | Idempotent event consumption |
| `IDistributedLock` | `{ acquire(key: string, ttl: number): Promise<boolean>; release(key: string): Promise<void> }` | Concurrency control |
| `IHealthCheck` | `{ check(): Promise<{ status: 'healthy' \| 'unhealthy'; details?: Record<string, unknown> }> }` | Service health |

## Presentation Contracts (Level 4)

| Contract | Signature | Purpose |
|---|---|---|
| `IController<TReq, TRes>` | `{ handle(request: TReq): Promise<TRes> }` | Request handler |
| `IMiddleware` | `{ handle(ctx: IRequestContext, next: () => Promise<void>): Promise<void> }` | Pipeline interceptor |
| `IHttpRequest` | `{ body: unknown; params: Record<string, string>; query: Record<string, string>; headers: Record<string, string> }` | Normalized HTTP input |
| `IHttpResponse` | `{ statusCode: number; body: unknown; headers?: Record<string, string> }` | Normalized HTTP output |
| `IRequestContext` | `{ request: IHttpRequest; user?: ICurrentUser; correlationId: string }` | Per-request context |

## Kernel / Shared Contracts (Level 0)

| Contract | Signature | Purpose |
|---|---|---|
| `IResult<T>` | `{ isSuccess: boolean; isFailure: boolean; value?: T; error?: IError }` | Monadic result |
| `IError` | `{ code: string; message: string; details?: Record<string, unknown> }` | Structured error |
| `IMapper<Domain, Persistence, DTO>` | `{ toDomain(raw: Persistence): Domain; toPersistence(domain: Domain): Persistence; toDTO(domain: Domain): DTO }` | Three-way mapping |
| `IPaginatedResult<T>` | `{ items: T[]; total: number; page: number; pageSize: number }` | Paginated response |
| `IPaginationRequest` | `{ page: number; pageSize: number }` | Pagination input |
| `IFilterRequest` | `{ filters: Record<string, unknown> }` | Dynamic filtering |
| `ISortingRequest` | `{ sortBy: string; sortOrder: 'asc' \| 'desc' }` | Sorting input |

## Cross-Cutting Contracts

| Contract | Signature | Purpose |
|---|---|---|
| `ILogger` | `{ debug, info, warn, error (message, meta?): void; child(ctx): ILogger }` | Structured logging |
| `IMetricsService` | `{ incrementCounter, recordHistogram, setGauge, startTimer (name, labels?): void }` | Observability metrics |
| `ITracingService` | `{ startSpan(name: string, parent?: ISpan): ISpan; endSpan(span: ISpan): void }` | Distributed tracing |
