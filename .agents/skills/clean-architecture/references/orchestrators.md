# Level 2.5: Orchestrators & Sagas

## Definition
When a business process involves multiple Use Cases or spans across multiple microservices/modules, a standard Use Case becomes too complex. We escalate to an **Orchestrator** or **Saga**.

## Use Case vs. Orchestrator vs. Saga

| Type | Responsibility | Complexity |
|---|---|---|
| **Use Case** | Single operation on one or more entities. | Low |
| **Orchestrator** | Coordinating multiple Use Cases to achieve a higher-level goal. | Medium |
| **Saga** | Managing long-running, distributed transactions with compensation logic. | High |

## When to Escalate
- **Multiple Use Cases**: If `UseCase A` needs to wait for `UseCase B` and `UseCase C` to finish.
- **Transactional Integrity**: If `Step 1` succeeds but `Step 2` fails, you need to "undo" `Step 1` (Compensation).
- **External Events**: If the process depends on an asynchronous callback from an external system.

## Good Practices
- **Idempotency**: Ensure that running the orchestrator twice doesn't cause side effects.
- **State Management**: Sagas should track the current state of the process (e.g., `PAYMENT_PENDING`, `ORDER_SHIPPED`).
- **Decoupling**: The Orchestrator calls Use Case interfaces, not implementations.

## Saga Pattern Example (Compensation)
1. `ReserveInventoryUseCase.execute()`
2. `ProcessPaymentUseCase.execute()`
3. If `ProcessPayment` fails -> `ReleaseInventoryUseCase.execute()` (Compensation).
