# Codebase Design - Evaluation Test Suite

## Scoring Rubric

| Criteria | Pass | Fail |
|---|---|---|
| Deep Module Focus | Recommends simple interface with rich hidden functionality | Recommends fragmenting logic into tiny shallow classes |
| Information Hiding | Hides volatile implementation details behind stable abstractions | Exposes internal data structures or implementation mechanics |
| Seam Detection | Pinpoints highest leverage architectural seams | Blindly refactors trivial code with no blast radius benefit |
| Inversion of Interfaces | Designs interfaces defined by caller needs, not callee internals | Forces caller to understand engine guts |
| Anti-Pattern Recognition | Correctly identifies pass-through methods and classitis | Endorses boilerplate forwarders as "clean code" |

---

## Standard Prompts (6)

### 1. "Refatore este sistema de envio de email que possui EmailFormatter, EmailSender, EmailValidator e EmailLogWrapper."
**Expected**:
- Diagnoses *Classitis* and shallow module proliferation.
- Recommends collapsing into a deep `EmailDeliveryService` module:
  - Interface: `deliver(message: EmailMessage): Promise<DeliveryResult>`
  - Hidden internals: Validation, HTML/text formatting, SMTP pooling, retry policies, and structured audit logging.
- Shows concrete before/after interface and architectural leverage gain.

### 2. "Como devo expor as opções de parsing no meu novo MarkdownParser?"
**Expected**:
- Recommends a simple, powerful default signature: `parse(source: string, options?: ParseOptions): AST`.
- Enforces *General-Purpose vs Specialized* balance (Chapter 6): defaults handle 95% of standard use-cases without configuring plugins or low-level lexer hooks.
- Extensibility handled via clean hooks/plugins without bloating core signature.

### 3. "Nosso time criou 12 classes para orquestrar um pagamento Pix. Como você avalia?"
**Expected**:
- Identifies pass-through methods and distributed state across shallow layers.
- Calculates cognitive load: caller has to instantiate and wire 12 objects to execute one operation.
- Recommends consolidating into a deep `PixPaymentGateway` with simple external contract `charge(invoice: Invoice): Promise<PaymentReceipt>`.

### 4. "Identifique as melhores costuras (seams) para testar este monolito Node.js sem mockar 20 serviços."
**Expected**:
- Scans for boundary seams (I/O, third-party APIs, database adapter) and business seams.
- Identifies natural choke points (e.g. `PaymentClient`, `EventBus`, `StorageDriver`).
- Explains how deep module seams allow testing rich business workflows against real domain logic without brittle tautological mocks.

### 5. "O que você acha desta classe `UserManager` que tem 4 métodos e apenas repassa para `UserRepository`?"
**Expected**:
- Classifies as *Pass-Through Method* and *Shallow Layer* anti-pattern.
- Explains that the abstraction adds cognitive cost and indirection without adding value or hiding complexity.
- Proposes either eliminating the pass-through wrapper or enriching `UserManager` to own user lifecycle business rules and cache management.

### 6. "Como refatorar este componente React gigante que faz fetch, gerencia 15 estados e renderiza 3 tabelas?"
**Expected**:
- Applies *Split vs Conjoin* decision matrix.
- Separates along orthogonal seams: extracts a custom hook or domain controller for state/query coordination (`useUserManagementPanel`), and delegates sub-tables to focused presentation components.
- Avoids over-fragmentation into microscopic 5-line components that pass 10 props downward.

---

## Misuse Cases (3)

### 1. "Divida esta classe de 50 linhas em 8 classes de 6 linhas para seguir o Princípio da Responsabilidade Única estrito."
**Expected Behavior**:
- **REFUSE/CHALLENGE**: Warns against dogmatic single-responsibility misinterpretation that leads to classitis and shallow modules. Explains Ousterhout's rule: classes should be deep, not arbitrarily small.

### 2. "Crie uma interface separada para cada método individual da minha aplicação."
**Expected Behavior**:
- **REFUSE**: Explains interface bloat. Interfaces should represent cohesive capabilities at architectural seams, not 1:1 mirrors of trivial methods.

### 3. "Como posso usar o codebase-design para configurar meu Kubernetes cluster?"
**Expected Behavior**:
- **REDIRECT**: Explains that `codebase-design` focuses on software architecture, interface depth, and module design. Recommends delegating to `devops-agent`.
