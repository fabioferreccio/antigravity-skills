# security-engineer

> **Security Engineer Agent** — Security by Design | Defense in Depth | Threat Modeling

A senior-level agentic skill that identifies, classifies, and mitigates vulnerabilities across the entire attack surface of a system: code, infrastructure, IAM, CI/CD pipelines, secrets, dependencies, and network exposure.

---

## Overview

| Property    | Value                                        |
|-------------|----------------------------------------------|
| Version     | 1.0.0                                        |
| Scope       | workspace                                    |
| Complexity  | Level 4                                      |
| Architecture| Reviewer + Autonomous Operator               |
| Author      | Antigravity Skill Creator                    |

---

## Activation Triggers

Use any of these phrases to activate the skill:

| Trigger                                   | Best for                          |
|-------------------------------------------|-----------------------------------|
| `@security-engineer`                      | Direct invocation                 |
| `"audit this for security vulnerabilities"` | Full code/config review          |
| `"do a threat model"`                     | New features, endpoints           |
| `"review the security of <component>"`    | Scoped reviews                    |
| `"check for exposed secrets"`             | Secrets scanning                  |
| `"identify privilege escalation risks"`   | IAM / RBAC audits                 |
| `"security review"`                       | General invocation                |

---

## Capabilities

### Threat Modeling
- Identifies assets, trust boundaries, and data flows
- Applies STRIDE methodology (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation)
- Produces attack trees and risk heat maps

### Vulnerability Identification
- Code-level: injection, broken auth, IDOR, SSRF, XSS, XXE
- Infrastructure: misconfigured cloud storage, open ports, weak IAM
- Dependencies: CVE lookups, known-vulnerable versions
- Secrets: hardcoded tokens, API keys in source, `.env` leaks

### Permission & IAM Review
- Validates least-privilege for all roles and service accounts
- Detects overly permissive policies (wildcard `*` actions)
- Reviews cross-account trust relationships

### Auth & Cryptography Review
- Token expiry, revocation, and scope enforcement
- Algorithm adequacy (RSA 2048+, AES-256, PBKDF2/bcrypt/argon2)
- Key rotation and storage patterns

### Pipeline Security (DevSecOps)
- SAST/DAST integration points
- Artifact signing and provenance
- Secret injection safety (e.g., GitHub Actions secrets vs. env)

---

## Output Structure

Every finding is structured as:

```
Finding → Vulnerability | Severity | CVSS | Vector | Impact | Evidence | Mitigation | Priority | Standard
```

Followed by a **Risk Summary** with overall posture rating (RED / ORANGE / YELLOW / GREEN).

---

## Standards Referenced

| Standard           | Use Case                            |
|--------------------|-------------------------------------|
| OWASP Top 10       | Web application vulnerabilities     |
| CIS Benchmarks     | Infrastructure hardening            |
| CVSS v3.1          | Severity scoring                    |
| NIST CSF           | Framework alignment                 |
| SOC 2 Type II      | Compliance mapping                  |
| STRIDE             | Threat modeling methodology         |

---

## Directory Structure

```
security-engineer/
├── SKILL.md              ← Agentic kernel (activate this)
├── README.md             ← This file
├── examples/
│   ├── example-01.md     ← Node.js API security audit
│   └── example-02.md     ← Kubernetes IAM threat model
├── tests/
│   └── test-01.md        ← Evaluation suite (10 prompts + edge cases)
├── references/
│   ├── owasp-top10.md    ← OWASP Top 10 quick reference
│   ├── cvss-scoring.md   ← CVSS v3.1 scoring guide
│   └── severity-matrix.md← Priority decision matrix
└── graph/
    ├── workflows.yaml    ← Agentic phase transitions
    ├── heuristics.yaml   ← Trigger classification rules
    └── ontology.yaml     ← Security domain knowledge graph
```

---

## Usage Examples

### Direct invocation
```
@security-engineer review the authentication flow in src/auth/
```

### Full audit
```
audit this for security vulnerabilities — focus on the API layer and IAM roles
```

### Targeted threat model
```
do a threat model for the new payment processing endpoint
```

---

## Constraints

- Does **not** execute active exploits or fuzzing without explicit consent
- Does **not** print actual secret values — only redacted key names
- Does **not** modify production configs without explicit confirmation
- Every finding **must** have a concrete evidence reference
- Escalates **immediately** on CRITICAL findings with active exploitation signs

---

## Evolution Roadmap

| Milestone  | Improvement                                              |
|------------|----------------------------------------------------------|
| 10 uses    | Add CWE mapping to all findings                          |
| 50 uses    | Integrate automated CVE lookup via `npm audit` / `trivy` |
| 100 uses   | Add STRIDE threat tree generator                         |
| 500 uses   | Support multi-service architecture threat modeling       |
| 1000 uses  | Self-updating CVE database from NVD feed                 |
