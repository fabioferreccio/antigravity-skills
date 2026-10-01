# Seams, Leverage, and Locality

This reference provides the design vocabulary for structuring module boundaries that are easy for humans to review and easy for AI agents to navigate.

---

## 1. Key Architectural Concepts

| Concept | Definition | Goal in Agentic Codebases |
|---|---|---|
| **Leverage** | The ratio of the amount of work a module accomplishes compared to the complexity of invoking it. | **High Leverage**: Callers make one simple call; the module reliably handles errors, state, and coordination. |
| **Seam** | A boundary where a module can be inspected, intercepted, or swapped without altering its consumers. | Clean seams allow testing with real in-memory substitutes without mocking internal wires. |
| **Locality** | The degree to which related code and invariants live close together. | High locality avoids cross-file ripple effects when changing business rules. |
| **Pass-Through** | A method or class that does little or nothing except call another method or class with similar parameters. | **Anti-Pattern**: Pass-throughs increase cognitive overhead without adding depth. |

---

## 2. The 3 Questions for Every Abstraction

Before creating a new class, interface, or helper function, ask:

1. **Does this abstraction hide significant complexity?**
   If the answer is no, you are likely creating a shallow module.
2. **If this internal implementation changes, does the caller need to know?**
   If yes, information is leaking across the boundary.
3. **Can this module be tested by verifying observable inputs and outputs?**
   If testing requires spying on internal function calls, the module lacks depth.
