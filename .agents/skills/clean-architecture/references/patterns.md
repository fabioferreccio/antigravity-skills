# Design Patterns in Clean Architecture

## 1. Factories
- **Role**: Creating complex objects (Entities or Aggregates) while hiding the creation logic.
- **Types**:
  - **Domain Factory**: Inside Level 1, creates entities from raw data.
  - **Infrastructure Factory**: Inside Level 4, creates complex database clients.

## 2. Strategy Pattern
- **Role**: Switching between different algorithms or providers at runtime.
- **Example**: Choosing between `PixPayment`, `CreditCardPayment`, and `BoletoPayment`.

## 3. Decorators
- **Role**: Adding cross-cutting concerns (Logging, Caching, Transactions) without polluting the Use Case.
- **Example**: A `TransactionDecorator` that wraps a Use Case and commits/rollbacks the DB transaction.

## 4. Mappers
- **Role**: Transforming data between layers.
- **Constraint**: Mappers should live in the **Outer Layer** (e.g., `InfraMapper` converts DB Model -> Entity).
