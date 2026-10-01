# Anti-Tautological Testing & Layer Differentiation Doctrine

This reference guides the detection and elimination of **tautological tests** and enforces clear boundaries between **Unit** and **Integration** testing layers.

---

## 1. What is a Tautological Test?

A test is **tautological** when it simply repeats the implementation details of the code under test instead of verifying observable behavior or invariants:

```
TAUTOLOGICAL FAILURE MODE:
Code: function add(a, b) { return helper(a, b); }
Test: Mock helper -> call add(1, 2) -> assert helper was called with (1, 2).
Result: The test passes 100% of the time, but if helper() has a bug, the test doesn't notice!
If helper() is refactored or inlined, the test fails even though functionality is intact!
```

### Hallmarks of Tautological Tests
1. **Mock-to-Assertion Imbalance**: 80% of lines are test mock setups (`mockRepo.save.mockResolvedValue(...)`), and the assertion only verifies `expect(mockRepo.save).toHaveBeenCalled()`.
2. **Implementation Mirroring**: The test mirrors line-by-line the internal statements of the function.
3. **Zero Invariant Validation**: The test does not verify business rules, boundary values, error conditions, or return states.

---

## 2. Test Layer Differentiation: Unit vs. Integration

To avoid over-mocking in unit tests and under-testing in integration tests, adhere to strict responsibilities per layer:

| Dimension | Unit Testing Layer (Isolated) | Integration Testing Layer (Behavioral) |
|---|---|---|
| **Primary Scope** | Pure domain logic, entities, value objects, algorithms, state transitions | Cross-module flows, database queries, ORM mapping, network boundaries, transactions |
| **Real vs. Mock** | Zero or minimal mocks (use pure objects, real domain entities) | Real infrastructure or faithful in-memory equivalents (Testcontainers, in-memory SQLite) |
| **Speed & Determinism** | Microseconds, 100% deterministic in memory | Milliseconds/seconds, isolated environment |
| **Failure Indication** | A domain rule, calculation, or boundary condition was violated | A contract, database constraint, lock, or wire serialization failed |
| **Responsibility** | Answers: *"Is our business logic logically sound?"* | Answers: *"Does the real system work when wired together?"* |

---

## 3. Practical Refactoring Patterns

### Pattern A: Over-Mocked Unit Test $\to$ Pure Domain Test
- ❌ **Anti-pattern**:
  ```typescript
  test('creates order', async () => {
    const mockRepo = { save: jest.fn() };
    const service = new OrderService(mockRepo);
    await service.createOrder({ items: [{ price: 10 }] });
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });
  ```
- ✅ **Refactored Unit Test**:
  Test the domain entity/aggregate directly for calculations, discounts, and invariants:
  ```typescript
  test('calculates total with discount and enforces state transition', () => {
    const order = Order.create({ items: [{ price: 100 }] });
    order.applyCoupon(new Coupon('SAVE10', 0.10));
    expect(order.total).toBe(90);
    expect(order.status).toBe(OrderStatus.PENDING);
  });
  ```

### Pattern B: Mocked Repository $\to$ Real Integration Test
- Move repository/query tests to integration test files (`*.integration.test.ts`):
  ```typescript
  describe('OrderRepository (Integration)', () => {
    it('persists order with foreign key constraints in database', async () => {
      const order = Order.create({ ... });
      await orderRepo.save(order);
      const persisted = await orderRepo.findById(order.id);
      expect(persisted).toEqual(order);
    });
  });
  ```
