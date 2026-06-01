# Clean Architecture Anti-Patterns

Before/after examples of common violations. Each pattern includes the fix and rationale.

---

## 1. SQL in Controller

❌ **Before** — Controller contains raw SQL:
```typescript
app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users WHERE active = true');
  res.json(users);
});
```

✅ **After** — Controller delegates to Use Case, which calls a Repository Port:
```typescript
app.get('/users', async (req, res) => {
  const users = await getActiveUsersUseCase.execute();
  res.json(users);
});
```

**Why**: Controllers belong to Presentation (Level 4). Data access belongs to Infrastructure, accessed via Application-layer ports.

---

## 2. Business Logic in Repository

❌ **Before** — Discount calculation lives in SQL:
```typescript
async findDiscountedProducts(): Promise<Product[]> {
  return this.db.query('SELECT *, price * 0.9 AS final FROM products WHERE vip = true');
}
```

✅ **After** — Domain Service calculates, Repository only persists:
```typescript
// Domain Service
applyVipDiscount(product: Product): Product {
  return product.applyDiscount(0.1);
}
```

**Why**: Business rules belong in the Domain. Repositories are data-access adapters, not decision-makers.

---

## 3. Framework Decorators on Entities

❌ **Before** — ORM decorators leak into Domain:
```typescript
@Entity() export class User {
  @Column() name: string;
  @PrimaryGeneratedColumn() id: number;
}
```

✅ **After** — Separate ORM model + Mapper:
```typescript
// Domain Entity (pure)
export class User extends Entity<UserId> { constructor(public readonly name: string) { super(); } }
// Infrastructure: UserOrmModel + IMapper<User, UserOrmModel>
```

**Why**: Domain Entities must not depend on infrastructure frameworks. Use `IMapper<Domain, Persistence>` at the boundary.

---

## 4. God Use Case (CRUD)

❌ **Before** — One Use Case handles all operations:
```typescript
class UserUseCase {
  create(dto) { /* ... */ }
  findById(id) { /* ... */ }
  update(id, dto) { /* ... */ }
  delete(id) { /* ... */ }
}
```

✅ **After** — Split by responsibility (SRP):
```typescript
class CreateUserUseCase implements IUseCase<CreateUserInput, UserOutput> { /* ... */ }
class GetUserUseCase implements IUseCase<string, UserOutput> { /* ... */ }
```

**Why**: Each Use Case represents a single user intent. Combining them creates a God Class that violates SRP and grows unboundedly.

---

## 5. Leaked Abstractions

❌ **Before** — Use Case returns a Prisma model:
```typescript
async execute(id: string): Promise<PrismaUser> {
  return this.prisma.user.findUnique({ where: { id } });
}
```

✅ **After** — Use Case returns a Domain Entity, mapped at the boundary:
```typescript
async execute(id: string): Promise<User> {
  return this.userRepository.findById(UserId.create(id));
}
```

**Why**: Returning vendor-specific types couples consumers to infrastructure. The Application layer must only expose Domain types or DTOs.

---

## 6. Scattered Authorization

❌ **Before** — Role checks duplicated everywhere:
```typescript
if (user.role === 'ADMIN') { /* allow */ }
// repeated in 20 Use Cases
```

✅ **After** — Centralized policy evaluation:
```typescript
interface IPolicy<TContext> { evaluate(ctx: TContext): boolean; }
class AdminOnlyPolicy implements IPolicy<UserContext> { /* ... */ }
// Use Case: this.policy.evaluate(context);
```

**Why**: Authorization is a cross-cutting concern. Scattering it leads to inconsistencies and security gaps.

---

## 7. Hardcoded Dependencies

❌ **Before** — Use Case instantiates its own dependency:
```typescript
class CreateUserUseCase {
  private repo = new PrismaUserRepo();
}
```

✅ **After** — Constructor injection via port:
```typescript
class CreateUserUseCase {
  constructor(private readonly repo: IUserRepository) {}
}
```

**Why**: Violates DIP. The Use Case now depends on an abstraction, making it testable and swappable.

---

## 8. Anemic Domain Model

❌ **Before** — Entity is a data bag, all logic in external services:
```typescript
class Order { items: Item[]; status: string; }
// Service: if (order.status === 'PENDING') order.status = 'CONFIRMED';
```

✅ **After** — Rich Entity with behavior and invariant validation:
```typescript
class Order extends Entity<OrderId> {
  confirm(): void {
    if (this.status !== OrderStatus.PENDING) throw new InvalidOrderStateError();
    this.status = OrderStatus.CONFIRMED;
  }
}
```

**Why**: Domain logic belongs inside the Entity. Anemic models turn Entities into DTOs and push business rules into services, violating encapsulation.
