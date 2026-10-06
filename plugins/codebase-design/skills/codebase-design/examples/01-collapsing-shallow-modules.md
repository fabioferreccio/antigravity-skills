# Example 01: Collapsing Shallow Pass-Throughs into a Deep Configuration Module

## Problem Scenario

An AI assistant generated 5 shallow files for application configuration:
- `config-reader.interface.ts`
- `env-config-reader.ts`
- `config-parser.ts`
- `config-validator.ts`
- `config-service.ts`

Each file was only 10 lines long. Every time a new environment variable was added, all 5 files had to be touched (Change Amplification), and unit tests required mocking 4 levels of collaborators (Tautological Testing).

---

## Architectural Recommendation by `codebase-design`

### 1. Diagnosis
- **Module Depth**: Extremely Shallow. Interface surface is wide and segmented, yet the total implementation is trivial.
- **Complexity Root**: Information Leakage regarding configuration source formats.

### 2. Proposed Deep Module: `AppConfig`
Consolidate the 5 files into a single **Deep Module** (`src/config/app-config.ts`):

```typescript
export interface AppConfigSchema {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
}

export class AppConfig {
  private static instance: AppConfig;
  private readonly values: AppConfigSchema;

  private constructor() {
    // Encapsulates loading from process.env, parsing types, fallback defaults,
    // and strict invariant schema validation in one cohesive place.
    this.values = this.loadAndValidate();
  }

  public static get(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public get<K extends keyof AppConfigSchema>(key: K): AppConfigSchema[K] {
    return this.values[key];
  }

  private loadAndValidate(): AppConfigSchema {
    // Hidden internal implementation
    const port = parseInt(process.env.PORT || '3000', 10);
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL is mandatory');
    return { port, databaseUrl, jwtSecret: process.env.JWT_SECRET || 'dev-secret' };
  }
}
```

### 3. Impact Assessment
- **Files Reduced**: 5 files $\to$ 1 file.
- **Change Amplification**: Adding a variable now only touches `app-config.ts`.
- **Testability**: Tested purely by passing different environment values; zero mocks required.
