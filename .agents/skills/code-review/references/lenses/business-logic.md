# Business Logic Review Lens

Polyglot business logic correctness lens. Focuses on whether code **does what it claims to do** — semantically, algorithmically, and domain-wise.

## 1. Semantic Naming Integrity

Functions, methods, and variables whose **name promises more than the implementation delivers**.

| Signal | Example |
|---|---|
| Name implies validation but implementation only checks format/length | `isCnpj()` that only checks `length !== 11` |
| Name implies transformation but silently drops data | `toUpperCase()` that also strips characters without documenting it |
| Name implies boolean check but always returns one branch for invalid input | `isValid()` that returns `true` for empty strings |
| Name implies completeness but handles only a subset | `parseAddress()` that ignores suite/apartment |
| Predicate name (`is*`, `has*`, `can*`) with no actual validation logic | `isEmail()` that only checks for `@` |

**How to check:** For every function whose name starts with `is`, `has`, `can`, `validate`, `verify`, `check`, `ensure`, `assert`, `parse`, or `compute` — compare what the name promises against what the implementation actually does. If the name implies domain validation (e.g., `isCnpj`, `isEmail`, `isUUID`), the implementation MUST perform the canonical validation for that domain concept, not just a structural/length check.

## 2. Classification & Categorization Soundness

Logic that classifies inputs into categories using **false dichotomies** or **non-exhaustive partitions**.

| Pattern | Problem |
|---|---|
| `if (x) return A; else return B;` when C, D, E are valid | Binary classification of a multi-class problem |
| `switch` without `default` on non-enum types | Unhandled cases silently fall through |
| Classification by **length alone** when domain requires **content validation** | `length === 11 ? CPF : CNPJ` ignores invalid inputs |
| Enum-like classification without an `UNKNOWN`/`INVALID` variant | Forces callers to assume every input is classifiable |
| Type narrowing that assumes mutual exclusivity when it does not hold | NIE and NIF may share length but have different validation rules |

**How to check:** For every `if/else`, `switch`, ternary, or pattern match that classifies input: (a) list all possible categories the domain defines, (b) verify the code handles all of them, (c) verify there is an explicit `invalid`/`unknown`/`error` path for inputs that do not match any category.

## 3. Domain Algorithm Correctness

Code that implements well-known domain rules (tax IDs, financial calculations, standards) but **gets the algorithm wrong or skips it entirely**.

| Domain | Validation required |
|---|---|
| CPF (Brazil) | 11 digits + two check digits via mod-11 algorithm |
| CNPJ (Brazil) | 14 digits + two check digits via weighted mod-11 |
| RUT (Chile) | Mod-11 with specific weight sequence |
| NIF/NIE (Spain) | Letter assignment from remainder of numeric part ÷ 23 |
| SSN (USA) | Format AAA-BB-CCCC, area/group/serial rules |
| IBAN | Mod-97 check on rearranged alphanumeric |
| Credit card (Luhn) | Luhn algorithm on digit sequence |
| UUID | Format + version-specific bit patterns |
| Email (RFC 5322) | Far more complex than `contains('@')` |
| Currency/money | Decimal precision, rounding rules (ROUND_HALF_EVEN for financial) |

**How to check:** When code claims to validate, generate, or verify a well-known identifier or standard, verify that the canonical algorithm is implemented — not just a length or format check. If the code normalizes input before validation, verify the normalization does not destroy information needed by the algorithm.

## 4. Boundary & Edge Case Blindness

Inputs that **should be rejected** but are silently accepted because the code lacks guards.

| Blind spot | Example |
|---|---|
| Empty/null/undefined not rejected at entry point | `normalizeDocument(null)` returns `""` and proceeds |
| Input too short or too long for domain | 3-character string classified as CNPJ |
| Characters that survive normalization but are invalid | Non-ASCII digits after `toUpperCase()` |
| Negative numbers where only positive are valid | `calculateDiscount(-1)` returns a surcharge |
| Zero as divisor, index, or multiplier | `totalPrice / quantity` when `quantity` can be 0 |
| Maximum value overflow | 32-bit integer overflow in financial accumulation |
| Unicode edge cases | `"café".length` differs from byte count; `toUpperCase()` varies by locale |

**How to check:** For every public function, trace what happens with: `null`, `undefined`, `""`, very short input, very long input, negative numbers, zero, `NaN`, `Infinity`, unicode edge cases. If any of these silently produce a "valid" result instead of throwing or returning an error, flag it.

## 5. Mathematical & Algorithmic Correctness

Errors in formulas, precision, rounding, or computational logic.

| Error type | Example |
|---|---|
| Floating-point for money | `0.1 + 0.2 !== 0.3` — use integer cents or Decimal |
| Percentage applied in wrong order | Tax on discount vs discount on tax |
| Off-by-one in loops, ranges, pagination | `for (i = 0; i <= length)` processes one extra |
| Integer division truncation | `7 / 2 === 3` in integer languages loses remainder |
| Rounding mode for financial operations | Banker's rounding vs truncation vs round-half-up |
| Unit mismatch | Mixing meters/feet, seconds/milliseconds, cents/dollars |
| Accumulation error | Summing floats in a loop instead of reducing from integers |
| Modular arithmetic errors | Wrong modulus or wrong remainder interpretation |

**How to check:** For every arithmetic operation: verify the types preserve needed precision, verify rounding mode is explicit and appropriate, verify units are consistent across the computation, verify edge values (0, negative, max) produce correct results.

## 6. Invariant Violations

Pre-conditions and post-conditions that the code **assumes but never verifies**.

| Invariant type | Example |
|---|---|
| Non-null assumption | Accessing `.length` on a value that could be null |
| Non-empty collection | Calling `array[0]` or `.reduce()` without empty check |
| Unique constraint assumed in code but not in DB | Code assumes email is unique but DB has no unique index |
| Ordering assumption | Code assumes array is sorted but nothing guarantees it |
| Idempotency assumption | Retry logic assumes operation is idempotent when it is not |
| Referential integrity assumed | Code assumes FK exists but no constraint enforces it |

**How to check:** For every function parameter or intermediate value: (a) list what the code assumes about it (non-null, positive, non-empty, sorted, unique), (b) verify whether the assumption is enforced by a guard clause, type system, or upstream validation. Unverified assumptions are invariant violations.

## 7. State Machine Integrity

State transitions that permit **illegal paths** or miss **terminal states**.

| Issue | Example |
|---|---|
| Skip-ahead transitions | Order going directly from `PENDING` to `DELIVERED` |
| Missing terminal state | No `CANCELLED` or `EXPIRED` state |
| Unreachable state | State defined in enum but no transition leads to it |
| Bidirectional where unidirectional is required | Allowing `REFUNDED` → `PAID` |
| Missing guard on transition | `ship()` callable when `status !== PAID` |
| Concurrent mutation | Two threads transitioning the same entity |

**How to check:** When code manages entity lifecycle through status fields, enums, or state patterns: draw the implied state graph, verify all transitions are guarded, verify terminal states exist and are reachable, verify no illegal transitions are possible.

## 8. Temporal & Ordering Assumptions

Logic that depends on **order, timing, or timezone** without explicit guarantees.

| Assumption | Problem |
|---|---|
| Events arrive in order | Distributed systems do not guarantee ordering |
| Clock is monotonic | System clock can jump backward (NTP adjustment) |
| "Today" is the same timezone everywhere | `new Date()` uses server timezone; user may be in another |
| Duration calculation ignores DST | One "day" can be 23 or 25 hours |
| Comparison of timestamps from different sources | Clock skew between services |
| "Before" / "after" without strict comparison operator | `<=` vs `<` at boundaries |

**How to check:** For every timestamp comparison, date arithmetic, or ordering assumption: verify the timezone is explicit, verify DST transitions are handled, verify the comparison operator is correct at boundaries, verify ordering is not assumed in distributed contexts.

## Severity Calibration

- **Crítico**: Function name promises validation but implementation accepts invalid input (e.g., `isCnpj("A00")` → `true`); financial calculation with floating-point precision loss; classification logic that silently misclassifies
- **Importante**: Missing edge case handling that could produce wrong results in production; naming mismatch between function intent and behavior; unverified invariants on hot paths
- **Menor**: Opportunities to add more robust validation; naming suggestions for clarity; defensive programming improvements
