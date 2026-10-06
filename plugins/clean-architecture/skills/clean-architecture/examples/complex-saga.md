# Example: Complex Checkout Saga

This example shows how the `clean-architecture` skill handles a high-complexity orchestration requirement.

## Scenario
The user wants to implement a Checkout process that involves:
1. Inventory Reservation.
2. Payment Processing.
3. Order Confirmation.

## Agent Reasoning (Internal)
- **Level**: Level 2.5 (Orchestrator/Saga).
- **Technique**: Least-to-Most Prompting.
- **Reference**: `references/orchestrators.md`.

## Proposed Solution

### 1. Architectural Analysis
- **Pattern**: Orchestrator (Saga).
- **Responsibility**: Coordinate `Inventory`, `Payment`, and `Notification` domains.
- **Boundary Check**: The Orchestrator will depend on interfaces (Ports) of these domains, not their implementations.

### 2. Implementation (Orchestrator)

```typescript
// .agents/skills/clean-architecture/examples/CheckoutSaga.ts

export class CheckoutSaga {
  constructor(
    private readonly inventory: InventoryPort,
    private readonly payment: PaymentPort,
    private readonly notifications: NotificationPort
  ) {}

  async execute(order: Order): Promise<void> {
    try {
      // Step 1: Reserve
      await this.inventory.reserve(order.items);

      // Step 2: Pay
      const paymentResult = await this.payment.process(order.total);

      if (!paymentResult.success) {
        throw new PaymentFailedError();
      }

      // Step 3: Notify
      await this.notifications.sendOrderConfirmation(order.user);

    } catch (error) {
      // COMPENSATION LOGIC
      if (error instanceof PaymentFailedError) {
        await this.inventory.release(order.items);
      }
      throw error;
    }
  }
}
```

### 3. Why it works (Portuguese)
- **Desacoplamento**: O `CheckoutSaga` não sabe se o pagamento é via Stripe ou se o estoque está no Postgres. Ele só conhece os `Ports`.
- **Resiliência**: A lógica de compensação (`release inventory`) garante que o sistema não fique em um estado inconsistente se o pagamento falhar.
- **Testabilidade**: Você pode testar toda essa lógica complexa passando mocks dos `Ports`, sem precisar de uma conexão real com a rede ou banco de dados.

### 4. Unit Tests (Triple AAA)

```typescript
// CheckoutSaga.spec.ts
import { describe, it, expect, vi } from 'vitest';

describe('CheckoutSaga', () => {
  // Test 1: Successful checkout
  it('should complete checkout when all steps succeed', async () => {
    // Arrange
    const inventory = { reserve: vi.fn().mockResolvedValue(undefined), release: vi.fn() };
    const payment = { process: vi.fn().mockResolvedValue({ success: true }) };
    const notifications = { sendOrderConfirmation: vi.fn().mockResolvedValue(undefined) };
    const saga = new CheckoutSaga(inventory, payment, notifications);
    const order = { items: ['item-1'], total: 100, user: 'user-1' };

    // Act
    await saga.execute(order);

    // Assert
    expect(inventory.reserve).toHaveBeenCalledWith(['item-1']);
    expect(payment.process).toHaveBeenCalledWith(100);
    expect(notifications.sendOrderConfirmation).toHaveBeenCalledWith('user-1');
    expect(inventory.release).not.toHaveBeenCalled();
  });

  // Test 2: Payment failure triggers compensation
  it('should release inventory when payment fails', async () => {
    // Arrange
    const inventory = { reserve: vi.fn().mockResolvedValue(undefined), release: vi.fn().mockResolvedValue(undefined) };
    const payment = { process: vi.fn().mockResolvedValue({ success: false }) };
    const notifications = { sendOrderConfirmation: vi.fn() };
    const saga = new CheckoutSaga(inventory, payment, notifications);
    const order = { items: ['item-1'], total: 100, user: 'user-1' };

    // Act & Assert
    await expect(saga.execute(order)).rejects.toThrow(PaymentFailedError);
    expect(inventory.release).toHaveBeenCalledWith(['item-1']);
    expect(notifications.sendOrderConfirmation).not.toHaveBeenCalled();
  });

  // Test 3: Compensation failure handling
  it('should propagate error when compensation also fails', async () => {
    // Arrange
    const inventory = {
      reserve: vi.fn().mockResolvedValue(undefined),
      release: vi.fn().mockRejectedValue(new Error('Release failed')),
    };
    const payment = { process: vi.fn().mockResolvedValue({ success: false }) };
    const notifications = { sendOrderConfirmation: vi.fn() };
    const saga = new CheckoutSaga(inventory, payment, notifications);
    const order = { items: ['item-1'], total: 100, user: 'user-1' };

    // Act & Assert
    // Note: In production, compensation failures should be logged and sent to a dead letter queue
    await expect(saga.execute(order)).rejects.toThrow();
  });
});
```

> **Por que mockar Ports torna isso testável?**
> Como o `CheckoutSaga` depende apenas de **interfaces** (`InventoryPort`, `PaymentPort`, `NotificationPort`) e não de implementações concretas, conseguimos substituir cada dependência por um mock simples usando `vi.fn()`. Isso elimina a necessidade de bancos de dados, filas de mensagens ou APIs externas nos testes. O resultado é um teste **rápido**, **determinístico** e **isolado** — exatamente o que o Clean Architecture promete ao inverter as dependências com a Dependency Rule.
