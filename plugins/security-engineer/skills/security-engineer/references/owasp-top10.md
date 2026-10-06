# OWASP Top 10 — Quick Reference (2021)

Used by the security-engineer skill for finding classification and standard mapping.

---

## A01:2021 — Broken Access Control
**Description**: Restrictions on what authenticated users are allowed to do are not properly enforced.
**Key Patterns**: IDOR, privilege escalation, CORS misconfiguration, missing authorization checks.
**Priority Triggers**: Missing ownership checks, path traversal, JWT role bypass.

---

## A02:2021 — Cryptographic Failures
**Description**: Failures related to cryptography (or lack thereof) leading to exposure of sensitive data.
**Key Patterns**: Plaintext passwords, weak algorithms (MD5, SHA1), hardcoded keys, missing TLS, unencrypted data at rest.
**Priority Triggers**: Sensitive data in transit without TLS, password hashed with MD5.

---

## A03:2021 — Injection
**Description**: User-supplied data is not validated, filtered, or sanitized.
**Key Patterns**: SQL injection, NoSQL injection, LDAP injection, OS command injection, template injection.
**Priority Triggers**: String concatenation in queries, `eval()` with user input.

---

## A04:2021 — Insecure Design
**Description**: Missing or ineffective control design — security not considered in architecture.
**Key Patterns**: No rate limiting, no brute-force protection, no threat modeling, no security requirements.
**Priority Triggers**: Login without lockout, no MFA on admin endpoints.

---

## A05:2021 — Security Misconfiguration
**Description**: Improperly configured permissions, unnecessary features enabled, default credentials.
**Key Patterns**: `Access-Control-Allow-Origin: *` + credentials, directory listing, verbose error messages, default passwords.
**Priority Triggers**: Stack traces exposed to users, `DEBUG=True` in production.

---

## A06:2021 — Vulnerable and Outdated Components
**Description**: Using components with known vulnerabilities.
**Key Patterns**: Unmaintained dependencies, unpatched CVEs, EOL libraries.
**Priority Triggers**: `npm audit` HIGH/CRITICAL findings, known CVE in production.

---

## A07:2021 — Identification and Authentication Failures
**Description**: Weaknesses in authentication and session management.
**Key Patterns**: Weak passwords, JWT `alg:none`, session fixation, missing MFA, credential stuffing.
**Priority Triggers**: Plaintext passwords, JWT without expiry, missing revocation.

---

## A08:2021 — Software and Data Integrity Failures
**Description**: Code and infrastructure not protected against integrity violations.
**Key Patterns**: Unverified dependencies, insecure deserialization, no artifact signing, supply chain attacks.
**Priority Triggers**: `latest` Docker tags, unverified npm installs in CI.

---

## A09:2021 — Security Logging and Monitoring Failures
**Description**: Insufficient logging, monitoring, and incident response.
**Key Patterns**: No audit logs, no alerting, logs with sensitive data, non-immutable logs.
**Priority Triggers**: Failed logins not logged, logs stored on the same server.

---

## A10:2021 — Server-Side Request Forgery (SSRF)
**Description**: Web application fetches remote resources without validating user-supplied URLs.
**Key Patterns**: User-controlled URLs fetched server-side, internal metadata endpoints accessible.
**Priority Triggers**: `fetch(req.body.url)`, AWS metadata endpoint accessible via SSRF.

---

## Kubernetes Top 10 (OWASP K8s)

| ID  | Threat                             |
|-----|------------------------------------|
| K01 | Insecure Workload Configurations   |
| K02 | Supply Chain Vulnerabilities       |
| K03 | Overly Permissive RBAC             |
| K04 | Lack of Centralized Policy Engine  |
| K05 | Inadequate Logging and Monitoring  |
| K06 | Broken Authentication              |
| K07 | Missing Network Segmentation       |
| K08 | Secrets Management Failures        |
| K09 | Misconfigured Cluster Components   |
| K10 | Outdated Kubernetes Components     |
