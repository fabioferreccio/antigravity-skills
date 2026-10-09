# Example: TDD Unit and Integration Test Suite

This example demonstrates how to implement a pure unit test (fast, no framework) and an integration test with Testcontainers for database persistence.

---

## 1. Pure Unit Test (Vitest / Jest)

Zero NestJS runtime bootstrap, zero mock inflation.

```typescript
// test/unit/create-user.use-case.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateUserUseCase } from '../../src/modules/users/application/use-cases/create-user/create-user.use-case';
import { UserRepositoryPort } from '../../src/modules/users/domain/repositories/user-repository.port';
import { User } from '../../src/modules/users/domain/entities/user.entity';

// Lightweight In-Memory Fake Repository
class InMemoryUserRepository implements UserRepositoryPort {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email.toLowerCase().trim()) return user;
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}

describe('CreateUserUseCase (Unit Test)', () => {
  let userRepo: InMemoryUserRepository;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(userRepo);
  });

  it('should create and persist a new user when email is unique', async () => {
    // Act
    const user = await useCase.execute({
      email: 'john@example.com',
      fullName: 'John Doe',
    });

    // Assert
    expect(user.id).toBeDefined();
    expect(user.email).toBe('john@example.com');
    expect(user.fullName).toBe('John Doe');
    expect(user.isActive).toBe(true);

    // Verify side effect in repository
    const stored = await userRepo.findById(user.id);
    expect(stored).not.toBeNull();
  });

  it('should reject duplicate email registration with a domain error', async () => {
    // Arrange
    await useCase.execute({
      email: 'duplicate@example.com',
      fullName: 'First User',
    });

    // Act & Assert
    await expect(
      useCase.execute({
        email: 'duplicate@example.com',
        fullName: 'Second User',
      }),
    ).rejects.toThrow(/already exists/);
  });
});
```

---

## 2. Integration Test with Real PostgreSQL (Testcontainers)

Validates actual SQL queries, primary key constraints, and mapper transformations.

```typescript
// test/integration/prisma-user-repository.integration-spec.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { PrismaUserRepository } from '../../src/modules/users/infrastructure/persistence/prisma/prisma-user.repository';
import { User } from '../../src/modules/users/domain/entities/user.entity';

describe('PrismaUserRepository (Integration with Testcontainers)', () => {
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaClient;
  let repository: PrismaUserRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('test_db')
      .withUsername('postgres')
      .withPassword('postgres')
      .start();

    const databaseUrl = container.getConnectionUri();
    process.env.DATABASE_URL = databaseUrl;

    // Run migrations inside the disposable container
    execSync('npx prisma db push --skip-generate', { env: { ...process.env, DATABASE_URL: databaseUrl } });

    prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    await prisma.$connect();
    repository = new PrismaUserRepository(prisma);
  }, 60000);

  afterAll(async () => {
    await prisma.$disconnect();
    await container.stop();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should save and retrieve a reconstituted domain entity', async () => {
    const user = User.create('alice@domain.com', 'Alice Smith');
    await repository.save(user);

    const retrieved = await repository.findByEmail('alice@domain.com');

    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(user.id);
    expect(retrieved?.email).toBe('alice@domain.com');
    expect(retrieved?.fullName).toBe('Alice Smith');
    expect(retrieved?.isActive).toBe(true);
  });
});
```
