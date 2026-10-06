# Example 01 — Node.js REST API Security Audit

## Scenario

A Node.js Express API has been submitted for security review before going to production. The team wants a full audit covering authentication, input validation, dependency security, and HTTP headers.

---

## Trigger Phrase

```
@security-engineer audit this for security vulnerabilities — focus on the Node.js API at src/
```

---

## Context Provided

**src/routes/auth.js**
```js
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.query(`SELECT * FROM users WHERE username = '${username}'`);
  if (user && user.password === password) {
    const token = jwt.sign({ id: user.id, role: user.role }, 'hardcoded-secret-123');
    res.json({ token });
  }
});
```

**package.json (excerpt)**
```json
{
  "dependencies": {
    "express": "4.17.1",
    "jsonwebtoken": "8.5.1",
    "pg": "7.18.2"
  }
}
```

**.env**
```
DATABASE_URL=postgres://admin:P@ssword123@db.internal:5432/prod
JWT_SECRET=hardcoded-secret-123
```

---

## Expected Agent Output

---
## Finding: SQL Injection via String Concatenation

| Field         | Value                                                                      |
|---------------|----------------------------------------------------------------------------|
| Vulnerability | User input interpolated directly into SQL query without parameterization   |
| Severity      | CRITICAL                                                                   |
| CVSS Score    | 9.8 (AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H)                               |
| Attack Vector | Network                                                                    |
| Impact        | Full database read/write; authentication bypass; potential RCE via stacked queries |
| Evidence      | `src/routes/auth.js:3` — `WHERE username = '${username}'`                 |
| Mitigation    | Use parameterized queries: `db.query('SELECT * FROM users WHERE username = $1', [username])` |
| Priority      | P0 — Fix immediately before any production deployment                      |
| Standard      | OWASP A03:2021 — Injection                                                 |

---
## Finding: Hardcoded JWT Secret in Source Code

| Field         | Value                                                                      |
|---------------|----------------------------------------------------------------------------|
| Vulnerability | JWT signing secret hardcoded as string literal in application source       |
| Severity      | CRITICAL                                                                   |
| CVSS Score    | 9.1                                                                        |
| Attack Vector | Local (source access) / Network (if repo is public)                       |
| Impact        | Any actor with source access can forge arbitrary JWT tokens for any user role |
| Evidence      | `src/routes/auth.js:5` — `'hardcoded-secret-123'` and `.env:2` — `JWT_SECRET=hardcoded-secret-123` |
| Mitigation    | 1. Rotate secret immediately. 2. Load from `process.env.JWT_SECRET`. 3. Enforce min 256-bit entropy secret. 4. Add `.env` to `.gitignore` and secret scanning CI step. |
| Priority      | P0                                                                         |
| Standard      | OWASP A02:2021 — Cryptographic Failures                                    |

---
## Finding: Plaintext Password Comparison

| Field         | Value                                                    |
|---------------|----------------------------------------------------------|
| Vulnerability | Passwords stored and compared in plaintext               |
| Severity      | CRITICAL                                                 |
| CVSS Score    | 9.0                                                      |
| Attack Vector | Network + Data breach                                    |
| Impact        | All user credentials exposed on any database breach      |
| Evidence      | `src/routes/auth.js:4` — `user.password === password`   |
| Mitigation    | Use `bcrypt.compare(password, user.passwordHash)` and migrate existing passwords to bcrypt/argon2 hashes |
| Priority      | P0                                                       |
| Standard      | OWASP A02:2021 — Cryptographic Failures; CIS Control 16  |

---
## Finding: Outdated Dependencies with Known CVEs

| Field         | Value                                                             |
|---------------|-------------------------------------------------------------------|
| Vulnerability | `express@4.17.1` (CVE-2022-24999), `pg@7.18.2` (EOL)            |
| Severity      | HIGH                                                              |
| CVSS Score    | 7.5                                                               |
| Attack Vector | Network                                                           |
| Impact        | Prototype pollution, ReDoS, potential RCE depending on CVE        |
| Evidence      | `package.json` — outdated pinned versions                        |
| Mitigation    | Run `npm audit fix`, upgrade to `express@4.18.2+`, replace `pg@7` with `pg@8` |
| Priority      | P1                                                                |
| Standard      | OWASP A06:2021 — Vulnerable and Outdated Components               |

---

## Risk Summary

| Severity  | Count | Fixed | Remaining |
|-----------|-------|-------|-----------|
| CRITICAL  | 3     | 0     | 3         |
| HIGH      | 1     | 0     | 1         |
| MEDIUM    | 0     | —     | —         |
| LOW       | 0     | —     | —         |

**Overall Risk**: 🔴 RED
**Next Action**: Block deployment. Fix SQL injection and hardcoded secret before any further review.
