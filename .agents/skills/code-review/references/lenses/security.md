# Security Review Lens

Polyglot security review lens.

## Universal Checks (all languages)
1. **Secrets Exposure**: Hardcoded tokens, API keys, passwords, connection strings in source code
2. **Input Validation**: User data accepted without validation or sanitization
3. **SQL/NoSQL Injection**: String concatenation in queries instead of parameterized queries
4. **XSS**: Unsanitized user content rendered in HTML
5. **SSRF**: User-controlled URLs used in server-side requests without validation
6. **Auth/Authz Bypass**: Endpoints without authentication, missing permission checks
7. **Insecure Crypto**: Weak algorithms (MD5, SHA1 for security), hardcoded IVs/salts
8. **Path Traversal**: User input used in file paths without sanitization
9. **CORS Misconfiguration**: Overly permissive CORS (`*` origin with credentials)
10. **Sensitive Data in Logs**: PII, tokens, passwords logged
11. **Dependency Vulnerabilities**: Known CVE in dependencies
12. **Race Conditions**: TOCTOU, double-spend, check-then-act without locking

## Language-Specific Checks

### TypeScript/JavaScript/Node.js
- `eval()`, `Function()`, `child_process.exec()` with user input
- `dangerouslySetInnerHTML` without sanitization
- JWT without expiry, HS256 with weak secret
- `localStorage` for sensitive tokens
- Missing helmet/CORS middleware
- Prototype pollution via object spread/assign

### Java/Kotlin
- `Runtime.exec()` with user input
- Deserialization of untrusted data (ObjectInputStream)
- SQL injection via string concatenation in JPQL/HQL
- Missing CSRF protection
- Insecure random (java.util.Random instead of SecureRandom)

### Python
- `pickle.loads()` on untrusted data
- `os.system()`, `subprocess.call(shell=True)` with user input
- Django `|safe` template filter on user content
- Flask `send_file()` with user-controlled path
- Missing CSRF middleware

### Go
- `fmt.Sprintf` in SQL queries
- `os/exec` with user input
- Missing input validation on HTTP handlers
- Insecure TLS configuration

### Rust
- `unsafe` blocks without clear justification
- SQL injection via string formatting
- Missing input validation

### C#/.NET
- `Process.Start()` with user input
- SQL injection via string interpolation in EF Core raw SQL
- Missing `[Authorize]` attribute
- `[AllowAnonymous]` on sensitive endpoints

**Critical rule:** DO NOT flag security issues in test files (fake tokens/passwords are expected).

## Severity
- **Critico**: Exploitable now (SQL injection, hardcoded secrets, auth bypass, XSS)
- **Importante**: Needs specific conditions to exploit (missing rate limiting, weak crypto)
- **Menor**: Defense in depth suggestions (additional headers, logging improvements)

For each finding include: CWE ID where applicable, specific remediation with code snippet.
