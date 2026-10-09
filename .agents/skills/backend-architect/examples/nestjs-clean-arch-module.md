# Example: Complete NestJS Clean Architecture Module

This example demonstrates how to build a production-grade NestJS module following Clean Architecture and DDD without framework coupling in the domain.

---

## 1. Domain Layer (`domain/`)

```typescript
// domain/entities/user.entity.ts
export interface UserProps {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
}

export class User {
  private readonly _id: string;
  private _email: string;
  private _fullName: string;
  private _isActive: boolean;
  private readonly _createdAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._fullName = props.fullName;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
  }

  public static create(email: string, fullName: string): User {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address format');
    }
    if (!fullName || fullName.trim().length < 2) {
      throw new Error('Full name must be at least 2 characters long');
    }

    return new User({
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      isActive: true,
      createdAt: new Date(),
    });
  }

  public static reconstitute(props: UserProps): User {
    return new User(props);
  }

  public get id(): string { return this._id; }
  public get email(): string { return this._email; }
  public get fullName(): string { return this._fullName; }
  public get isActive(): boolean { return this._isActive; }
  public get createdAt(): Date { return this._createdAt; }

  public deactivate(): void {
    this._isActive = false;
  }
}
```

```typescript
// domain/repositories/user-repository.port.ts
import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

---

## 2. Application Layer (`application/`)

```typescript
// application/use-cases/create-user/create-user.command.ts
export interface CreateUserCommand {
  email: string;
  fullName: string;
}
```

```typescript
// application/use-cases/create-user/create-user.use-case.ts
import { UserRepositoryPort } from '../../../domain/repositories/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserCommand } from './create-user.command';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new Error(`User with email ${command.email} already exists`);
    }

    const user = User.create(command.email, command.fullName);
    await this.userRepository.save(user);
    return user;
  }
}
```

---

## 3. Infrastructure Layer (`infrastructure/`)

```typescript
// infrastructure/tokens/user.tokens.ts
export const USER_REPOSITORY_TOKEN = Symbol('USER_REPOSITORY_PORT');
```

```typescript
// infrastructure/persistence/prisma/prisma-user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserRepositoryPort } from '../../../domain/repositories/user-repository.port';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    if (!raw) return null;
    return User.reconstitute(raw);
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    if (!raw) return null;
    return User.reconstitute(raw);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      update: {
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      },
    });
  }
}
```

---

## 4. Presentation Layer & Nest Module (`presentation/` & `user.module.ts`)

```typescript
// presentation/controllers/user.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  fullName: string;
}

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
    };
  }
}
```

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { PrismaUserRepository } from './infrastructure/persistence/prisma/prisma-user.repository';
import { USER_REPOSITORY_TOKEN } from './infrastructure/tokens/user.tokens';
import { UserRepositoryPort } from './domain/repositories/user-repository.port';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepo: UserRepositoryPort) => new CreateUserUseCase(userRepo),
      inject: [USER_REPOSITORY_TOKEN],
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserModule {}
```
