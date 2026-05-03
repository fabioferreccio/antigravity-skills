# Level 2: Use Cases (Application Business Rules)

## Definition
Use Cases orchestrate the flow of data to and from entities, and direct those entities to use their enterprise-wide business rules to achieve the goals of the use case.

## Good Practices
- **Single Responsibility**: One Use Case per task (e.g., `CreateUserUseCase`, `processPaymentUseCase`).
- **Input/Output Ports**: Define clear interfaces for the data coming in and going out.
- **Independence**: Must not know about the database or UI. It calls **Interfaces** (Ports) that are implemented by the outer layers.

## Bad Practices (Anti-patterns)
- A single Use Case that handles Create, Read, Update, and Delete (CRUD).
- Calling a Web API directly from the Use Case.
- Handling HTTP response codes (e.g., returning 404). Return custom exceptions instead.

## Single Use Case Example
```typescript
interface CreateUserPort {
  execute(data: CreateUserDTO): Promise<User>;
}
```
