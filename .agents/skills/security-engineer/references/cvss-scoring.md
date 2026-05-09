# CVSS v3.1 Scoring Guide

Used by the security-engineer skill for consistent severity classification.

---

## Score Ranges → Severity

| Score     | Severity   | Priority | Action                              |
|-----------|------------|----------|-------------------------------------|
| 9.0–10.0  | CRITICAL   | P0       | Fix before any deployment           |
| 7.0–8.9   | HIGH       | P1       | Fix this sprint                     |
| 4.0–6.9   | MEDIUM     | P2       | Plan fix in next 30 days            |
| 0.1–3.9   | LOW        | P3       | Fix in backlog                      |
| 0.0       | INFO       | —        | Observation only                    |

---

## Base Score Metrics

### Attack Vector (AV)
| Value    | Score | Meaning                                      |
|----------|-------|----------------------------------------------|
| Network  | 0.85  | Exploitable remotely over the network        |
| Adjacent | 0.62  | Requires access to same network segment      |
| Local    | 0.55  | Requires local (shell) access                |
| Physical | 0.20  | Requires physical access to device           |

### Attack Complexity (AC)
| Value | Score | Meaning                                          |
|-------|-------|--------------------------------------------------|
| Low   | 0.77  | No special conditions required                  |
| High  | 0.44  | Requires specific configuration or user action  |

### Privileges Required (PR)
| Value  | Score | Meaning                                 |
|--------|-------|------------------------------------------|
| None   | 0.85  | No authentication required               |
| Low    | 0.62  | Regular user authentication required     |
| High   | 0.27  | Admin or elevated privileges required    |

### User Interaction (UI)
| Value    | Score | Meaning                                    |
|----------|-------|--------------------------------------------|
| None     | 0.85  | No user interaction required               |
| Required | 0.62  | User must take some action                 |

### Scope (S)
| Value    | Meaning                                                  |
|----------|----------------------------------------------------------|
| Unchanged| Impact limited to the vulnerable component               |
| Changed  | Impact extends to other components or the entire system  |

### Confidentiality / Integrity / Availability (C/I/A)
| Value | Score | Meaning                               |
|-------|-------|---------------------------------------|
| High  | 0.56  | Complete loss                         |
| Low   | 0.22  | Some impact                           |
| None  | 0.00  | No impact                             |

---

## Common Pattern Examples

| Vulnerability                    | Typical CVSS  | Severity   |
|----------------------------------|---------------|------------|
| Unauthenticated SQLi (full DB)   | 9.8           | CRITICAL   |
| JWT alg:none bypass              | 9.1           | CRITICAL   |
| Hardcoded production API key     | 9.0           | CRITICAL   |
| CVE in web framework             | 7.5           | HIGH       |
| IDOR (missing ownership check)   | 6.5           | MEDIUM     |
| Missing HSTS header              | 4.3           | MEDIUM     |
| Verbose error messages           | 3.7           | LOW        |
| No X-Content-Type-Options header | 2.1           | LOW        |

---

## Severity → Priority Decision

```
CVSS ≥ 9.0        → P0 — Block deployment. Fix now. Alert CISO.
CVSS 7.0–8.9      → P1 — Fix this sprint. Do not merge to main until resolved.
CVSS 4.0–6.9      → P2 — Schedule fix. Add to technical debt tracker.
CVSS < 4.0        → P3 — Backlog. Document accepted risk if deferred > 90 days.
INFO (0.0)        → No action required. Document as observation.
```
