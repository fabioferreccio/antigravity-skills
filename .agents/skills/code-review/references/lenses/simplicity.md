# Simplicity Review Lens

Polyglot simplicity review lens. ALL findings are suggestions, not requirements.

## Review Focus

### 1. Overengineering
- Solving hypothetical future requirements that haven't manifested ("what if we need to support X someday?").
- Introducing heavyweight design patterns (Abstract Factory, Strategy, Command, Visitor, Builder) when a simple function, object mapping, or direct conditional (`switch` / `if`) achieves the same result with far less complexity.
- Creating generic, configurable frameworks for what is fundamentally a specific, bounded problem.

### 2. Over-Abstraction
- Creating classes, interfaces, or wrappers that encapsulate trivial 1-2 line operations without adding business invariants, validation, or error handling.
- Defining interfaces that have exactly **one** concrete implementation, no polymorphic variance, and no realistic test-substitution requirement. Interfaces should emerge from genuine multiplicity or seams, not ritual.
- Adding intermediate abstraction layers (e.g., `UserServiceHelper`, `UserProcessor`, `UserHandler`) that dilute accountability and obscure where the actual work happens.

### 3. Premature Abstraction (YAGNI & Rule of Three)
- Abstraction before concrete duplication. Enforce the **Rule of Three**: wait until identical logic appears 3 times before abstracting. Two occurrences can often be handled with slight divergence or tolerated; one occurrence is never an abstraction candidate.
- Violating **YAGNI** (You Aren't Gonna Need It): writing speculative parameters, flags, or configuration points that are only ever passed as their default value.

### 4. Function Fragmentation (Shallow Micro-Functions)
- Chopping a cohesive, straightforward 10-25 line linear algorithm into 5-6 micro-functions of 2 lines each ("trampoline functions" or shallow private helpers).
- **Destruction of Reading Locality**: Forcing the reader to jump back and forth across a file or multiple files to trace a simple sequence of operations.
- A function should be as long as necessary to tell a complete, coherent story. If helper functions are only called in one place and have no independent semantic meaning or reuse potential, prefer inlining them to preserve top-to-bottom reading flow.

### 5. Indirection Overuse (Anemic Pass-Throughs)
- Adding layers of indirection that do nothing but delegate to the next layer down with 1:1 parameter forwarding (e.g., `A.doWork(x) -> B.doWork(x) -> C.doWork(x)`).
- Wrappers that merely rename or re-export another module's method without enriching context, transforming types, or enforcing policies.
- Favor **Deep Modules** (narrow interface, substantial implementation) over shallow chains of pass-throughs.

### 6. Complex Branching
- Deeply nested conditionals (>3 levels), long switch/case statements without polymorphism where polymorphic dispatch is genuinely warranted, or flag-driven logic where boolean flags alter execution paths unpredictably.

### 7. Data Transformations
- Multi-step intermediary data transformations (mapping -> filtering -> remapping into temporary DTOs) when a single readable pipeline or direct mapping achieves the same result.

### 8. Missed Reuse
- Re-implementing logic, utility helpers, or algorithms that already exist and are well-tested elsewhere in the repository.

### 9. Premature Optimization
- Complex caching, manual memory pooling, indexing structures, or micro-optimizations introduced without profiler evidence or measured bottlenecks.

## Deep Duplication Check — 7 types
1. **Duplicate files** (same purpose, different names)
2. **Duplicate classes/services** (similar constructor deps, methods, responsibilities)
3. **Duplicate entities/models/DTOs** (same domain concept, different names)
4. **Duplicate types/interfaces/enums** (equivalent definitions)
5. **Duplicate functions/methods** (same logic exists elsewhere)
6. **Duplicate constants/configs** (replicated values)
7. **Duplicate validation/business rules** (same validation in multiple locations)

## NOT duplication
- Intentional per-layer representations (Entity vs Model vs DTO)
- Test doubles/mocks
- Types sharing fields but representing different concepts

## Search strategies for duplication
1. **Name similarity** (core concept + variations: singular/plural, abbreviations)
2. **Shape** (types with same fields)
3. **Responsibility** (services with same imports/dependencies)
4. **Import graph** (files importing same dependencies in same layer)
5. **Same module first** (intra-module duplication is more damaging)

## Grounding hierarchy
1. **Best**: existing pattern in the repo (with file:line reference)
2. **Good**: pseudocode alternative with reasoning
3. **Never**: vague criticism without concrete alternative

## Severity
- **Critico**: RARE — complexity introduces bugs or duplicate business rules causing data inconsistency
- **Importante**: Significant complexity with clearly simpler alternative, duplicate types/DTOs
- **Menor**: Alternative worth considering, minor duplication
