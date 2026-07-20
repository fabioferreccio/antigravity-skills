# Security Audit Lens (Quality Gate)

Criteria for the `security-auditor` subagent. Scope: **defensive audit of the project's own code**. Every finding requires `file:line`, an exploit scenario, an OWASP category, and a concrete fix. No theoretical hand-waving: if you cannot describe how it is exploited, it is hygiene, not a vulnerability.

## Severity model

| Severity | Criteria |
|---|---|
| **CRITICAL** | Remotely exploitable without auth, or leaks/destroys data at scale: SQLi, RCE, auth bypass, hardcoded production secret |
| **HIGH** | Exploitable by an authenticated user or under common conditions: IDOR, stored XSS, SSRF to internal network, weak password hashing |
| **MEDIUM** | Requires unusual preconditions or has limited blast radius: verbose error leakage, missing rate limiting, permissive CORS |
| **LOW** | Hardening gaps: missing security headers, outdated-but-unexploited dependency |

Any CRITICAL ⇒ automatic gate REPROVADO. Any HIGH ⇒ at minimum REPROVADO COM RESSALVAS.

## A03 — Injection (hunt first, highest yield)

Grep for sinks, then trace each one back to its source. A sink fed only by constants is safe; a sink reachable from user input is a finding.

```
SQL:        query( | execute( | raw( | \$queryRaw | text( + string concat/interpolation/f-string/template literal
SQL (.NET): new SqlCommand("..." + | FromSqlRaw($"...{var}") | ExecuteSqlRaw( | Dapper Query<T>("..." +
            | NHibernate CreateSQLQuery("..." + | CreateQuery (HQL) built by concatenation
Command:    exec( | execSync | spawn(...shell:true | os.system | subprocess.*shell=True | Runtime.getRuntime().exec
            | Process.Start with user-fed arguments | backticks (Ruby)
Path:       readFile|open|sendFile|createReadStream|Path.Combine fed by req/params without normalize + root-prefix check
            (Path.Combine("/safe", userInput) with an absolute userInput DISCARDS the safe prefix — classic .NET trap)
NoSQL:      $where | mongo queries built from raw req.body objects (operator injection: {"$gt": ""})
Template:   render_template_string | new Function( | eval( | vm.runInContext | Jinja2 from user input (SSTI)
            | Razor @Html.Raw(userData)
LDAP/XPath: filters built by concatenation
```

- Parameterized queries/prepared statements are the fix — flag any string-built query even if "currently safe".
- ORM does not equal safe: `sequelize.literal`, `knex.raw`, TypeORM `query()`, Prisma `$queryRawUnsafe` are all raw sinks. In .NET: `FromSqlRaw` with string interpolation is injectable, while `FromSqlInterpolated`/`FromSql` (EF Core 7+) parameterize the same-looking syntax — read carefully which one the code calls; NHibernate `SetParameter` is safe, concatenated HQL/SQL is not; Dapper is safe only with anonymous-object parameters (`new { id }`), never with interpolated strings.

## A01 — Broken Access Control (highest real-world frequency)

- **IDOR**: handler loads a resource by id from the request without checking ownership/tenant (`findById(req.params.id)` with no `userId` predicate). Multi-tenant code: EVERY query on tenant data must carry the tenant discriminator.
- **Missing authz** (vs authn): route has authentication middleware but no role/permission check for the action; admin routes distinguishable only by URL.
- **Mass assignment**: `Model.update(req.body)` / `**kwargs` spread into an entity / ASP.NET model binding straight onto EF entities (`[FromBody] User user` persisted as-is) — can flip `isAdmin`, `price`, `balance`. Demand explicit allowlists/DTOs (`[Bind]` is not enough; use separate view models).
- Client-supplied authority: trusting `role`, `price`, `userId` from the request body; JWT parsed with `decode()` instead of `verify()`, or `alg: none` accepted.

## A02/A07 — Crypto & Auth failures

- Passwords: anything other than bcrypt/scrypt/argon2 (MD5/SHA-x = CRITICAL). Salts required; cost factors sane.
- `Math.random()` / `random.random()` for tokens, ids, or resets → must be `crypto.randomBytes`/`secrets`.
- Hardcoded keys/IVs, ECB mode, static IV with CBC, homemade crypto.
- Token comparison with `==` instead of constant-time compare; JWT secret weak or committed; sessions without expiry/rotation; login without rate limiting or lockout.

## Secrets exposure

Grep the tree (respecting .gitignore, but DO check `.env.example`, docker-compose, CI files for real-looking values):

```
(api[_-]?key|secret|token|passw(or)?d|private[_-]?key)\s*[:=]\s*['"][^'"]{8,}
AKIA[0-9A-Z]{16}            # AWS access key
sk_live_[0-9a-zA-Z]{24,}    # Stripe live
ghp_[0-9a-zA-Z]{36}         # GitHub PAT
xox[baprs]-                 # Slack
-----BEGIN (RSA |EC )?PRIVATE KEY-----
postgres://\w+:[^@\s]+@     # connection string with inline password
(Password|Pwd)\s*=\s*[^;'"\s]{6,}   # ADO.NET connection string (appsettings*.json, web.config) with inline password
```

- Placeholder values (`changeme`, `<your-key>`, `example`) are hygiene notes, not findings.
- **NEVER print a discovered secret in the report** — mask it (`sk_live_****`), report location + type, and instruct rotation (the value is compromised the moment it was committed).

## A10/SSRF, uploads, deserialization, XXE

- SSRF: any outbound fetch whose URL derives from user input → demand allowlist + block of private ranges (169.254.169.254, 10/8, 172.16/12, 192.168/16, localhost).
- Uploads: extension/MIME allowlist, size limit, randomized stored name, storage outside webroot.
- Unsafe deserialization: `pickle.loads`, `yaml.load` (no SafeLoader), Java `ObjectInputStream`, PHP `unserialize`, .NET `BinaryFormatter`/`SoapFormatter`/`NetDataContractSerializer` or `JsonSerializerSettings { TypeNameHandling != None }` (Json.NET) on user data = CRITICAL.
- XML parsers with external entities enabled (XXE).

## A05/A09 — Config & observability hygiene

- CORS `*` combined with credentials; missing `HttpOnly`/`Secure`/`SameSite` on session cookies; debug mode/stack traces in production paths.
- Dockerfiles running as root, secrets passed as build args.
- Logs: passwords/tokens/PII logged; security events (failed logins, denied access) NOT logged.

## A06 — Vulnerable dependencies (offline best-effort)

Network is disabled for this skill. Therefore:

1. Prefer offline signals: lockfile parsing, `npm audit --offline` style caches if present, versions pinned to known-EOL majors.
2. If advisory lookup is impossible, DO NOT guess CVEs. Report the section as **NÃO VERIFICADO (sem rede)** and emit the exact command for the user to run (`npm audit`, `pip-audit`, `mvn org.owasp:dependency-check-maven:check`, `cargo audit`, `govulncheck ./...`).
3. Unpinned versions (`latest`, `*`, missing lockfile) are a finding regardless of network: builds are not reproducible and supply-chain surface is open.

## Frontend-specific (when applicable)

- XSS sinks: `innerHTML`, `dangerouslySetInnerHTML`, `v-html`, `document.write`, `insertAdjacentHTML` fed by non-sanitized data.
- `target="_blank"` without `rel="noopener"`; secrets in frontend bundles (`REACT_APP_*`/`VITE_*` containing private keys).

## Verification discipline

Before reporting CRITICAL/HIGH: re-read the sink AND its callers. Sanitization may exist upstream (middleware, DTO validation, ORM escaping). A guarded sink is not a finding — reporting it anyway destroys the report's authority. When unsure after tracing, downgrade one level and phrase as a question.
