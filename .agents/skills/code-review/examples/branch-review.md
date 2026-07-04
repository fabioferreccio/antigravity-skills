# Example 1: Branch Review — feature/add-payment-gateway

## Context

E-commerce monolith migrating to Clean Architecture with NestJS + TypeScript. The team is adding a new payment gateway integration. The branch touches use cases, repositories, controllers, and DTOs.

## User Input

```
revisa meu branch feature/add-payment-gateway
```

## Expected Agent Behavior

### Phase 1: Index
- Detects branch name `feature/add-payment-gateway`
- Runs `git diff origin/main...origin/feature/add-payment-gateway --name-only` to list changed files
- Builds or loads project index (languages, frameworks, structure)

### Phase 2: Detect
- Languages: TypeScript
- Frameworks: NestJS, Prisma
- Architecture: Clean Architecture (detected via directory structure and existing patterns)
- Complementary skills: `clean-architecture` (available and relevant)
- Changed files:
  ```
  src/core/use-cases/payment/create-payment.use-case.ts
  src/core/use-cases/payment/create-payment.use-case.spec.ts
  src/core/ports/payment-gateway.port.ts
  src/infra/gateways/stripe/stripe-gateway.adapter.ts
  src/infra/database/repositories/payment.repository.ts
  src/presentation/controllers/payment.controller.ts
  src/presentation/dtos/create-payment.dto.ts
  prisma/migrations/20250115_add_payments/migration.sql
  ```

### Phase 3: Dispatch
Agents launched (based on files touched):
- ✅ architecture-reviewer (Clean Architecture files detected)
- ✅ security-reviewer (payment processing = high security relevance)
- ✅ simplicity-reviewer (always launched)
- ✅ testing-reviewer (spec file present, validates coverage)
- ✅ database-reviewer (Prisma migration detected)
- ❌ frontend-reviewer (no frontend files changed)
- ❌ api-contracts-reviewer (no OpenAPI files changed)
- ❌ i18n-reviewer (no i18n files changed)
- ✅ error-handling-reviewer (payment flow requires robust error handling)

### Phase 4: Aggregate
- 6 agents complete in parallel
- Findings are merged and deduplicated
- Cross-agent conflicts resolved (architecture-reviewer and simplicity-reviewer both flagged line 8 → architecture-reviewer wins on dependency violations)
- Pre-existing issues separated from new issues
- Severity classification applied

### Phase 5: Present

```markdown
## Revisão de Código — feature/add-payment-gateway

### Resumo
A implementação do novo gateway de pagamento segue as convenções do projeto em sua maior
parte, com boa separação entre adapter e port. Porém, há uma violação de camada crítica
no use case, falta cobertura de testes para cenários de erro do gateway, e o tratamento
de erros no controller não diferencia falhas de validação de falhas de infraestrutura.

**Arquivos revisados**: 8 | **Findings**: 2 Críticos, 3 Importantes, 2 Menores

---

### 🔴 Críticos (Deve Corrigir)

#### 1. Use case importando diretamente do Prisma
- **File:** `src/core/use-cases/payment/create-payment.use-case.ts:8`
- **What:** Use case imports `PrismaService` directly instead of using the repository interface
- **Why:** Violates Clean Architecture dependency rule — the domain/application layer must not depend on infrastructure. This creates tight coupling and makes the use case untestable without a database.
- **Fix:**
```diff
- import { PrismaService } from '../../infra/database/prisma.service';
+ import { IPaymentRepository } from '../../core/ports/payment.repository';
```
- 💬 ```suggestion
import { IPaymentRepository } from '../../core/ports/payment.repository';
```

#### 2. Stripe secret key hardcoded in adapter
- **File:** `src/infra/gateways/stripe/stripe-gateway.adapter.ts:12`
- **What:** Stripe API key is hardcoded as a string literal in the adapter constructor
- **Why:** Secrets in source code are a critical security vulnerability. The key will be committed to version control and exposed to anyone with repository access.
- **Fix:**
```diff
- private readonly stripeKey = 'sk_test_1234567890abcdef';
+ constructor(
+   @Inject('STRIPE_SECRET_KEY') private readonly stripeKey: string,
+ ) {}
```
- 💬 ```suggestion
constructor(
  @Inject('STRIPE_SECRET_KEY') private readonly stripeKey: string,
) {}
```

---

### 🟡 Importantes (Deveria Corrigir)

#### 3. Testes não cobrem cenários de falha do gateway
- **File:** `src/core/use-cases/payment/create-payment.use-case.spec.ts`
- **What:** Test suite only covers the happy path (successful payment creation). No tests for gateway timeout, declined card, invalid amount, or network failure.
- **Why:** Payment flows are critical paths — untested failure scenarios will cause unhandled errors in production. At minimum, test: gateway throws, gateway returns declined, invalid input.
- **Fix:** Add test cases:
```typescript
it('should throw PaymentDeclinedError when gateway declines', async () => {
  gatewayMock.charge.mockRejectedValue(new GatewayDeclinedError());
  await expect(useCase.execute(validInput)).rejects.toThrow(PaymentDeclinedError);
});

it('should throw GatewayTimeoutError when gateway times out', async () => {
  gatewayMock.charge.mockRejectedValue(new TimeoutError());
  await expect(useCase.execute(validInput)).rejects.toThrow(GatewayTimeoutError);
});
```

#### 4. Controller catch-all swallows error context
- **File:** `src/presentation/controllers/payment.controller.ts:34`
- **What:** Controller wraps the entire use case call in a generic `try/catch` that returns `500` for all errors, including validation failures that should return `400` or `422`.
- **Why:** Clients cannot distinguish between "invalid input" and "server error", making debugging and UX significantly harder.
- **Fix:** Use NestJS exception filters or differentiate error types:
```typescript
try {
  return await this.createPayment.execute(dto);
} catch (error) {
  if (error instanceof ValidationError) throw new BadRequestException(error.message);
  if (error instanceof PaymentDeclinedError) throw new UnprocessableEntityException(error.message);
  throw new InternalServerErrorException('Payment processing failed');
}
```

#### 5. Migration adds NOT NULL column without DEFAULT
- **File:** `prisma/migrations/20250115_add_payments/migration.sql:14`
- **What:** Column `gateway_reference` is defined as `VARCHAR(255) NOT NULL` without a `DEFAULT` value
- **Why:** If the `payments` table has existing rows, this migration will fail. Even on a new table, it is safer to provide a default or make the column nullable initially.
- **Fix:** Add `DEFAULT ''` or make nullable and backfill later.

---

### 🔵 Menores (Poderia Melhorar)

#### 6. DTO class name inconsistent with project convention
- **File:** `src/presentation/dtos/create-payment.dto.ts:3`
- **What:** DTO is named `CreatePaymentBody` but all other DTOs in the project use the `*Dto` suffix (e.g., `CreateOrderDto`, `UpdateUserDto`)
- **Fix:** Rename to `CreatePaymentDto` for consistency.

#### 7. Unused import in repository
- **File:** `src/infra/database/repositories/payment.repository.ts:2`
- **What:** `Injectable` is imported from `@nestjs/common` but never used (the class uses `@Injectable()` from line 1's import)
- **Fix:** Remove the duplicate import.

---

### ✅ Pontos Fortes
- Gateway adapter correctly implements the `IPaymentGateway` port interface
- DTOs use class-validator decorators for input validation
- Repository follows the existing project pattern with proper abstraction
- Use case spec file was created alongside the use case (good TDD discipline)
- Prisma migration includes both up and down operations

---

Quer que eu poste esses comentários inline no MR/PR?
```
