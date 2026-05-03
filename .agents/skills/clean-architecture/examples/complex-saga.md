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
