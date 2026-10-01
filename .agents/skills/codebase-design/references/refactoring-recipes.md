# Refactoring Recipes: Shallow Modules to Deep Modules

Step-by-step refactoring patterns to eliminate shallow sprawl and boost architectural leverage.

---

## Recipe 1: Collapsing Shallow Pass-Throughs

### Symptoms
- Class `A` implements method `doSomething()` which only calls `B.doSomething()`, which only calls `C.doSomething()`.
- Modifying a parameter requires editing 3 interfaces and 3 classes.

### Refactoring Steps
1. Identify the core responsibility and the primary invariant owner.
2. Inline the intermediate pass-through classes into a single cohesive module.
3. Expose one clean, high-leverage interface to external callers.
4. Remove the redundant interfaces and DTO mappers that were merely forwarding fields.

---

## Recipe 2: Pushing Invariants Down (Making Anemic Classes Deep)

### Symptoms
- Domain entity is an anemic data holder with public getters/setters.
- Multiple callers perform identical validation checks before updating the entity.

### Refactoring Steps
1. Make entity fields private or readonly.
2. Create expressive mutation methods (e.g., `account.withdraw(amount)` instead of `account.balance -= amount`).
3. Embed validation, balance limits, and domain event creation directly inside the mutation method.
4. Callers now have a simpler interface and cannot corrupt internal state.
