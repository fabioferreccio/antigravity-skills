# sdkgen RPC Contracts & Front-End Integration Reference

## 1. Overview of sdkgen (RPC Type-Safe Contracts)

[sdkgen](https://sdkgen.github.io/) is a type-safe RPC code generator that compiles `.sdkgen` schema files into strongly-typed TypeScript API clients (`ApiClient`), DTO interfaces, and custom exception classes.

---

## 2. Front-End Architectural Best Practices for sdkgen

### A. Ports & Adapters Encapsulation
- **Never import `sdkgen` generated clients directly inside React UI components.**
- Encapsulate the generated `ApiClient` behind a clean Repository/Service interface:
  ```
  src/lib/api/
  ├── interface.ts        # Port (Abstract API Contract)
  ├── sdkgen-adapter.ts   # Adapter (Concrete sdkgen ApiClient wrapper)
  └── index.ts            # Singleton export
  ```

### B. Error Handling & Normalization
- Catch `SdkgenError` subclasses (`InvalidArgument`, `NotFound`, `NotLoggedIn`, `Fatal`) in query clients or API adapters.
- Mask internal `Fatal` errors before they reach the UI, mapping them to localized, user-friendly toast notifications.
- Intercept `NotLoggedIn` / `Unauthorized` errors to automatically trigger user logout or token refresh.

### C. Language & Auth Extra Parameters
- Propagate UI language changes dynamically to the `sdkgen` client instance:
  ```typescript
  sdkgenClient.extra.set('lng', currentLanguage);
  ```
- Inject authentication tokens via `extra.jwt` or custom Authorization headers.

### D. Codegen Pipeline & CI Integration
- Run the `sdkgen` code generation step before `typecheck` in CI pipelines:
  ```bash
  # CI pipeline sequence
  sdkgen src/schemas/api.sdkgen -o src/api/generated.ts -t ts/client
  npm run typecheck
  ```
- Store `.sdkgen` contract schemas or track generated clients deterministically.
