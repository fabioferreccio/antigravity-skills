# Security, Observability & Compliance Engineering

This reference establishes standards for enterprise-grade observability, end-to-end distributed tracing with OpenTelemetry, contextual structured logging with Pino, and strict regulatory compliance (LGPD, GDPR, PCI DSS) for NestJS applications.

---

## 1. Contextual Structured Logging with Pino (`nestjs-pino`)

Every incoming request, background worker task, or message consumer must carry a unique Correlation / Request ID. Logs must be emitted in structured JSON format with contextual metadata and automatic data sanitization.

### Installation
```bash
npm install nestjs-pino pino pino-http
npm install -D pino-pretty
```

### Configuration with Universal Data Redaction & Correlation ID
```typescript
// infrastructure/observability/logger.config.ts
import { Params } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

export const pinoLoggerOptions: Params = {
  pinoHttp: {
    genReqId: (req) => (req.headers['x-correlation-id'] as string) || (req.headers['x-request-id'] as string) || randomUUID(),
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    // Universal PII and Security Secret Redaction
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["x-api-key"]',
        // Passwords & Tokens
        '*.*password*',
        '*.*token*',
        '*.*secret*',
        // Compliance: PCI DSS (Cardholder Data - Strict Prohibition)
        '*.*cardNumber*',
        '*.*card_number*',
        '*.*pan*',
        '*.*cvv*',
        '*.*cvc*',
        '*.*card_security_code*',
        '*.*expiry*',
        '*.*expirationDate*',
        // Compliance: LGPD & GDPR (PII - Personally Identifiable Information)
        '*.*cpf*',
        '*.*cnpj*',
        '*.*ssn*',
        '*.*national_id*',
        '*.*rg*',
        '*.*email*',
        '*.*phone*',
        '*.*telephone*',
        '*.*birthDate*',
      ],
      censor: '[REDACTED]',
    },
    customProps: (req, _res) => ({
      correlationId: req.headers['x-correlation-id'] || req.id,
      userAgent: req.headers['user-agent'],
    }),
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  },
};
```

### Contextual Enrichment in Use Cases and Services
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProcessPaymentService {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(ProcessPaymentService.name);
  }

  async execute(orderId: string, customerId: string): Promise<void> {
    // Enrich logs with contextual metadata for this execution block
    this.logger.assign({ orderId, customerId });
    this.logger.info('Starting payment processing for order');

    try {
      // Business execution...
      this.logger.info('Payment processed successfully');
    } catch (error) {
      this.logger.error({ err: error }, 'Payment processing failed');
      throw error;
    }
  }
}
```

---

## 2. Distributed Tracing with OpenTelemetry (OTel)

Distributed tracing provides end-to-end visibility across HTTP endpoints, database queries, Redis calls, external HTTP calls, and background jobs using W3C Trace Context standards.

### Instrumentation Setup (`instrumentation.ts` / `tracer.ts`)
Must be initialized **before** any application code or NestJS modules are imported:

```typescript
// src/instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'backend-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/metrics',
    }),
    exportIntervalMillis: 15000,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false }, // Avoid noise
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-ioredis': { enabled: true },
    }),
  ],
});

sdk.start();

// Graceful shutdown of OTel telemetry pipeline
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry SDK terminated gracefully'))
    .catch((err) => console.error('Error terminating OpenTelemetry SDK', err))
    .finally(() => process.exit(0));
});
```

### Running with OpenTelemetry
In `package.json`:
```json
{
  "scripts": {
    "start:prod": "node -r ./dist/instrumentation.js ./dist/main.js"
  }
}
```

---

## 3. Universal Compliance & Data Masking Standards

| Regulatory Standard | Target Data Elements | Enforcement Strategy |
|---|---|---|
| **PCI DSS v4.0** (Req 3.4 & 4.2) | Primary Account Number (PAN), CVV, Expiry Date, Magnetic Stripe | **STRICT PROHIBITION**: Never log raw card data. Redact at Pino serializer and API pipe level. If needed for display, mask all but last 4 digits (`****-****-****-1234`). |
| **LGPD** (Lei 13.709/2018) & **GDPR** | CPF, RG, Passports, Personal Emails, Phone, Geolocation, IP | **Pseudonymization & Redaction**: Automatic Pino censor `[REDACTED]`. Domain events emit entity IDs instead of raw personal records. |
| **Secrets & Credentials** | JWT Bearer tokens, DB credentials, API keys, Webhook secrets | **Zero Exposure**: Stripped from logs via Pino `redact.paths` and sanitizing Exception Filters. |

---

## 4. Decoupled Role-Based Access Control (RBAC)

Ensure business authorization is verified at the boundary before use cases are executed:

```typescript
// presentation/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('User context missing or unauthenticated');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
```
