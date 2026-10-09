# Testing Engineering Strategy: Pure Unit, Testcontainers & E2E

Testing in Clean Architecture & NestJS must be multi-tiered, deterministic, and anti-tautological.

---

## 1. The Multi-Tier Testing Pyramid

```
       ▲
      / \     E2E Tests (Supertest + Test.createTestingModule)
     /   \    • Verifies HTTP transport, Pipes, Guards, and Filters
    /─────\
   /       \   Integration Tests (Testcontainers + Real DB)
  /         \  • Verifies Repositories, Migrations, SQL queries, Gateways
 /───────────\
/             \ Pure Unit Tests (Vitest / Jest — Zero Framework)
─────────────── • Verifies Domain Entities, Value Objects, and Use Cases
```

---

## 2. Tier 1: Pure Unit Tests (Domain & Use Cases)

### Principles:
- **Zero NestJS Dependency**: Never call `Test.createTestingModule()` for unit tests. It adds 500ms+ runtime bootstrap overhead per test file and obscures dependencies.
- **Instant Execution**: Unit tests should execute in <50ms.
- **In-Memory Fakes over Tautological Mocks**: When testing Use Cases, prefer an In-Memory Repository fake over `jest.fn()` with repetitive `mockResolvedValue()`.

### Example: Domain Entity Test (Triple AAA)
```typescript
// domain/entities/order.entity.spec.ts
import { describe, it, expect } from 'vitest';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Money } from '../value-objects/money.vo';

describe('Order Aggregate Root', () => {
  it('should calculate total amount correctly from items', () => {
    // Arrange
    const item1 = OrderItem.create({
      productId: 'prod-1',
      unitPrice: Money.create(100, 'BRL'),
      quantity: 2,
    });
    const item2 = OrderItem.create({
      productId: 'prod-2',
      unitPrice: Money.create(50, 'BRL'),
      quantity: 1,
    });

    // Act
    const order = Order.create({
      customerId: 'cust-123',
      items: [item1, item2],
    });

    // Assert
    expect(order.totalAmount.amount).toBe(250);
    expect(order.status).toBe('DRAFT');
  });

  it('should prevent marking an already shipped order as paid', () => {
    // Arrange
    const item = OrderItem.create({
      productId: 'prod-1',
      unitPrice: Money.create(100, 'BRL'),
      quantity: 1,
    });
    const order = Order.create({ customerId: 'cust-1', items: [item] });
    order.markAsPaid();
    (order as any)._status = 'SHIPPED'; // Simulate illegal state

    // Act & Assert
    expect(() => order.markAsPaid()).toThrow(/Cannot pay an order in status SHIPPED/);
  });
});
```

### Example: Use Case Test with In-Memory Fake
```typescript
// application/use-cases/create-order/create-order.use-case.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateOrderUseCase } from './create-order.use-case';
import { InMemoryOrderRepository } from '../../../../test/fakes/in-memory-order.repository';
import { FakePaymentGateway } from '../../../../test/fakes/fake-payment.gateway';

describe('CreateOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository;
  let paymentGateway: FakePaymentGateway;
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    paymentGateway = new FakePaymentGateway();
    useCase = new CreateOrderUseCase(orderRepository, paymentGateway);
  });

  it('should persist order and process payment', async () => {
    const result = await useCase.execute({
      customerId: 'cust-99',
      items: [{ productId: 'item-1', price: 100, quantity: 1 }],
    });

    expect(result.id).toBeDefined();
    expect(result.status).toBe('PAID');

    // Verify side effects via the fake
    const saved = await orderRepository.findById(result.id);
    expect(saved).not.toBeNull();
    expect(paymentGateway.chargedAmounts).toContain(100);
  });
});
```

---

## 3. Tier 2: Integration Tests with Testcontainers

Never mock your database in repository integration tests. Mocks cannot catch schema mismatches, syntax errors, transaction isolation issues, or foreign key violations.

```typescript
// infrastructure/persistence/prisma/prisma-order.repository.integration-spec.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { PrismaOrderRepository } from './prisma-order.repository';
import { Order } from '../../../../domain/entities/order.entity';
import { OrderItem } from '../../../../domain/entities/order-item.entity';
import { Money } from '../../../../domain/value-objects/money.vo';

describe('PrismaOrderRepository (Integration)', () => {
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaClient;
  let repository: PrismaOrderRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('test_db')
      .start();

    process.env.DATABASE_URL = container.getConnectionUri();
    prisma = new PrismaClient();
    await prisma.$connect();
    // Run migrations or prisma db push here
  }, 60000);

  afterAll(async () => {
    await prisma.$disconnect();
    await container.stop();
  });

  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    repository = new PrismaOrderRepository(prisma);
  });

  it('should save and retrieve an aggregate root with relations', async () => {
    const item = OrderItem.create({
      productId: 'p-1',
      unitPrice: Money.create(150, 'BRL'),
      quantity: 2,
    });
    const order = Order.create({ customerId: 'c-10', items: [item] });

    await repository.save(order);

    const retrieved = await repository.findById(order.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(order.id);
    expect(retrieved?.totalAmount.amount).toBe(300);
    expect(retrieved?.items.length).toBe(1);
  });
});
```

---

## 4. Tier 3: E2E Tests with `createTestingModule` & Supertest

E2E tests verify the HTTP layer: routing, validation pipes, guards, interceptors, and error serialization.

```typescript
// test/e2e/orders.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('OrdersController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /orders - should return 400 when body fails schema validation', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send({ customerId: '' }) // missing items
      .expect(400);

    expect(response.body.message).toBeDefined();
  });

  it('POST /orders - should return 201 on valid input', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send({
        customerId: 'cust-123',
        items: [{ productId: 'prod-1', price: 50, quantity: 2 }],
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('DRAFT');
  });
});
```
