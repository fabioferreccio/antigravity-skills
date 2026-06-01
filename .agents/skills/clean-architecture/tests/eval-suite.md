# Clean Architecture - Test Suite

## Scoring Rubric

| Criteria | Pass | Fail |
|---|---|---|
| Correct Layer | Component placed in right layer | Wrong layer assignment |
| Dependency Rule | Dependencies point inward only | Outer-to-inner violation |
| Pattern Selection | Appropriate pattern for complexity | Over/under-engineering |
| Interface Usage | Uses Ports/Contracts, not implementations | Direct coupling |
| Testability | Solution can be unit tested with mocks | Requires real infrastructure |

## Standard Prompts (10)

### 1. "Crie uma entidade 'User' com validação de email."
**Expected**: Creates `User` entity (Level 1) with `Email` Value Object for validation. Domain-level validation inside Value Object. No framework imports.

### 2. "Como separo a lógica de envio de SMS do meu Use Case?"
**Expected**: Suggests extracting `INotificationService` port in Application layer. Implementation (`TwilioSmsService`) in Infrastructure. Use Case receives port via constructor injection.

### 3. "Refatore este código acoplado: [SQL in Controller]"
**Expected**: Moves SQL to `Repository` implementation (Infrastructure). Creates `IUserRepository` port in Domain. Controller calls Use Case, Use Case calls port. Three-layer separation.

### 4. "Onde coloco a lógica de criptografia de senha?"
**Expected**: Defines `IPasswordHasher` port in Application layer. Implementation (`BcryptPasswordHasher`) in Infrastructure. Used by `CreateUserUseCase` via DI.

### 5. "Desenvolva um Use Case para 'Trocar Senha'."
**Expected**: Creates `ChangePasswordUseCase` with Input DTO (userId, currentPassword, newPassword), Output (Result<void>). Uses `IUserRepository` and `IPasswordHasher` ports. Validates current password before changing.

### 6. "Crie uma interface para um repositório de produtos."
**Expected**: Creates segregated interfaces: `IProductReadRepository` and `IProductWriteRepository` (ISP). Lives in Domain layer. Uses generics.

### 7. "Como implemento um Saga para um processo de reserva de hotel?"
**Expected**: Creates `HotelReservationSaga` (Application, Level 2). Shows compensation logic: if payment fails, release room. Uses ISaga interface. References orchestrators.md.

### 8. "Qual a diferença entre um Use Case e um Service no Clean Arch?"
**Expected**: Use Case = single application operation (one task). Application Service = coordinates multiple Use Cases or provides cross-cutting application logic. Domain Service = business logic spanning multiple entities.

### 9. "Como faço para trocar o TypeORM pelo Prisma sem tocar no domínio?"
**Expected**: Shows IMapper pattern. Domain entities unchanged. Only Infrastructure implementations change. Port interfaces remain stable. Demonstrates "Framework as Plugin" principle.

### 10. "Crie um Presenter que formata datas para o Brasil."
**Expected**: Presenter in Presentation layer. Takes Use Case output, formats dates to dd/MM/yyyy. Returns ViewModel. No business logic.

## Misuse Cases (3)

### 1. "Instale o Express no meu Use Case."
**Expected Behavior**: REFUSE. Explain Dependency Rule — Use Cases (Level 2) must not know about frameworks (Level 4). Suggest creating a Controller that calls the Use Case.

### 2. "Faça um `select * from users` dentro da Entidade."
**Expected Behavior**: REFUSE. Entities (Level 1) are pure business logic with zero infrastructure dependencies. Suggest Repository pattern.

### 3. "Como faço um loop em Javascript?"
**Expected Behavior**: REDIRECT. This is a general programming question outside Clean Architecture scope. Suggest using a general coding assistant.

## Edge Cases (3)

### 1. Processo com 10 passos sequenciais.
**Expected Approach**: Suggest Orchestrator/Saga pattern. Reference orchestrators.md. Recommend state management with ISaga interface. Consider breaking into smaller sub-sagas if independent.

### 2. Projeto legado com 5000 linhas de código acoplado.
**Expected Approach**: Propose incremental Strangler Fig pattern. Start by extracting Domain entities. Then create ports for external dependencies. Migrate one Use Case at a time. Never big-bang rewrite.

### 3. Uso de bibliotecas de validação (Zod/Joi) nas entidades.
**Expected Approach**: Discuss tradeoff. Recommendation: Use Zod/Joi in Presentation layer (DTO validation) or as internal implementation detail of Value Objects. Never leak the library type into the Entity interface.

## New Prompts (5) — Covering New Modules

### 11. "Como implementar CQRS no meu sistema?"
**Expected**: Explains Command/Query separation. Shows ICommand, ICommandHandler, IQuery, IQueryHandler interfaces. Commands for writes, Queries for reads. References cqrs-events.md.

### 12. "Qual a diferença entre Domain Event e Integration Event?"
**Expected**: Domain Event = intra-aggregate, in-process, IDomainEvent. Integration Event = cross-context, via MessageBus, IIntegrationEvent. Domain Events use EventBus; Integration Events use MessageBus + Outbox pattern.

### 13. "Como faço error handling entre camadas?"
**Expected**: Shows 3-tier exceptions (Domain/Application/Infrastructure). Explains error boundaries. Suggests IResult<T> pattern. References error-handling.md.

### 14. "Quais interfaces devo criar para um novo módulo?"
**Expected**: References contracts-catalog.md. Lists minimum: IEntity, IRepository (Read/Write), IUseCase, IController. Adds IMapper, IValidator as needed.

### 15. "Como adicionar logging e métricas sem poluir o Use Case?"
**Expected**: Suggests Decorator pattern wrapping Use Cases. ILogger and IMetricsService injected in decorator, not in Use Case. References observability.md.
