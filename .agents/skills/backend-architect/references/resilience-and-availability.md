# High Availability, Resilience & Traffic Engineering

This reference defines the production readiness standards for keeping NestJS backends resilient against outages, memory exhaustion, traffic spikes, and cascading infrastructure failures.

---

## 1. Deep Health Probes with `@nestjs/terminus`

Never rely on a static `return { status: 'ok' }` endpoint. Kubernetes / ECS requires real liveness and readiness checks that monitor database pools, Redis brokers, memory thresholds, and disk space.

### Installation
```bash
npm install @nestjs/terminus
```

### Comprehensive Health Controller
```typescript
// presentation/controllers/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { DatabaseHealthIndicator } from '../../infrastructure/database/database-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DatabaseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly microservice: MicroserviceHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  checkLiveness() {
    // Fast lightweight check to confirm process is alive and not frozen
    return this.health.check([
      // Alert if V8 heap memory exceeds 250MB
      () => this.memory.checkHeap('memory_heap', 250 * 1024 * 1024),
      // Alert if total process RSS memory exceeds 500MB
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  checkReadiness() {
    // Readiness: Verify whether API can safely receive incoming traffic
    return this.health.check([
      () => this.db.pingCheck('postgres_database'),
      () =>
        this.microservice.pingCheck('redis_broker', {
          transport: Transport.REDIS,
          options: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
        }),
      // Verify root disk storage has at least 15% free space
      () => this.disk.checkStorage('disk_storage', { path: '/', thresholdPercent: 0.85 }),
    ]);
  }
}
```

---

## 2. Graceful Shutdown Protocol

When a container receives `SIGTERM` or `SIGINT`, in-flight HTTP requests and background jobs must complete before connections are severed.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable NestJS lifecycle shutdown hooks (OnModuleDestroy, BeforeApplicationShutdown)
  app.enableShutdownHooks();

  // 2. Set keep-alive timeouts to cooperate with Load Balancers (ALB, Nginx)
  const server = app.getHttpServer();
  server.keepAliveTimeout = 65000; // Greater than ALB 60s idle timeout
  server.headersTimeout = 66000;

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

Inside Database and Queue modules:
```typescript
@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log(`Received ${signal}. Draining database connections...`);
    await this.pool.end();
  }
}
```

---

## 3. Distributed Traffic Control & Rate Limiting (`@nestjs/throttler`)

Protect public APIs against credential stuffing, scraping, and volumetric denial of service. Store state in Redis so rate limits are shared consistently across horizontal replicas.

### Installation
```bash
npm install @nestjs/throttler @nest-lab/throttler-storage-redis ioredis
```

### Module Setup
```typescript
// infrastructure/security/security.module.ts
import { Module } from '@nestjs/common';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          { name: 'short', ttl: seconds(1), limit: 10 },    // 10 req/s burst limit
          { name: 'medium', ttl: seconds(60), limit: 200 }, // 200 req/min standard limit
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
          }),
        ),
      }),
    }),
  ],
})
export class SecurityModule {}
```

---

## 4. Crash Prevention & Memory Leak Defense

1. **Stream-based Processing**: Never load unbounded files or large database queries entirely into Node.js Buffer/RAM. Use Node.js Streams (`stream/promises` pipeline) or AsyncIterators:
   ```typescript
   // Avoid:
   const buffer = await file.toBuffer(); // OOM on 1GB file
   // Preferred:
   await pipeline(readableStream, transformStream, writeableDestination);
   ```
2. **Payload Size Boundaries**: Enforce strict limits on body parsing:
   ```typescript
   app.use(json({ limit: '1mb' }));
   app.use(urlencoded({ extended: true, limit: '1mb' }));
   ```
3. **Circuit Breakers with Jittered Retry**: For external 3rd-party HTTP or RPC integrations, wrap calls with circuit breakers (e.g. `cockatiel`) and exponential backoff with full jitter to avoid the thundering herd problem.
