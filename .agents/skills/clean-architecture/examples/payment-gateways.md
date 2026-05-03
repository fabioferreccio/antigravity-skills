# Example: Multi-Acquirer Payment Gateway System

This example demonstrates how to handle Pix, Credit Card, Boleto, TED, DOC, and Cashless using Clean Architecture, SOLID, and the Strategy Pattern.

## Scenario
A fintech needs a payment engine that supports:
- **Methods**: Pix, Card, Boleto, TED, DOC.
- **Acquirers**: Adyen, Stripe, PagSeguro, Stone (Cashless).
- **Rule**: The system must decide which acquirer to use based on cost and availability.

## 1. Domain (Level 1)
- **Entities**: `Payment`, `Transaction`.
- **Value Objects**: `Amount`, `PaymentMethod`, `Currency`.
- **Contract**: `IPaymentProvider` (Interface).

## 2. Application (Level 2)
- **Orchestrator**: `PaymentSaga`.
- **Strategy**: `PaymentStrategyFactory`.

```typescript
// PaymentStrategyFactory.ts (Application Layer)
export class PaymentStrategyFactory {
  constructor(private providers: Map<string, IPaymentProvider>) {}

  getProvider(method: PaymentMethod, amount: Amount): IPaymentProvider {
    if (method.isPix()) return this.providers.get('CentralBank');
    if (method.isCard() && amount.isHigh()) return this.providers.get('Adyen');
    return this.providers.get('Stone'); // Default for Cashless/Small cards
  }
}
```

## 3. Infrastructure (Level 4 - Plugins)
- **StripeAdapter**: Implements `IPaymentProvider`.
- **AdyenAdapter**: Implements `IPaymentProvider`.
- **PixAdapter**: Handles the Central Bank API.

## 4. Why it works (Senior Analysis)
- **OCP (SOLID)**: To add a new method like "Crypto", you just create a new `CryptoAdapter` and update the `Factory`. The `PaymentSaga` never changes.
- **DIP (SOLID)**: The `PaymentSaga` depends on `IPaymentProvider` (Contract), not on `StripeSDK`.
- **DDD**: `Payment` is an **Aggregate Root**. It publishes a `PaymentAuthorized` event after success.
- **Modular RAG**: If the AI is working on this example, it loads `patterns.md` for the Factory logic and `orchestrators.md` for the Saga logic.
