# A Philosophy of Software Design: Core Principles

Based on John Ousterhout's foundational treatise on software complexity, adapted for modern software engineering and agentic workflows.

---

## 1. Complexity is Incremental

Complexity does not occur from a single catastrophic mistake; it accumulates incrementally through hundreds of small, seemingly harmless design decisions.

> **Definition of Complexity**: Anything related to the structure of a software system that makes it hard to understand and modify the system.

### Symptoms of Complexity:
1. **Change Amplification**: A simple change requires modifications to many different places.
2. **Cognitive Load**: The developer or AI agent must know a large amount of information just to complete a task.
3. **Unknown Unknowns**: It is not obvious which pieces of code must be modified or what invariants must be preserved.

---

## 2. Deep Modules vs. Shallow Modules

The most powerful weapon against software complexity is the **Deep Module**:

```
┌──────────────────────────────────────┐
│       Narrow Public Interface        │  <-- Simple to learn, stable, minimal surface area
├──────────────────────────────────────┤
│                                      │
│      Substantial Implementation      │  <-- Hides file I/O, concurrency, caching,
│         (Information Hiding)         │      parsing, business invariants, state machines
│                                      │
└──────────────────────────────────────┘
             DEEP MODULE
```

### Contrast with Shallow Modules:
- **Shallow Module**: Interface is complex relative to the functionality provided (e.g., a class with 10 methods that each just forward to another 1-line method).
- **Extreme Shallow Sprawl**: Chaining Controller $\to$ UseCase $\to$ RepositoryInterface $\to$ RepositoryImpl $\to$ Entity $\to$ DTO $\to$ Mapper where each file contains 5 lines of code.

---

## 3. Information Hiding vs. Information Leakage

- **Information Hiding**: The most important technique for achieving deep modules. Each module encapsulates a few pieces of knowledge, data structures, or hardware mechanisms that represent design decisions.
- **Information Leakage**: Occurs when a design decision is reflected across multiple modules. When the decision changes, all those modules must change (Change Amplification).
