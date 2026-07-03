# Example 3: Single File Review — order.entity.ts

## Context

An e-commerce platform using TypeScript with Clean Architecture. The user wants a deep review of a domain entity file, not in the context of a branch diff, but as a standalone quality assessment.

## User Input

```
revisa o arquivo src/domain/entities/order.entity.ts
```

## Expected Agent Behavior

### Phase 1: Index
- Detects file path → activates **single-file mode**
- No diff context — the entire file will be reviewed
- Reads the target file: `src/domain/entities/order.entity.ts`

### Phase 2: Detect
- Language: TypeScript
- Architecture: Clean Architecture (domain entity in core layer)
- Identifies imports and dependencies:
  ```
  src/domain/value-objects/money.vo.ts
  src/domain/enums/order-status.enum.ts
  src/domain/entities/order-item.entity.ts
  src/infra/database/enums/payment-status.enum.ts  ← suspicious import
  ```
- Reads all dependency files to understand context
- Complementary skills: `clean-architecture` (domain entity review)

### Phase 3: Dispatch
Agents launched (focused subset for single-file mode):
- ✅ architecture-reviewer (domain entity — layer compliance critical)
- ✅ simplicity-reviewer (complexity, readability)
- ✅ error-handling-reviewer (domain invariant enforcement)
- ❌ security-reviewer (no I/O or auth in entity)
- ❌ testing-reviewer (no test file — but will note absence)
- ❌ database-reviewer (not a DB file)
- ❌ frontend-reviewer (not a frontend file)

### Phase 4: Aggregate
- 3 agents complete
- Findings classified by severity
- Migration Plan generated (single-file mode exclusive feature)

### Phase 5: Present

```markdown
## Revisão de Arquivo — order.entity.ts

### Resumo
A entidade Order está na camada correta (`core/domain/`) e implementa invariantes de
domínio para transições de status e cálculo de total. Porém, há uma dependência direta
de um enum de infraestrutura que viola a regra de dependência, o método `calculateTotal()`
não considera edge cases de arredondamento monetário, e a entidade não possui testes
unitários dedicados.

**Linhas revisadas**: 142 | **Findings**: 1 Crítico, 2 Importantes, 3 Menores

---

### 🔴 Críticos (Deve Corrigir)

#### 1. Entidade de domínio importando enum de infraestrutura
- **File:** `src/domain/entities/order.entity.ts:4`
- **What:** The domain entity imports `PaymentStatusEnum` from `src/infra/database/enums/payment-status.enum.ts`. The domain layer depends on the infrastructure layer.
- **Why:** This violates the Dependency Rule of Clean Architecture — inner layers must never depend on outer layers. The domain entity should define its own enum or use a port/interface. This coupling means the entity cannot be used or tested without the database infrastructure.
- **Fix:**
```diff
- import { PaymentStatusEnum } from '../../infra/database/enums/payment-status.enum';
+ import { PaymentStatus } from '../enums/payment-status.enum';
```
Create `src/domain/enums/payment-status.enum.ts` with the domain-owned values:
```typescript
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}
```

---

### 🟡 Importantes (Deveria Corrigir)

#### 2. calculateTotal() usa aritmética de ponto flutuante para valores monetários
- **File:** `src/domain/entities/order.entity.ts:67-78`
- **What:** The `calculateTotal()` method uses JavaScript's native `number` type to sum item prices and apply discounts, which leads to floating-point precision errors (e.g., `0.1 + 0.2 !== 0.3`).
- **Why:** Monetary calculations must be exact. Using `number` for currency will eventually produce incorrect totals — a classic financial bug that is hard to detect in testing but causes real accounting discrepancies.
- **Fix:** Use the existing `Money` value object (already imported) for all arithmetic:
```typescript
calculateTotal(): Money {
  const subtotal = this.items.reduce(
    (sum, item) => sum.add(item.price.multiply(item.quantity)),
    Money.zero(this.currency),
  );
  return this.discount ? subtotal.subtract(this.discount) : subtotal;
}
```

#### 3. Invariante de transição de status não cobre todos os caminhos
- **File:** `src/domain/entities/order.entity.ts:89-105`
- **What:** The `transitionTo(status)` method validates some transitions (e.g., PENDING → PAID) but does not cover:
  - PAID → REFUNDED (allowed but missing)
  - CANCELLED → any state (should be terminal, but not enforced)
- **Why:** Missing transition rules mean invalid state changes can occur silently, leading to orders in inconsistent states. Every domain entity should enforce its invariants exhaustively.
- **Fix:** Define an explicit state machine:
```typescript
private static readonly ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.DRAFT]: [OrderStatus.PENDING, OrderStatus.CANCELLED],
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.REFUNDED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
  [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
  [OrderStatus.CANCELLED]: [],
};
```

---

### 🔵 Menores (Poderia Melhorar)

#### 4. Propriedade `createdAt` é mutável
- **File:** `src/domain/entities/order.entity.ts:12`
- **What:** `createdAt` is declared as `public createdAt: Date` instead of `public readonly createdAt: Date`. Nothing should modify the creation timestamp after instantiation.
- **Fix:** Add `readonly` modifier.

#### 5. Método `addItem()` não valida duplicatas
- **File:** `src/domain/entities/order.entity.ts:45`
- **What:** `addItem(item)` pushes to the items array without checking if an item with the same product ID already exists. This could lead to duplicate line items instead of incrementing quantity.
- **Fix:** Check for existing item and increment quantity, or throw if business rules require explicit separate items.

#### 6. Ausência de testes unitários para a entidade
- **File:** (missing file: `src/domain/entities/order.entity.spec.ts`)
- **What:** No dedicated unit test file exists for this core domain entity.
- **Note:** This is flagged as a Menor because it was not part of the user's request, but domain entities with business logic should always have comprehensive tests.

---

### ✅ Pontos Fortes
- Entity is correctly placed in `core/domain/` layer
- Uses Value Objects (`Money`) for monetary representation — good DDD practice
- Status transitions use a method (`transitionTo`) instead of direct property mutation
- Constructor enforces required fields — no invalid entities can be created
- Naming follows project conventions consistently

---

### 📋 Migration Plan

The following steps address all findings in order from lowest to highest risk:

| Step | Risk | Action | Impact |
|---|---|---|---|
| 1 | 🟢 Low | Add `readonly` to `createdAt` property | No behavioral change, compile-time safety only |
| 2 | 🟢 Low | Create `src/domain/entities/order.entity.spec.ts` with unit tests | No production code change, adds safety net |
| 3 | 🟡 Medium | Create `src/domain/enums/payment-status.enum.ts` and update import | Requires updating all consumers of the infra enum |
| 4 | 🟡 Medium | Add duplicate item check to `addItem()` | May change existing behavior — verify business rules first |
| 5 | 🟡 Medium | Complete the state machine in `transitionTo()` | May reject currently-accepted transitions — audit callers |
| 6 | 🔴 High | Refactor `calculateTotal()` to use `Money` value object | Changes return type and all callers — requires integration testing |

> **Recommendation:** Execute steps 1-2 immediately, steps 3-5 in a focused PR, and step 6 as a separate PR with thorough integration testing.
```
