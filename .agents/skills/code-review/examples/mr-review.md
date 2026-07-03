# Example 2: MR/PR Review with Inline Posting — GitHub PR

## Context

A SaaS platform with a NestJS backend. A developer opened a PR to refactor the authentication service, adding OAuth2 support. The reviewer wants automated inline comments posted directly on the PR.

## User Input

```
review this PR https://github.com/myorg/myapp/pull/456
```

## Expected Agent Behavior

### Phase 1: Index
- Detects GitHub PR URL pattern: `github.com/<owner>/<repo>/pull/<number>`
- Extracts: owner=`myorg`, repo=`myapp`, pull_number=`456`
- Uses MCP (`mcp__github__get_pull_request`) or `gh` CLI to fetch PR metadata:
  - Title: "feat: add OAuth2 authentication flow"
  - Base: `main`, Head: `feature/oauth2-auth`
  - Changed files: 6 files, +342 / -28 lines
- Fetches diff and changed file list
- Loads existing project index (or builds if first run)

### Phase 2: Detect
- Languages: TypeScript
- Frameworks: NestJS, Passport.js
- Changed files:
  ```
  src/auth/strategies/oauth2.strategy.ts        (+124)
  src/auth/guards/oauth2.guard.ts               (+38)
  src/auth/auth.module.ts                       (+12, -3)
  src/auth/auth.service.ts                      (+89, -8)
  src/auth/dto/oauth2-callback.dto.ts           (+27)
  src/auth/auth.controller.ts                   (+52, -17)
  ```
- Complementary skills: `security-engineer` (auth flow = high security relevance)

### Phase 3: Dispatch
Agents launched:
- ✅ architecture-reviewer (module structure, guard patterns)
- ✅ security-reviewer (authentication flow — critical)
- ✅ simplicity-reviewer (always launched)
- ✅ testing-reviewer (no test files changed — flag expected)
- ✅ error-handling-reviewer (auth error handling)
- ❌ database-reviewer (no DB files)
- ❌ frontend-reviewer (no frontend files)
- ❌ api-contracts-reviewer (no OpenAPI files)
- ❌ i18n-reviewer (no i18n files)

### Phase 4: Aggregate
- 5 agents complete
- Findings merged, deduplicated, severity classified
- Pre-existing issues: 1 (existing auth.service.ts had a TODO for token rotation — flagged but separated)

### Phase 5: Present

```markdown
## Revisão de Código — PR #456: feat: add OAuth2 authentication flow

### Resumo
A implementação do OAuth2 está bem estruturada com uso correto de Passport strategies e
guards. Porém, há vulnerabilidades de segurança no tratamento do callback, ausência total
de testes para o novo fluxo, e um potencial de CSRF no state parameter.

**Arquivos revisados**: 6 | **Findings**: 1 Crítico, 2 Importantes, 1 Menor

---

### 🔴 Críticos (Deve Corrigir)

#### 1. OAuth2 callback não valida o state parameter
- **File:** `src/auth/auth.service.ts:42`
- **What:** The `handleOAuth2Callback` method accepts the authorization code and exchanges it for a token without validating the `state` parameter against the session.
- **Why:** Without state validation, the OAuth2 flow is vulnerable to CSRF attacks. An attacker can craft a malicious authorization URL and trick a user into linking the attacker's account.
- **Fix:**
```diff
  async handleOAuth2Callback(code: string, state: string) {
+   const expectedState = await this.sessionService.getOAuth2State(state);
+   if (!expectedState) {
+     throw new UnauthorizedException('Invalid OAuth2 state — possible CSRF attack');
+   }
    const token = await this.oauth2Provider.exchangeCode(code);
    return this.createSession(token);
  }
```
- 💬 ```suggestion
async handleOAuth2Callback(code: string, state: string) {
  const expectedState = await this.sessionService.getOAuth2State(state);
  if (!expectedState) {
    throw new UnauthorizedException('Invalid OAuth2 state — possible CSRF attack');
  }
  const token = await this.oauth2Provider.exchangeCode(code);
  return this.createSession(token);
}
```

---

### 🟡 Importantes (Deveria Corrigir)

#### 2. Nenhum teste adicionado para o fluxo OAuth2
- **File:** (missing test file)
- **What:** PR adds 342 lines of authentication logic with zero test coverage. No spec files were created or modified.
- **Why:** Authentication is a critical path. Without tests, regressions in the OAuth2 flow will go undetected, potentially locking users out or creating security holes.
- **Fix:** Create `src/auth/auth.service.spec.ts` with at minimum:
  - Happy path: valid code exchange → session created
  - Invalid state → UnauthorizedException
  - Expired code → appropriate error
  - Provider timeout → graceful error handling

#### 3. Access token stored in plain text in session
- **File:** `src/auth/auth.service.ts:58`
- **What:** The OAuth2 access token is stored directly in the session object without encryption.
- **Why:** If session storage is compromised (e.g., Redis dump, session fixation), access tokens are immediately usable by an attacker. Tokens should be encrypted at rest.
- **Fix:** Encrypt the token before storing and decrypt on retrieval:
```typescript
const encryptedToken = this.cryptoService.encrypt(accessToken);
await this.sessionService.set(sessionId, { token: encryptedToken });
```

---

### 🔵 Menores (Poderia Melhorar)

#### 4. Guard class name does not follow project convention
- **File:** `src/auth/guards/oauth2.guard.ts:5`
- **What:** Guard is named `OAuth2AuthGuard` but existing guards follow the `*Guard` pattern without the `Auth` infix (e.g., `JwtGuard`, `RolesGuard`).
- **Fix:** Rename to `OAuth2Guard` for consistency.

---

### ⚠️ Pré-existentes (Não introduzidos neste PR)

#### P-1. TODO pendente para rotação de tokens
- **File:** `src/auth/auth.service.ts:15`
- **Note:** `// TODO: implement token rotation` has been present since the file was created. This is not introduced by this PR but is worth addressing given the new OAuth2 flow.

---

### ✅ Pontos Fortes
- Passport strategy implementation follows NestJS best practices
- OAuth2 guard correctly extends `AuthGuard` with proper error mapping
- DTO uses class-validator with appropriate decorators for the callback payload
- Clean separation between strategy (Passport) and service (business logic)
- Module registration uses `forRoot()` pattern correctly

---

Quer que eu poste esses comentários inline no PR #456?
```

## Inline Posting Interaction

```
User: "sim"

Agent: "Postando comentários no PR #456..."

Agent: "✅ 4 comentários postados com sucesso no PR #456:
  - ✅ Anchored: src/auth/auth.service.ts:42 — OAuth2 state validation (Crítico)
  - ✅ Anchored: src/auth/auth.service.ts:58 — Token encryption at rest (Importante)
  - ✅ Anchored: src/auth/guards/oauth2.guard.ts:5 — Guard naming convention (Menor)
  - ✅ PR-level comment: Missing test coverage for OAuth2 flow (Importante)

Nota: 1 finding foi postado como comentário geral no PR porque não há linha específica
no diff (arquivo de teste ausente)."
```

## Platform Authentication

The skill uses the following methods to authenticate with GitHub:

1. **MCP GitHub tool** (`mcp__github__*`): Preferred method when available, uses the MCP server's configured token
2. **GitHub CLI** (`gh`): Fallback method, uses the token from `gh auth status`
3. **Manual token**: If neither is available, the skill asks the user to provide a GitHub personal access token

The skill never stores or logs tokens. Authentication is resolved per-session from existing CLI configurations.
