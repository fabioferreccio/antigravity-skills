# NestJS Clean Architecture & Decoupled IoC Blueprint

This guide defines how to structure NestJS applications using strict Clean Architecture and Hexagonal (Ports & Adapters) principles without coupling business logic to framework decorators.

---

## 1. Directory Structure by Bounded Context

For each domain module (e.g., `orders`, `users`, `billing`), organize files as follows:

```
src/modules/orders/
├── domain/                         # Pure TypeScript — ZERO external dependencies
│   ├── entities/
│   │   ├── order.entity.ts
│   │   └── order-item.entity.ts
│   ├── value-objects/
│   │   ├── order-id.vo.ts
│   │   ├── money.vo.ts
│   │   └── order-status.vo.ts
│   ├── events/
│   │   └── order-created.event.ts
│   ├── exceptions/
│   │   └── invalid-order-state.exception.ts
│   └── repositories/
│       └── order-repository.port.ts  # Port interface
│
├── application/                    # Application orchestration & Use Cases
│   ├── use-cases/
│   │   ├── create-order/
│   │   │   ├── create-order.use-case.ts
│   │   │   ├── create-order.command.ts
│   │   │   └── create-order.result.ts
│   │   └── get-order-details/
│   │       ├── get-order-details.query.ts
│   │       └── get-order-details.use-case.ts
│   └── ports/                      # Outbound ports (gateways, message bus)
│       ├── payment-gateway.port.ts
│       └── event-publisher.port.ts
│
├── infrastructure/                 # Adapters, ORMs, External SDKs
│   ├── persistence/
│   │   ├── prisma/
│   │   │   ├── prisma-order.repository.ts
│   │   │   └── order-persistence.mapper.ts
│   │   └── typeorm/                # Alternative ORM implementation
│   ├── gateways/
│   │   └── stripe-payment.gateway.ts
│   └── tokens/
│       └── order.tokens.ts         # Symbol injection tokens
│
├── presentation/                   # HTTP / gRPC / WebSockets
│   ├── controllers/
│   │   └── order.controller.ts
│   ├── dtos/
│   │   ├── create-order-request.dto.ts
│   │   └── order-response.dto.ts
│   └── filters/
│       └── order-exception.filter.ts
│
└── order.module.ts                 # NestJS DI wiring module
```

---

## 2. Decoupled Inversion of Control (IoC) Pattern

### The Golden Rule
**Domain Entities and Use Cases must NEVER import `@Injectable()` from `@nestjs/common`.**

Framework decorators inside application use cases couple your business core to a single runtime. Instead, wire dependencies in the NestJS module layer using **Explicit Injection Tokens**.

### Step 1: Define Injection Tokens
Define constant symbols or strings in `infrastructure/tokens/order.tokens.ts`:

```typescript
export const ORDER_REPOSITORY_TOKEN = Symbol('ORDER_REPOSITORY_PORT');
export const PAYMENT_GATEWAY_TOKEN = Symbol('PAYMENT_GATEWAY_PORT');
export const EVENT_PUBLISHER_TOKEN = Symbol('EVENT_PUBLISHER_PORT');
```

### Step 2: Pure TypeScript Use Case
The Use Case is a plain TypeScript class with constructor-injected dependencies:

```typescript
// application/use-cases/create-order/create-order.use-case.ts
import { OrderRepositoryPort } from '../../../domain/repositories/order-repository.port';
import { PaymentGatewayPort } from '../../ports/payment-gateway.port';
import { CreateOrderCommand } from './create-order.command';
import { Order } from '../../../domain/entities/order.entity';

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const order = Order.create({
      customerId: command.customerId,
      items: command.items,
    });

    await this.paymentGateway.charge(order.id, order.totalAmount);
    order.markAsPaid();

    await this.orderRepository.save(order);
    return order;
  }
}
```

### Step 3: Wire Providers in `order.module.ts`
Use NestJS `useFactory` or `useClass` providers:

```typescript
// order.module.ts
import { Module } from '@nestjs/common';
import { OrderController } from './presentation/controllers/order.controller';
import { CreateOrderUseCase } from './application/use-cases/create-order/create-order.use-case';
import { PrismaOrderRepository } from './infrastructure/persistence/prisma/prisma-order.repository';
import { StripePaymentGateway } from './infrastructure/gateways/stripe-payment.gateway';
import {
  ORDER_REPOSITORY_TOKEN,
  PAYMENT_GATEWAY_TOKEN,
} from './infrastructure/tokens/order.tokens';
import { OrderRepositoryPort } from './domain/repositories/order-repository.port';
import { PaymentGatewayPort } from './application/ports/payment-gateway.port';

@Module({
  controllers: [OrderController],
  providers: [
    // Infrastructure Adapters bound to Tokens
    {
      provide: ORDER_REPOSITORY_TOKEN,
      useClass: PrismaOrderRepository,
    },
    {
      provide: PAYMENT_GATEWAY_TOKEN,
      useClass: StripePaymentGateway,
    },

    // Application Use Cases injected via Factory
    {
      provide: CreateOrderUseCase,
      useFactory: (
        orderRepo: OrderRepositoryPort,
        paymentGateway: PaymentGatewayPort,
      ) => new CreateOrderUseCase(orderRepo, paymentGateway),
      inject: [ORDER_REPOSITORY_TOKEN, PAYMENT_GATEWAY_TOKEN],
    },
  ],
  exports: [ORDER_REPOSITORY_TOKEN],
})
export class OrderModule {}
```

---

## 3. Controller Thinness & Exception Boundaries

Controllers must be strictly thin:
1. Validate incoming HTTP payload structure (via Pipes / Zod / class-validator).
2. Delegate to the Use Case.
3. Map domain result to the response DTO.
4. Let global Exception Filters translate domain exceptions into RFC 7807 HTTP errors.

```typescript
// presentation/controllers/order.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order/create-order.use-case';
import { CreateOrderRequestDto } from '../dtos/create-order-request.dto';
import { OrderResponseDto } from '../dtos/order-response.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrderRequestDto): Promise<OrderResponseDto> {
    const order = await this.createOrderUseCase.execute(dto.toCommand());
    return OrderResponseDto.fromDomain(order);
  }
}
```
