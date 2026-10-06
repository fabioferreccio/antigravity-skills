# Example 4: Polyglot Review — Go + React Monorepo

## Context

A monorepo SaaS platform with a Go backend (Gin framework) and a React TypeScript frontend. The branch migrates a REST API endpoint from the legacy Node.js service to Go and updates the React frontend to consume the new API contract.

## User Input

```
revisa meu branch feature/api-migration
```

## Expected Agent Behavior

### Phase 1: Index
- Detects branch name `feature/api-migration`
- Runs `git diff origin/main...origin/feature/api-migration --name-only`
- Builds or loads project index:
  ```yaml
  languages: [go, typescript]
  frameworks: [gin, react]
  structure: monorepo
  go_module: github.com/myorg/platform
  frontend_dir: web/
  backend_dir: api/
  ```

### Phase 2: Detect
- Languages: Go (backend), TypeScript (frontend)
- Frameworks: Gin (Go), React + React Query (TypeScript)
- Changed files:
  ```
  # Go backend
  api/internal/handlers/user_handler.go          (+89)
  api/internal/services/user_service.go          (+64)
  api/internal/models/user.go                    (+23, -5)
  api/internal/middleware/auth.go                 (+12)
  api/cmd/server/routes.go                       (+8, -2)
  api/internal/handlers/user_handler_test.go      (+112)

  # React frontend
  web/src/api/userApi.ts                         (+34, -28)
  web/src/hooks/useUser.ts                       (+18, -15)
  web/src/components/UserProfile/UserProfile.tsx  (+22, -19)
  web/src/components/UserProfile/UserProfile.test.tsx (+45, -30)

  # API contract
  api/docs/openapi.yaml                          (+42, -38)
  ```
- Complementary skills: none specifically required

### Phase 3: Dispatch
Agents launched (both languages detected):
- ✅ architecture-reviewer (Go package structure + React component patterns)
- ✅ security-reviewer (auth middleware + API migration)
- ✅ simplicity-reviewer (always launched)
- ✅ testing-reviewer (Go test + Jest — both test files present)
- ✅ frontend-reviewer (React component changes)
- ✅ api-contracts-reviewer (OpenAPI spec changed)
- ❌ database-reviewer (no DB files changed)
- ❌ i18n-reviewer (no i18n files)
- ✅ error-handling-reviewer (error propagation across languages)

### Phase 4: Aggregate
- 7 agents complete
- Each agent applies **language-appropriate checks**:
  - Go files → Go conventions (error handling, package naming, struct tags)
  - TypeScript files → TS conventions (types, async patterns, hook rules)
  - OpenAPI → contract consistency between Go handler and React consumer
- Cross-language consistency validated (API contract matches both sides)

### Phase 5: Present

```markdown
## Revisão de Código — feature/api-migration

### Resumo
A migração da API de Node.js para Go está bem executada, com boa cobertura de testes em
ambos os lados. Porém, o handler Go não segue a convenção de error handling idiomático,
o contrato OpenAPI tem um campo renomeado que vai quebrar o frontend em produção, e o
componente React não trata o estado de loading adequadamente durante a migração.

**Arquivos revisados**: 11 | **Findings**: 1 Crítico, 3 Importantes, 2 Menores

---

### 🔴 Críticos (Deve Corrigir)

#### 1. Breaking change no contrato da API: campo renomeado
- **File:** `api/docs/openapi.yaml:87`
- **What:** The response field `user_name` was renamed to `username` in the OpenAPI spec, but the React frontend (`web/src/api/userApi.ts:12`) still maps the response using `user_name`. This will cause `undefined` values in production.
- **Why:** Field renames in API contracts are breaking changes. Both producer (Go handler) and consumer (React) must be updated simultaneously, or the old field must be preserved for backward compatibility.
- **Cross-reference:**
  - Go handler returns `Username` (struct tag: `json:"username"`) ← new name
  - React maps `response.data.user_name` ← old name
  - OpenAPI shows `username` ← matches Go, breaks React
- **Fix (option A — update React):**
```diff
# web/src/api/userApi.ts
- const user = { name: response.data.user_name, ...rest };
+ const user = { name: response.data.username, ...rest };
```
- **Fix (option B — backward compatible, recommended for production):**
```go
// api/internal/models/user.go
type UserResponse struct {
    Username string `json:"username"`
    UserName string `json:"user_name"` // deprecated, remove after frontend migration
}
```

---

### 🟡 Importantes (Deveria Corrigir)

#### 2. Go handler ignora erros com _ (underscore)
- **File:** `api/internal/handlers/user_handler.go:34`
- **What:** The handler discards the error from `json.Marshal`:
```go
data, _ := json.Marshal(user)
```
- **Why:** In Go, ignoring errors is a code smell and violates Go idioms. If marshaling fails (e.g., unsupported type), the handler will send an empty or malformed response instead of a 500 error.
- **Fix:**
```go
data, err := json.Marshal(user)
if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to serialize response"})
    return
}
```

#### 3. React component renders stale data during API migration
- **File:** `web/src/components/UserProfile/UserProfile.tsx:18`
- **What:** The `useUser` hook uses `staleTime: Infinity` in React Query config, which means once the data is fetched from the old API, it will never re-fetch from the new API endpoint until the user refreshes the entire page.
- **Why:** During a rolling deployment, some users will have cached responses from the old Node.js service. With `staleTime: Infinity`, they will never see updated data from the new Go service until they hard-refresh.
- **Fix:** Set a reasonable stale time during migration, then increase after stabilization:
```typescript
const { data: user } = useUser(userId, {
  staleTime: 5 * 60 * 1000, // 5 minutes during migration
});
```

#### 4. Go test uses real HTTP calls instead of mocking the service layer
- **File:** `api/internal/handlers/user_handler_test.go:23`
- **What:** Test creates a real Gin engine and makes HTTP calls to the handler, but injects the real `UserService` instead of a mock/interface. This makes the test an integration test rather than a unit test.
- **Why:** Go handler tests should inject a mock service (via interface) to test handler logic in isolation. Integration tests should be in a separate `_integration_test.go` file.
- **Fix:** Define an interface for `UserService` and inject a mock:
```go
type MockUserService struct {
    GetUserFunc func(ctx context.Context, id string) (*models.User, error)
}

func (m *MockUserService) GetUser(ctx context.Context, id string) (*models.User, error) {
    return m.GetUserFunc(ctx, id)
}
```

---

### 🔵 Menores (Poderia Melhorar)

#### 5. Go package name does not follow Go conventions
- **File:** `api/internal/handlers/user_handler.go:1`
- **What:** Package is named `userHandlers` (camelCase) but Go convention requires lowercase, single-word package names. The file is in the `handlers` directory, so the package should be `handlers`.
- **Fix:** `package handlers`

#### 6. React test has commented-out test case
- **File:** `web/src/components/UserProfile/UserProfile.test.tsx:67-75`
- **What:** A test case for "should display error state" is commented out with `// TODO: fix after migration`. Commented-out code in a PR suggests incomplete work.
- **Fix:** Either implement the test or remove it and track in an issue.

---

### ✅ Pontos Fortes
- Go handler correctly uses Gin's context for request/response handling
- Auth middleware is properly applied at the route level, not per-handler
- React Query hook abstraction provides clean separation from components
- OpenAPI spec is updated alongside code changes (good contract-first discipline)
- Both Go and React test files are included in the PR
- Go struct tags use consistent `json:"snake_case"` formatting
- React component uses TypeScript generics for type-safe API response mapping

---

### 🔀 Cross-Language Consistency Check

| Aspect | Go (Backend) | TypeScript (Frontend) | Status |
|---|---|---|---|
| Field naming | `json:"username"` | `response.data.user_name` | ❌ Mismatch |
| Error codes | Returns `400`, `404`, `500` | Handles `400`, `404`, `500` | ✅ Consistent |
| Auth header | Reads `Authorization: Bearer` | Sends `Authorization: Bearer` | ✅ Consistent |
| Content-Type | Returns `application/json` | Expects `application/json` | ✅ Consistent |
| Pagination | `?page=1&limit=20` | `?page=1&limit=20` | ✅ Consistent |

---

Quer que eu poste esses comentários inline no MR/PR?
```

## Key Polyglot Behaviors

### Language-Appropriate Checks

The skill adapts its review rules based on the detected language:

| Check | Go | TypeScript |
|---|---|---|
| Error handling | Must check `err != nil` | Must use try/catch or `.catch()` |
| Naming | `snake_case` for JSON, `CamelCase` for exports | `camelCase` for variables, `PascalCase` for types |
| Package structure | Flat packages, single `package` declaration | Module imports, barrel files |
| Testing | `_test.go` files, table-driven tests | `.test.tsx` files, describe/it blocks |
| Unused variables | Compile error in Go | Linter warning in TS |

### Cross-Language Validation

When multiple languages are detected in the same PR, the skill additionally validates:

1. **API contract consistency**: Field names, types, and error codes match between producer and consumer
2. **Auth flow consistency**: Token handling matches across services
3. **Error propagation**: Backend error codes map to frontend error handling
4. **Type alignment**: Backend response shapes match frontend TypeScript interfaces
