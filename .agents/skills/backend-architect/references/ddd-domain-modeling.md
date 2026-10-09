# Domain-Driven Design (DDD) Tactical Patterns in TypeScript

This reference defines how to build expressive, rich Domain Models in TypeScript, avoiding anemic models and ensuring strict boundary integrity.

---

## 1. Entities vs. Value Objects vs. Aggregates

| Building Block | Identity | Mutability | Structural Equality | Invariants |
|---|---|---|---|---|
| **Value Object** | None | Immutable | By value/attributes | Validated upon instantiation |
| **Entity** | Unique ID (`UUID`/ULID) | Controlled mutations | By ID | Invariants enforced by methods |
| **Aggregate Root** | Global Unique ID | Root entity controls cluster | By Root ID | Transactional consistency boundary |

---

## 2. Implementing Value Objects

A Value Object has no distinct identity. If two Value Objects have the same attributes, they are equal.

```typescript
// domain/value-objects/money.vo.ts
export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a 3-letter ISO code');
    }
  }

  public static create(amount: number, currency = 'BRL'): Money {
    return new Money(amount, currency.toUpperCase());
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  public equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
```

---

## 3. Implementing Aggregate Roots with Invariants

An Aggregate Root protects domain invariants. External consumers cannot mutate its internal child entities directly.

```typescript
// domain/entities/order.entity.ts
import { Money } from '../value-objects/money.vo';
import { OrderItem } from './order-item.entity';
import { DomainEvent } from '../events/domain-event.interface';
import { OrderCreatedEvent } from '../events/order-created.event';

export type OrderStatus = 'DRAFT' | 'PAID' | 'SHIPPED' | 'CANCELLED';

export interface OrderProps {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
}

export class Order {
  private readonly _id: string;
  private readonly _customerId: string;
  private _items: OrderItem[];
  private _status: OrderStatus;
  private readonly _createdAt: Date;
  private _domainEvents: DomainEvent[] = [];

  private constructor(props: OrderProps) {
    this._id = props.id;
    this._customerId = props.customerId;
    this._items = props.items;
    this._status = props.status;
    this._createdAt = props.createdAt;
  }

  public static create(props: { customerId: string; items: OrderItem[] }): Order {
    if (!props.customerId) {
      throw new Error('Order must belong to a valid customer');
    }
    if (!props.items || props.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const order = new Order({
      id: crypto.randomUUID(),
      customerId: props.customerId,
      items: [...props.items],
      status: 'DRAFT',
      createdAt: new Date(),
    });

    order.addDomainEvent(new OrderCreatedEvent(order.id, order.customerId));
    return order;
  }

  public get id(): string { return this._id; }
  public get customerId(): string { return this._customerId; }
  public get items(): ReadonlyArray<OrderItem> { return this._items; }
  public get status(): OrderStatus { return this._status; }

  public get totalAmount(): Money {
    return this._items.reduce(
      (acc, item) => acc.add(item.subtotal),
      Money.create(0, 'BRL'),
    );
  }

  public markAsPaid(): void {
    if (this._status !== 'DRAFT') {
      throw new Error(`Cannot pay an order in status ${this._status}`);
    }
    this._status = 'PAID';
  }

  public cancel(reason: string): void {
    if (this._status === 'SHIPPED') {
      throw new Error('Shipped orders cannot be cancelled');
    }
    this._status = 'CANCELLED';
  }

  public addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
```

---

## 4. Preventing the Anemic Domain Model Anti-Pattern

### ❌ Anemic Model (Anti-Pattern):
```typescript
// Just getters/setters with public mutable state and no invariants
export class Order {
  public id: string;
  public status: string;
  public total: number;
}
// Business logic leaked all over services:
if (order.status === 'DRAFT') {
  order.status = 'PAID';
}
```

### ✅ Rich Domain Model (Clean DDD):
- State is encapsulated (`private`).
- Mutations happen via explicit, intent-revealing domain methods (`order.markAsPaid()`).
- Invariants are verified before state changes.
- Invalid state transitions throw domain exceptions.
