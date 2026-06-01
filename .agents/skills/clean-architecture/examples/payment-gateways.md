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

## 5. Unit Tests (Triple AAA)

```typescript
// PaymentStrategyFactory.spec.ts
import { describe, it, expect, vi } from 'vitest';

describe('PaymentStrategyFactory', () => {
  // Test 1: Pix selects CentralBank
  it('should select CentralBank provider for Pix payments', () => {
    // Arrange
    const centralBank = { process: vi.fn() };
    const providers = new Map([['CentralBank', centralBank]]);
    const factory = new PaymentStrategyFactory(providers);
    const method = PaymentMethod.create('PIX');
    const amount = Amount.create(50);

    // Act
    const provider = factory.getProvider(method, amount);

    // Assert
    expect(provider).toBe(centralBank);
  });

  // Test 2: High-value card selects Adyen
  it('should select Adyen for high-value card payments', () => {
    // Arrange
    const adyen = { process: vi.fn() };
    const providers = new Map([['Adyen', adyen]]);
    const factory = new PaymentStrategyFactory(providers);
    const method = PaymentMethod.create('CREDIT_CARD');
    const amount = Amount.create(10000); // high value

    // Act
    const provider = factory.getProvider(method, amount);

    // Assert
    expect(provider).toBe(adyen);
  });

  // Test 3: Default fallback
  it('should fallback to Stone for small card payments', () => {
    // Arrange
    const stone = { process: vi.fn() };
    const providers = new Map([['Stone', stone]]);
    const factory = new PaymentStrategyFactory(providers);
    const method = PaymentMethod.create('CREDIT_CARD');
    const amount = Amount.create(25); // small value

    // Act
    const provider = factory.getProvider(method, amount);

    // Assert
    expect(provider).toBe(stone);
  });
});
```

> **Por que Strategy + Factory facilita testes e extensão?**
> O padrão **Strategy** encapsula cada algoritmo de roteamento de pagamento atrás de uma interface comum (`IPaymentProvider`), enquanto o **Factory** centraliza a lógica de seleção em um único ponto. Nos testes, basta injetar um `Map` com mocks — sem instanciar SDKs reais. Para extensão, adicionar um novo provedor (ex.: `CryptoAdapter`) exige apenas criar a implementação e registrá-la no `Map`, sem alterar o `PaymentSaga` ou qualquer Use Case existente. Isso é o **Open/Closed Principle** em ação.
