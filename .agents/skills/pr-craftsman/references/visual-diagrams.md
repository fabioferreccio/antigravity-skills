# Visual Diagrams & Show-Me Protocol

This reference instructs the agent on composing high-clarity Mermaid diagrams for pull requests, eliminating dense walls of text while preserving full context.

---

## 1. Diagram Selection Matrix

| Type of Change | Preferred Mermaid Diagram | Key Focus |
|---|---|---|
| **Architecture / Component Refactor** | `graph LR` / `flowchart TD` | Before vs. After subsystem wiring |
| **API / Multi-Service Interaction** | `sequenceDiagram` | Request, response, error scenarios |
| **Lifecycle / State Change** | `stateDiagram-v2` | State transitions, invalid paths |
| **Database Schema / ERD** | `erDiagram` | Foreign keys, new tables, cardinality |

---

## 2. Mermaid Formatting Rules

1. **Keep it Compact**: Maximum 5–8 nodes. A diagram with 30 nodes creates cognitive overload.
2. **Subgraphs for Before vs. After**:
   ```mermaid
   graph LR
     subgraph Before [Antes: Acoplamento Direto]
       A[Controller] --> B[Direct DB Query]
     end
     subgraph After [Depois: Arquitetura Limpa]
       A2[Controller] --> U[Use Case]
       U --> R[Repository Port]
     end
   ```
3. **Escaping Labels**: Quote all labels containing special characters or punctuation. Avoid raw HTML tags.
