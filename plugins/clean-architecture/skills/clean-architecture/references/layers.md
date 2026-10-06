# Layer Division & Boundaries

## The Concentric Circles
Clean Architecture is often divided into layers. While names vary, the behavior remains constant:

### 1. Domain Layer (The Core)
- **Content**: Entities, Value Objects, Domain Services, Domain Exceptions.
- **Rule**: NO dependencies on any other layer. This is the heart of the system.
- **Goal**: Pure business logic that survives any tech change.

### 2. Application Layer (The Orchestration)
- **Content**: Use Cases, Orchestrators, Sagas, Request/Response DTOs (Data Transfer Objects).
- **Rule**: Depends ONLY on the Domain layer.
- **Goal**: Implement the user stories and application-specific flows.

### 3. Infrastructure Layer (The External World)
- **Content**: Repositories implementations, DB Mappers, External Service Clients (HTTP/SDK), Framework configs.
- **Rule**: Depends on Application and Domain.
- **Goal**: Handle all technical details.

### 4. Presentation Layer (The Entrypoint)
- **Content**: Controllers, CLI handlers, Event Subscribers.
- **Rule**: Depends on Application.
- **Goal**: Receive input, convert to DTO, and trigger a Use Case.

---

## What goes where? (Checklist)
- **SQL Query**: Infrastructure.
- **Validation of a field format**: Presentation (DTO) or Domain (Value Object).
- **Summing two transaction values**: Domain.
- **Checking if a user exists before creating**: Application.
- **Sending an email**: Infrastructure (calling a port).
