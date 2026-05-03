# Level 1: Entities (Enterprise Business Rules)

## Definition
Entities encapsulate the most general and high-level business rules. They are the least likely to change when something external changes.

## Good Practices
- **Purity**: Should be pure data structures or objects with methods that only depend on other entities.
- **Independence**: Must not import anything from `Use Cases`, `Adapters`, or `Frameworks`.
- **Validation**: Business invariants should be validated within the entity (e.g., a "Price" entity cannot be negative).

## Bad Practices (Anti-patterns)
- Importing a database library (e.g., TypeORM) into an Entity.
- Adding UI-specific formatting logic.
- Using framework-specific decorators (e.g., `@Column`) — unless using a mapper to keep the domain entity clean.

## When to use
Use for concepts that exist even if the application didn't exist (e.g., "Account", "Transaction", "User").
