# Deep Modules in Clean Architecture

This reference guides the design of **Deep Modules** within Clean Architecture, preventing the common failure mode where strict layer separation degrades into **Shallow Module Sprawl**.

---

## 1. Core Principle: Depth vs. Surface Area

Inspired by John Ousterhout (*A Philosophy of Software Design*):

> **A module is "deep" when it provides substantial, powerful functionality behind a narrow, simple interface.**
> **A module is "shallow" when its interface is relatively complex compared to the small amount of functionality it implements.**

```
DEEP MODULE (High Leverage)             SHALLOW MODULE (Low Leverage)
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│     Narrow Public Interface     │     │     Wide / Verbose Interface    │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│                                 │     │                                 │
│   Rich Business Invariants      │     │   Pass-through to Repository    │
│   Validation & Orchestration    │     │   (Just 3 lines of code)        │
│   State Transitions             │     │                                 │
│   Complex Calculation Logic     │     │                                 │
│                                 │     └─────────────────────────────────┘
│                                 │
└─────────────────────────────────┘
```

---

## 2. The Danger of "Shallow Pass-Throughs" in Agentic Code

AI agents frequently generate Clean Architecture boilerplate without real substance:
1. `create-user.controller.ts` (unpacks request body)
2. `create-user.use-case.ts` (simply does `return this.repo.save(dto)`)
3. `user.repository.interface.ts` (1 method)
4. `user.repository.impl.ts` (simply calls ORM)
5. `user.entity.ts` (anemic bag of getters/setters)
6. `user.dto.ts` + `user.mapper.ts` (identical field remapping)

**Negative Consequences**:
- **Token Inflation**: The AI assistant must read 6 files to understand a trivial operation.
- **Tautological Tests**: Testing the use case requires mocking the repository just to assert that `save()` was called with the arguments passed in.
- **Cognitive Exhaustion**: PR reviewers must inspect 6 separate files for a single field change.

---

## 3. Heuristics for Deep Use Cases & Entities

### Heuristic 1: The "Why Does This Exist?" Test
If a Use Case has zero business rules, zero domain events, zero authorization checks, zero transaction boundaries, and zero data transformation:
- **Do not create an empty pass-through Use Case**.
- Group related lifecycle operations into a **Cohesive Domain Service or Aggregate Root**.

### Heuristic 2: Rich Domain Entities (Anti-Anemia)
- Move business rules and state validation **into the Entity or Value Object**.
- Prevent external code from mutating entity state directly without invariants:
  ```typescript
  // ❌ Shallow / Anemic Entity:
  class Order {
    public status: string;
    public items: OrderItem[];
  }
  // Caller must manually validate rules:
  if (order.status === 'SHIPPED') throw new Error();
  order.status = 'CANCELLED';

  // ✅ Deep Entity with Invariant Protection:
  class Order {
    private _status: OrderStatus;
    private _items: OrderItem[];

    public cancel(reason: string): Result<void, DomainError> {
      if (this._status === OrderStatus.SHIPPED) {
        return Result.fail(new OrderAlreadyShippedError(this.id));
      }
      this._status = OrderStatus.CANCELLED;
      this.recordEvent(new OrderCancelledEvent(this.id, reason));
      return Result.ok();
    }
  }
  ```

### Heuristic 3: High Leverage Interfaces
Keep interfaces focused on the caller's true intent, not internal implementation mechanics:
- **Bad (Shallow)**: Exposing 15 individual database queries on a repository interface.
- **Good (Deep)**: Exposing aggregate-oriented state retrieval and atomic persistence operations.
