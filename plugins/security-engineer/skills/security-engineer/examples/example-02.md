# Example 02 — Kubernetes IAM & Network Threat Model

## Scenario

A microservices system running on Kubernetes is about to introduce a new payment processing service. The team wants a threat model before the service goes live.

---

## Trigger Phrase

```
@security-engineer do a threat model for the new payment-service deployment on Kubernetes
```

---

## Context Provided

**k8s/payment-service-deployment.yaml**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: payment-service
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: payment-service-binding
subjects:
  - kind: ServiceAccount
    name: payment-service
    namespace: default
roleRef:
  kind: ClusterRole
  name: cluster-admin   # ← Overly permissive
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
spec:
  template:
    spec:
      containers:
        - name: payment-service
          image: myregistry/payment-service:latest  # ← No digest pinning
          env:
            - name: STRIPE_SECRET_KEY
              value: "sk_live_XXXXXXXXXXXXXXXXXXXX"  # ← Secret in manifest
          securityContext: {}  # ← No security context
```

---

## Expected Agent Output

### Threat Model — Payment Service

**Assets**: Stripe API credentials, cardholder data, transaction records
**Trust Boundaries**: Internet → Ingress → payment-service → Stripe API / DB

---
## Finding: ClusterRoleBinding to cluster-admin

| Field         | Value                                                                           |
|---------------|---------------------------------------------------------------------------------|
| Vulnerability | Payment service has cluster-admin privileges across the entire Kubernetes cluster |
| Severity      | CRITICAL                                                                        |
| CVSS Score    | 10.0 (AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H)                                   |
| Attack Vector | Network — any exploit of the payment-service container gains full cluster control |
| Impact        | Full cluster takeover: read all secrets, deploy malicious workloads, pivot to all namespaces |
| Evidence      | `k8s/payment-service-deployment.yaml:12` — `name: cluster-admin`              |
| Mitigation    | Replace with a least-privilege Role scoped to `default` namespace. Grant only `get/list` on its own ConfigMaps and nothing else. |
| Priority      | P0                                                                              |
| Standard      | CIS Kubernetes Benchmark 5.1.1; OWASP K8s Top 10 — K01                        |

---
## Finding: Stripe Live Secret in Kubernetes Manifest

| Field         | Value                                                                     |
|---------------|---------------------------------------------------------------------------|
| Vulnerability | Production payment API key stored in plaintext inside a Kubernetes manifest |
| Severity      | CRITICAL                                                                  |
| CVSS Score    | 9.9                                                                       |
| Attack Vector | Local (any `kubectl get deployment -o yaml`) + git history if committed   |
| Impact        | Unauthorized charges, account takeover, financial fraud at scale          |
| Evidence      | `k8s/payment-service-deployment.yaml:24` — `value: "sk_live_XXXX..."`    |
| Mitigation    | 1. Rotate Stripe key immediately. 2. Use Kubernetes Secret + `secretKeyRef`. 3. Integrate with Vault or AWS Secrets Manager. 4. Add `detect-secrets` pre-commit hook and CI scanner. |
| Priority      | P0                                                                        |
| Standard      | OWASP A02:2021; CIS K8s 5.4.1                                             |

---
## Finding: Container Image Without Digest Pinning

| Field         | Value                                                             |
|---------------|-------------------------------------------------------------------|
| Vulnerability | Image pulled as `latest` tag with no digest — susceptible to supply chain substitution |
| Severity      | HIGH                                                              |
| CVSS Score    | 8.1                                                               |
| Attack Vector | Supply chain / registry compromise                                |
| Impact        | Malicious image deployed on next rollout without detection        |
| Evidence      | `k8s/payment-service-deployment.yaml:21` — `image: myregistry/payment-service:latest` |
| Mitigation    | Pin to immutable digest: `myregistry/payment-service@sha256:<digest>`. Enforce in admission controller (OPA/Gatekeeper). |
| Priority      | P1                                                                |
| Standard      | SLSA L2; CIS K8s 5.3.1                                            |

---
## Finding: Missing Container Security Context

| Field         | Value                                                                         |
|---------------|-------------------------------------------------------------------------------|
| Vulnerability | Container runs without security constraints — may run as root, writeable FS   |
| Severity      | HIGH                                                                          |
| CVSS Score    | 7.8                                                                           |
| Attack Vector | Local (container breakout)                                                   |
| Impact        | Container breakout to node; write access to sensitive filesystem paths        |
| Evidence      | `k8s/payment-service-deployment.yaml:26` — `securityContext: {}`             |
| Mitigation    | Add: `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]` |
| Priority      | P1                                                                            |
| Standard      | CIS K8s 5.2.1, 5.2.6; OWASP K8s Top 10 — K03                                |

---

## Risk Summary

| Severity  | Count | Fixed | Remaining |
|-----------|-------|-------|-----------|
| CRITICAL  | 2     | 0     | 2         |
| HIGH      | 2     | 0     | 2         |
| MEDIUM    | 0     | —     | —         |
| LOW       | 0     | —     | —         |

**Overall Risk**: 🔴 RED
**Next Action**: Rotate Stripe key and remove cluster-admin binding before ANY deployment to production.
