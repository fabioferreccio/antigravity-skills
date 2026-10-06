# Example 01: Post-Session Retrospective and Standards Crystallization

## Scenario

During a 2-hour pairing session, an AI assistant refactored the checkout payment service. 
During the session:
1. The assistant initially wrote database queries inside the `CheckoutController`.
2. The developer had to instruct the agent to move queries to the `PaymentRepository`.
3. The assistant then wrote unit tests that mocked `PaymentRepository.find()`, `PaymentRepository.update()`, and `StripeClient.charge()`. The developer pointed out that testing whether the mock was called is a tautological mock test and demanded an integration test using Testcontainers instead.
4. The PR was submitted, and a senior engineer commented: "Please make sure idempotency keys are generated on the client and validated inside a database transaction before hitting Stripe."

At the end of the session, the developer runs:
> "Faça uma retrospectiva desta sessão e do feedback do PR para atualizarmos nossas regras."

---

## Agent Retrospective Execution

### 1. Friction & Feedback Log
- **Incident 1**: Controller directly accessed database layer.
- **Incident 2**: Agent generated tautological mock unit tests that verified mock calls rather than domain state or integration behavior.
- **Incident 3**: Reviewer caught missing idempotency key handling within database transactions.

### 2. Root Cause Analysis
- **Root Cause 1**: The codebase lacked a clear layer boundary rule in `coding-standards.md` explicitly forbidding ORM/repository calls inside controllers.
- **Root Cause 2**: Existing test instructions didn't forbid mock verification of basic CRUD calls.
- **Root Cause 3**: Financial transactions lacked a defined pattern for idempotent state machines.

### 3. Context Pruning Check
- The existing `AGENTS.md` had 15 lines explaining how to run Prettier and ESLint manually.
- *Pruning action*: Delete manual formatting text because husky pre-commit hooks and CI already enforce ESLint automatically.

---

## Retrospective Report Output

```markdown
## 🧠 Session Retrospective Report

### 🔍 Identified Patterns & Friction Points
1. **Direct DB access in Controllers**: Caused architectural churn and required manual correction.
2. **Tautological Mocks**: Wasted developer review time rejecting fragile mock tests.
3. **Idempotency in Financial Flows**: Crucial safety invariant was missing from standards.

### ✂️ Rule Pruning Proposals
- **[REMOVE from AGENTS.md]**: 15 lines of manual Prettier instructions. Pre-commit hooks run Biome automatically.

### 📝 Proposed Changes to `coding-standards.md`

```diff
+ ## 🛡️ Payment & Transaction Standards
+ - All payment operations MUST require a unique `Idempotency-Key` header.
+ - The idempotency record must be acquired and locked inside a database transaction BEFORE invoking external payment gateways.
+
+ ## 🧪 Testing Governance
+ - NEVER test repository mock calls (`expect(repo.save).toHaveBeenCalled()`).
+ - Verify business calculations with pure unit tests (zero mocks) and verify database behavior with real integration tests against Testcontainers.
```

### 💬 Human-in-the-Loop Confirmation
"Identifiquei 3 aprendizados chave e uma oportunidade de podar 15 linhas obsoletas de formatação no `AGENTS.md`. Gostaria que eu aplique essas atualizações no `coding-standards.md`?"
```
