# Monorepo Engineering, Tooling & Quality Gates

This reference establishes standards for managing scalable multi-package repositories, change-based differential CI/CD deployments, and architectural linting guards for NestJS enterprise codebases.

---

## 1. Monorepo Architecture (Turborepo & Nx)

Enterprise backend systems often scale into monorepos sharing core domain libraries, DTOs, and infrastructure packages across multiple microservices.

### Recommended Directory Structure
```
monorepo-root/
├── apps/
│   ├── orders-api/          # NestJS microservice / REST API
│   │   ├── src/
│   │   └── package.json
│   └── notifications-worker/# NestJS BullMQ background worker
│       ├── src/
│       └── package.json
├── packages/
│   ├── domain-core/         # Shared pure TypeScript Value Objects, Result pattern
│   ├── database/            # Shared Prisma / TypeORM schemas and migrations
│   ├── logger/              # Shared Pino & OpenTelemetry configuration
│   └── tsconfig/            # Shared base tsconfig files
├── turbo.json               # Pipeline configuration
└── package.json
```

---

## 2. Change-Based Build & Differential Deployment

Deploying the entire cluster on every commit creates pipeline bottlenecks and operational risk. Employ change-based / affected filtering to test, build, and deploy **only the packages affected by the git diff**.

### Turborepo (`turbo.json`)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

### Targeted CI/CD Execution Commands
```bash
# Build only packages changed compared to main branch:
npx turbo run build --filter=...[origin/main]

# Test only changed microservices and their dependencies:
npx turbo run test --filter=...[origin/main]

# Deploy specific changed app in GitHub Actions / GitLab CI:
npx turbo run deploy --filter=orders-api...[origin/main]
```

---

## 3. Architecture Enforcement via `dependency-cruiser`

Prevent architectural rot, framework leakage, and circular dependencies automatically using `dependency-cruiser`.

### Installation
```bash
npm install -D dependency-cruiser
```

### Strict Layer Rule Configuration (`.dependency-cruiser.js`)
```javascript
module.exports = {
  forbidden: [
    {
      name: 'domain-cannot-import-infrastructure-or-presentation',
      severity: 'error',
      comment: 'Domain layer must remain 100% pure TypeScript with zero framework dependencies.',
      from: { path: '^src/domain' },
      to: { path: '^(src/infrastructure|src/presentation|@nestjs)' },
    },
    {
      name: 'application-cannot-import-presentation',
      severity: 'error',
      comment: 'Application layer must not depend on HTTP/Presentation controllers or DTOs.',
      from: { path: '^src/application' },
      to: { path: '^src/presentation' },
    },
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      comment: 'Circular dependencies cause runtime DI initialization failures.',
      from: {},
      to: { circular: true },
    },
  ],
};
```

Run in CI:
```bash
npx depcruise --config .dependency-cruiser.js src
```

---

## 4. Modern Quality Gates & Git Hooks

### Biome / ESLint & Prettier
- Configure TypeScript in strict mode: `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
- Enable `eslint-plugin-nestjs` and `@typescript-eslint/recommended-type-checked`.

### Husky & Lint-Staged
Enforce quality before commit:
```json
// package.json
{
  "lint-staged": {
    "*.ts": [
      "biome check --apply",
      "npm run lint"
    ]
  }
}
```

### Quality Gate Thresholds
- **Coverage**: Minimum 70% branch coverage, target 90% for domain logic (`domain/` and `application/`).
- **Security**: Zero high/critical vulnerabilities via `npm audit`.
- **Delegation**: Integrate with `quality-gate` skill for adversarial verification and OWASP Top 10 automated sweeps.
