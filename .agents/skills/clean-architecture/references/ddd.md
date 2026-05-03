# DDD (Domain-Driven Design) Concepts

Clean Architecture works best when combined with DDD tactical patterns.

## 1. Aggregates & Aggregate Roots
- **Concept**: A cluster of domain objects that can be treated as a single unit. The **Aggregate Root** is the only gateway into the aggregate.
- **Rule**: All database operations must go through the Aggregate Root.

## 2. Value Objects
- **Concept**: Objects that have no identity and are defined by their attributes (e.g., `Money`, `CPF`, `Email`).
- **Benefit**: Encapsulates validation logic and prevents "Primitive Obsession".

## 3. Bounded Contexts
- **Concept**: A clear boundary within which a particular domain model applies.
- **Example**: A "Product" in the `Catalog` context is different from a "Product" in the `Inventory` context.

## 4. Domain Events
- **Concept**: Something that happened in the domain which you want other parts of the system to know about (e.g., `OrderPaidEvent`).
- **Mechanism**: The Entity/Use Case publishes the event; a Subscriber (in another context) handles it.

## 5. Domain Services
- **Concept**: Logic that doesn't naturally fit into a single Entity but belongs to the Domain (e.g., `TransferService` involving two Accounts).
