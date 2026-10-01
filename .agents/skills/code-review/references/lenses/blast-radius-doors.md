# Blast Radius & Reversibility Lens (One-Way vs. Two-Way Doors)

This lens guides the evaluation of operational risk, systemic blast radius, and decision reversibility for code changes under review.

## 1. Decision Reversibility Taxonomy

Every pull request or changeset must be classified into one of two operational categories:

### 🟢 Two-Way Door (Reversible / Low Risk)
A decision that can be easily undone or rolled back without permanent side effects, data loss, or cascading external breakage.
- **Criteria**:
  - Pure cosmetic, formatting, or documentation changes.
  - Internal UI component adjustments that do not break user session states.
  - Adding new non-destructive unit/integration tests.
  - Adding optional configuration keys with backward-compatible defaults.
  - Internal refactoring behind stable interfaces with complete test coverage.
- **Review Scrutiny**: Fast-track review. Focus on correctness, maintainability, and clean conventions.

### 🔴 One-Way Door (Irreversible / High Risk)
A decision that is difficult or impossible to roll back once deployed to production, or whose rollback incurs significant downtime, data corruption, or external system desynchronization.
- **Criteria**:
  - Database schema alterations (column dropping, type changing requiring table lock/rewrite, non-nullable additions without default).
  - Data migrations affecting monetary balances, user identities, or billing.
  - Breaking public API contract changes (OpenAPI, GraphQL, gRPC proto, webhook signatures).
  - Authentication, authorization, cryptography, token verification, or session lifecycle changes.
  - Modifying concurrency locks, distributed transactions, or queue consumer idempotency keys.
  - Deleting or changing public cloud infrastructure definitions (Terraform, CloudFormation, Kubernetes StatefulSets).
- **Review Scrutiny**: Ruthless, multi-perspective review. Requires explicit rollback strategy, blast radius containment, and senior technical oversight.

---

## 2. Blast Radius Assessment Matrix

Evaluate the blast radius across four dimensions:

| Dimension | Low Blast Radius | High Blast Radius |
|---|---|---|
| **Data & Persistence** | Reads only, or writes to isolated non-critical table | Drops/modifies core transactional tables, modifies financial state |
| **API & Integrations** | Internal private endpoint with 1 caller | Public API or shared service consumed by multiple external clients |
| **User Experience** | Non-critical flow, admin internal tool | Critical user path (checkout, signup, auth, payment) |
| **Dependencies** | Local utility function | Shared foundation module imported across 10+ packages |

---

## 3. Output Format Component

Inject the classification block at the very top of the review report:

```markdown
### 🛡️ Triagem de Risco e Raio de Explosão

- **Decisão**: 🔴 **Porta de Mão Única (Irreversível)** | 🟢 **Porta de Mão Dupla (Reversível)**
- **Justificativa**: {1-2 concise sentences explaining why it is one-way or two-way}
- **Raio de Explosão**:
  - **Domínios Afetados**: `{domain-1}`, `{domain-2}`
  - **Contratos & APIs**: `{stable | breaking changes detected | none}`
  - **Dados & Migrations**: `{safe | lock risk | table rewrite | none}`
  - **Plano de Rollback Viável**: `{Sim, git revert imediato | Não, requer script de rollback de dados}`
```
