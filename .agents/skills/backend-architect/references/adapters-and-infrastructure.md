# Adapters & Infrastructure: Data Mappers, ORMs & HTTP Boundaries

This guide details the implementation of clean adapters that bridge the Domain/Application layers with databases, external APIs, and HTTP transports.

---

## 1. The Data Mapper Pattern (ORM $\leftrightarrow$ Domain)

In Clean Architecture, database tables and models belong to the **Infrastructure Layer**. Domain Entities must NEVER be annotated with ORM decorators (such as `@Entity()` from TypeORM or Prisma generated client types).

Use a dedicated **Mapper** to translate between both worlds:

```typescript
// infrastructure/persistence/prisma/order-persistence.mapper.ts
import { Order as PrismaOrderModel, OrderItem as PrismaItemModel } from '@prisma/client';
import { Order } from '../../../domain/entities/order.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { Money } from '../../../domain/value-objects/money.vo';

type PrismaOrderWithItems = PrismaOrderModel & { items: PrismaItemModel[] };

export class OrderPersistenceMapper {
  public static toDomain(raw: PrismaOrderWithItems): Order {
    const items = raw.items.map((item) =>
      OrderItem.create({
        productId: item.productId,
        unitPrice: Money.create(item.unitPrice, item.currency),
        quantity: item.quantity,
      }),
    );

    // Reconstitute Aggregate Root using private constructor or reconstitution method
    return Order.reconstitute({
      id: raw.id,
      customerId: raw.customerId,
      items,
      status: raw.status as any,
      createdAt: raw.createdAt,
    });
  }

  public static toPersistence(entity: Order) {
    return {
      id: entity.id,
      customerId: entity.customerId,
      status: entity.status,
      createdAt: entity.createdAt,
      items: {
        create: entity.items.map((item) => ({
          productId: item.productId,
          unitPrice: item.unitPrice.amount,
          currency: item.unitPrice.currency,
          quantity: item.quantity,
        })),
      },
    };
  }
}
```

---

## 2. Global Exception Filter (Domain Exceptions to RFC 7807)

Domain and Application layers throw explicit Domain Exceptions (`EntityNotFoundException`, `BusinessRuleViolationException`, `UnauthorizedOperationException`).

A NestJS Global Filter captures them and serializes them into standardized HTTP responses without leaking internal stack traces:

```typescript
// presentation/filters/domain-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain.exception';
import { EntityNotFoundException } from '../../domain/exceptions/entity-not-found.exception';
import { BusinessRuleViolationException } from '../../domain/exceptions/business-rule-violation.exception';

@Catch()
export class GlobalDomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalDomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Internal Server Error';
    let detail = 'An unexpected error occurred';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof EntityNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      title = 'Not Found';
      detail = exception.message;
      code = 'ENTITY_NOT_FOUND';
    } else if (exception instanceof BusinessRuleViolationException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      title = 'Unprocessable Entity';
      detail = exception.message;
      code = 'BUSINESS_RULE_VIOLATION';
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      title = 'Domain Validation Error';
      detail = exception.message;
      code = 'DOMAIN_ERROR';
    } else {
      this.logger.error('Unhandled exception caught in filter', exception);
    }

    response.status(status).json({
      type: `https://api.domain.com/errors/${code.toLowerCase()}`,
      title,
      status,
      detail,
      code,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## 3. Transaction Management (Unit of Work Port)

When a Use Case modifies multiple aggregates or requires atomicity across databases and outbox events, define a `UnitOfWorkPort` in the Application layer:

```typescript
// application/ports/unit-of-work.port.ts
export interface UnitOfWorkPort {
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
```

And implement it using Prisma `$transaction` or TypeORM `QueryRunner` in Infrastructure:

```typescript
// infrastructure/persistence/prisma/prisma-unit-of-work.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UnitOfWorkPort } from '../../../application/ports/unit-of-work.port';

@Injectable()
export class PrismaUnitOfWork implements UnitOfWorkPort {
  constructor(private readonly prisma: PrismaClient) {}

  async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async () => {
      return await work();
    });
  }
}
```
