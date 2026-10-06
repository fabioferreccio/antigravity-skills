# Testing Strategy in Clean Architecture

Testing is the primary driver of Clean Architecture. If it's hard to test, the architecture is wrong.

## 1. Test Types & Placement

### Unit Tests (Fast & Isolated)
- **Target**: Entities and Value Objects (Level 1).
- **Placement**: Next to the file (e.g., `User.ts` -> `User.spec.ts`).
- **Mocking**: Zero mocks needed. Domain logic is pure.
- **TDD Pattern**: Red -> Green -> Refactor.

### Integration Tests (Focused)
- **Target**: Use Cases (Level 2) and Adapters (Level 3).
- **Placement**: In a `tests/integration` folder or next to the Use Case.
- **Mocking**: Mock external boundaries (Ports/Interfaces).
- **Goal**: Ensure the Use Case orchestrates entities and ports correctly.

### E2E Tests (Real World)
- **Target**: Frameworks & Drivers (Level 4).
- **Placement**: Separate `tests/e2e` folder.
- **Mocking**: Minimal. Uses a real (or containerized) database and HTTP calls.
- **Goal**: Validate the entire flow from Request to Response.

---

## 2. Triple AAA (Arrange, Act, Assert)
A standard for writing clean and readable tests.

- **Arrange**: Set up the environment (Inputs, Mocks, Objects).
- **Act**: Execute the specific method/function being tested.
- **Assert**: Verify the result or the side effect.

---

## 3. TDD (Test-Driven Development)
In Clean Arch, TDD is used to define the **Ports** (Interfaces) before the **Adapters**.

1. **Test**: Write a test for a Use Case that doesn't exist yet.
2. **Interface**: Define the Port needed for the Use Case.
3. **Code**: Implement the Use Case logic.
4. **Refactor**: Clean up the logic and interfaces.

---

## 4. Testability Matrix

| Layer | Complexity | Speed | Tool |
|---|---|---|---|
| Domain | Low | Instant | Vitest / Jest |
| Application | Medium | Fast | Vitest (with Mocks) |
| Infrastructure | High | Slow | Testcontainers / Supertest |
| Presentation | Medium | Medium | Supertest / Playwright |
