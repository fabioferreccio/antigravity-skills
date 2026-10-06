# Severity Decision Matrix

Guides the security-engineer skill in mapping findings to severity and priority consistently.

---

## Primary Matrix

| Exploitability | Impact     | Severity   | Priority | CVSS Range  |
|----------------|------------|------------|----------|-------------|
| Trivial        | Critical   | CRITICAL   | P0       | 9.0–10.0    |
| Trivial        | High       | HIGH       | P1       | 7.0–8.9     |
| Moderate       | Critical   | HIGH       | P1       | 7.0–8.9     |
| Trivial        | Medium     | MEDIUM     | P2       | 4.0–6.9     |
| Moderate       | High       | MEDIUM     | P2       | 4.0–6.9     |
| Hard           | Critical   | MEDIUM     | P2       | 4.0–6.9     |
| Hard           | Medium     | LOW        | P3       | 0.1–3.9     |
| Hard           | Low        | LOW        | P3       | 0.1–3.9     |
| Any            | None       | INFO       | —        | 0.0         |

---

## Exploitability Levels

| Level    | Definition                                                     |
|----------|----------------------------------------------------------------|
| Trivial  | No authentication, no special conditions, public exploit exists |
| Moderate | Requires some authentication or specific conditions            |
| Hard     | Requires physical access, or highly specific configuration     |

---

## Impact Levels

| Level    | Definition                                                              |
|----------|-------------------------------------------------------------------------|
| Critical | Full data breach, RCE, cluster takeover, financial fraud at scale       |
| High     | Partial data exposure, privilege escalation, service disruption         |
| Medium   | Limited data exposure, one user affected, partial functionality loss    |
| Low      | Information disclosure only, cosmetic impact, no data at risk           |
| None     | Observation, best practice deviation with no exploitable risk           |

---

## Automatic P0 Escalation Triggers

Regardless of CVSS calculation, **immediately escalate to P0 + alert** when:

```
□ Production secrets found in source code or git history
□ Signs of active exploitation in logs
□ Any unauthenticated RCE vector
□ Wildcard admin permissions on cloud or k8s resources
□ Payment data stored in plaintext
□ Critical CVE (CVSS ≥ 9.0) in internet-facing dependency
□ Backdoor or supply chain compromise detected
```

---

## Compliance Severity Override

Some findings must be escalated regardless of CVSS due to regulatory impact:

| Regulation | Finding Type                          | Minimum Severity |
|------------|---------------------------------------|------------------|
| PCI-DSS    | Cardholder data in plaintext          | CRITICAL         |
| GDPR       | PII exposed without encryption        | HIGH             |
| SOC 2      | No audit logging for privileged ops   | HIGH             |
| HIPAA      | Health data unencrypted at rest       | CRITICAL         |
| LGPD       | Personal data without access controls | HIGH             |
