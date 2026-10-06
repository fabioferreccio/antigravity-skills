# Observability in Clean Architecture

Cross-cutting concerns that span all layers. Interfaces live in a Shared Kernel or cross-cutting module. Implementations live in Infrastructure. Injected via DI — never imported directly.

## 1. Logging (`ILogger`)

Structured, leveled logging with child context propagation.

```typescript
interface ILogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
  child(context: Record<string, unknown>): ILogger;
}
```

### Where to Log per Layer

| Layer | What to Log | Frequency |
|---|---|---|
| Domain | Domain events raised (via event handler, not inline) | Rarely |
| Application | Use Case start/end, input summary, errors, result status | Always |
| Infrastructure | External calls (URL, latency, status), retries, circuit breaker state | Always |
| Presentation | Request method + path, response status, duration | Always |

- Use `child()` to create scoped loggers carrying `correlationId`, `userId`, `tenantId`.

## 2. Metrics (`IMetricsService`)

Counters, histograms, and gauges for runtime observability.

```typescript
interface IMetricsService {
  incrementCounter(name: string, labels?: Record<string, string>): void;
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void;
  setGauge(name: string, value: number, labels?: Record<string, string>): void;
  startTimer(name: string, labels?: Record<string, string>): () => void;
}
```

- **Counters**: Total requests, errors, events published.
- **Histograms**: Use Case execution time, external call latency.
- **Gauges**: Active DB connections, queue depth.
- `startTimer` returns a stop function — call it when the operation completes.

## 3. Tracing (`ITracingService`)

Distributed tracing spans following OpenTelemetry conventions.

```typescript
interface ITracingService {
  startSpan(name: string, parent?: ISpan): ISpan;
  endSpan(span: ISpan): void;
}
interface ISpan {
  traceId: string;
  spanId: string;
  setAttribute(key: string, value: string | number | boolean): void;
}
```

- Create a span per Use Case execution, per external call, and per message handler.
- Propagate `traceId` through `correlationId` in Commands and Events.

## 4. Integration Strategy: Decorator Pattern

Add observability without polluting Use Case code. Wrap the real Use Case with a decorator:

```typescript
class LoggedUseCase<I, O> implements IUseCase<I, O> {
  constructor(private inner: IUseCase<I, O>, private logger: ILogger) {}
  async execute(input: I): Promise<O> {
    this.logger.info('UseCase started', { input });
    const result = await this.inner.execute(input);
    this.logger.info('UseCase completed');
    return result;
  }
}
```

Register decorators in the DI container — the Use Case itself remains clean.

## 5. Good Practices

- Use structured logging (JSON) with consistent field names across all services.
- Always include `correlationId` in every log entry and span.
- Configure log levels per environment: `debug` in dev, `info` in staging, `warn` in production.
- Use the Decorator pattern to add logging/metrics/tracing without modifying Use Cases.

## 6. Anti-Patterns

- ❌ Logging PII, secrets, tokens, or passwords — even at `debug` level.
- ❌ Excessive logging inside Domain Entities — the Domain should be side-effect-free.
- ❌ Metrics without labels — unlabeled metrics are useless for filtering and alerting.
- ❌ Synchronous tracing calls that block the main thread or degrade latency.
- ❌ Importing a concrete logger (e.g., `import winston`) inside Application or Domain layers.
