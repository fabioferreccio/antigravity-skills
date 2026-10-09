# Redis Engineering: Caching, Pub/Sub & BullMQ Background Processing

This reference establishes standards for high-performance Redis integration in NestJS backends, covering multi-tier caching, distributed locking, distributed event broadcasting, and background processing with BullMQ.

---

## 1. Enterprise Redis Caching Architecture

Caching should never be placed blindly inside domain entities. Caching belongs to the **Infrastructure Layer** implementing a Port or decorating an Application Use Case/Repository.

### Installation
```bash
npm install cache-manager @nestjs/cache-manager ioredis
npm install @keyv/redis
```

### Connection Configuration with Reconnection Strategy
```typescript
// infrastructure/cache/redis.config.ts
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import Redis from 'ioredis';

export const redisCacheConfig: CacheModuleAsyncOptions = {
  useFactory: () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: false,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
        return targetErrors.some((e) => err.message.includes(e));
      },
    });

    return {
      stores: [new KeyvRedis(redis)],
      ttl: 60 * 1000, // Default 60 seconds
    };
  },
};
```

### Cache-Aside Pattern with Automatic Invalidation
```typescript
// infrastructure/cache/cached-user.repository.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CachedUserRepository implements UserRepositoryPort {
  constructor(
    @Inject('DATABASE_USER_REPOSITORY')
    private readonly innerRepo: UserRepositoryPort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findById(id: string): Promise<User | null> {
    const cacheKey = `users:${id}`;
    const cached = await this.cacheManager.get<string>(cacheKey);

    if (cached) {
      return User.reconstitute(JSON.parse(cached));
    }

    const user = await this.innerRepo.findById(id);
    if (user) {
      // 5-minute TTL
      await this.cacheManager.set(cacheKey, JSON.stringify(user.toJSON()), 300 * 1000);
    }

    return user;
  }

  async save(user: User): Promise<void> {
    await this.innerRepo.save(user);
    // Invalidate cache immediately on update
    await this.cacheManager.del(`users:${user.id}`);
  }
}
```

---

## 2. Background Jobs & Queues with BullMQ (`@nestjs/bullmq`)

For asynchronous heavy workloads (emails, media processing, report generation, webhooks), use BullMQ with concurrency limits, exponential backoff, and Dead Letter Queues (DLQ).

### Installation
```bash
npm install @nestjs/bullmq bullmq
```

### Module Registration
```typescript
// infrastructure/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrderProcessingConsumer } from './order-processing.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: 'order-processing',
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000, // 2s, 4s, 8s, 16s...
        },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    }),
  ],
  providers: [OrderProcessingConsumer],
  exports: [BullModule],
})
export class JobsModule {}
```

### Robust Consumer with Dead-Letter Handling
```typescript
// infrastructure/jobs/order-processing.consumer.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

export interface ProcessOrderJobPayload {
  orderId: string;
  correlationId: string;
}

@Processor('order-processing', { concurrency: 5 })
export class OrderProcessingConsumer extends WorkerHost {
  constructor(private readonly logger: PinoLogger) {
    super();
    this.logger.setContext(OrderProcessingConsumer.name);
  }

  async process(job: Job<ProcessOrderJobPayload>): Promise<void> {
    this.logger.assign({
      jobId: job.id,
      orderId: job.data.orderId,
      correlationId: job.data.correlationId,
      attempt: job.attemptsMade + 1,
    });

    this.logger.info(`Processing job ${job.name} (Attempt ${job.attemptsMade + 1} of ${job.opts.attempts})`);

    // Execute application use case
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ProcessOrderJobPayload>, error: Error) {
    this.logger.error(
      { jobId: job.id, orderId: job.data.orderId, err: error },
      `Job failed on attempt ${job.attemptsMade}/${job.opts.attempts}`
    );

    // If final attempt exhausted, send to Dead Letter Queue or trigger Ops Alert
    if (job.attemptsMade >= (job.opts.attempts || 1)) {
      this.logger.fatal(
        { jobId: job.id, orderId: job.data.orderId },
        'DEAD LETTER ALERT: Job permanently failed after max retries.'
      );
    }
  }
}
```

---

## 3. Distributed Pub/Sub vs Microservices Transport

- **Lightweight Notifications / WebSockets**: Use `ioredis` Pub/Sub (`redis.publish('channel', payload)` and `subscriber.subscribe('channel')`).
- **Inter-Service Event-Driven Architecture**: Use `@nestjs/microservices` with Redis transport or Redis Streams to support consumer groups and persistent offset delivery:

```typescript
// main.ts (Hybrid Microservice + HTTP API)
const app = await NestFactory.create(AppModule);
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    retryAttempts: 5,
    retryDelay: 3000,
  },
});
await app.startAllMicroservices();
await app.listen(3000);
```
