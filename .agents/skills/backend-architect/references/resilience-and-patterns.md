# Resilience, Distributed Patterns & Reliability

This reference details patterns for building highly resilient, distributed backend services with NestJS and Clean Architecture.

---

## 1. Result Pattern (`Result<T, E>`) for Explicit Control Flow

While unexpected failures (database down) should throw exceptions, expected domain failures (insufficient funds, product out of stock) are better modeled as typed return values using the **Result Pattern**:

```typescript
// domain/core/result.ts
export type Result<T, E> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  readonly isSuccess = true;
  readonly isFailure = false;
  constructor(public readonly value: T) {}
}

export class Failure<T, E> {
  readonly isSuccess = false;
  readonly isFailure = true;
  constructor(public readonly error: E) {}
}

export const ok = <T, E>(value: T): Result<T, E> => new Success(value);
export const fail = <T, E>(error: E): Result<T, E> => new Failure(error);
```

### Usage in Use Case:
```typescript
type WithdrawError = 'INSUFFICIENT_FUNDS' | 'ACCOUNT_LOCKED';

async execute(cmd: WithdrawCommand): Promise<Result<Transaction, WithdrawError>> {
  const account = await this.accountRepo.findById(cmd.accountId);
  if (account.isLocked) {
    return fail('ACCOUNT_LOCKED');
  }
  if (!account.hasBalance(cmd.amount)) {
    return fail('INSUFFICIENT_FUNDS');
  }
  account.withdraw(cmd.amount);
  await this.accountRepo.save(account);
  return ok(account.lastTransaction);
}
```

---

## 2. Transactional Outbox Pattern

To prevent dual-write inconsistencies between the database and message broker (e.g., Kafka, RabbitMQ, BullMQ), save domain events to an **Outbox Table** in the exact same database transaction as the aggregate state.

```
┌────────────────────────────────────────────────────────┐
│               DATABASE TRANSACTION                     │
│  1. INSERT INTO orders (...)                           │
│  2. INSERT INTO outbox_events (event_name, payload...) │
└────────────────────────────────────────────────────────┘
                           │
                           ▼ (Background Worker / CDC)
               Read pending outbox rows
                           │
                           ▼
               Publish to Kafka / RabbitMQ
                           │
                           ▼
               Mark outbox row as PROCESSED
```

---

## 3. Idempotency Key Handling

For payment, mutation, and creation endpoints, prevent duplicate processing using an `Idempotency-Key` header:

1. **Check**: Does `idempotency_keys` table have a record with `(user_id, idempotency_key)`?
   - If yes and status is `COMPLETED`, return the cached response payload immediately.
   - If yes and status is `PROCESSING`, return `409 Conflict` or wait.
2. **Execute**: If no, insert `(key, status = 'PROCESSING')`, run the Use Case, store response payload, and update status to `COMPLETED`.
