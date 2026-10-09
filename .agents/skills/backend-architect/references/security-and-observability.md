# Security, Observability & Production Readiness

This reference covers security hardening and observability standards for enterprise NestJS backends.

---

## 1. Authentication & Role-Based Access Control (RBAC)

Use metadata decorators and decoupled Guards:

```typescript
// presentation/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return user && requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

---

## 2. Structured Logging with Correlation IDs (Pino)

Every request must carry a unique `x-correlation-id` that propagates across logs, database calls, and outgoing HTTP requests.

Use `nestjs-pino` with JSON formatting:

```typescript
// In main.ts or AppModule
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => req.headers['x-correlation-id'] || crypto.randomUUID(),
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        redact: ['req.headers.authorization', 'req.body.password', 'req.body.creditCard'],
      },
    }),
  ],
})
export class AppModule {}
```

---

## 3. Production Health Checks (Terminus)

Expose standard `/health` probes for Kubernetes liveness and readiness:

```typescript
// presentation/controllers/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, PrismaHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', prismaClient),
    ]);
  }
}
```
