# Testing Review Lens

Polyglot testing review lens.

## Two-step process

### Step 1: Run Tests (if possible)
- Detect test runner from project config
- Run affected test files
- Report failures as Critico

### Step 2: Review Test Quality — 8 lenses
1. **Untested code paths** (new use cases/services/controllers with no test file)
2. **Implementation-detail testing** (asserting internal state instead of behavior)
3. **Over-testing** (testing each field individually, duplicating type system guarantees)
4. **Excessive mocking** (mocking the thing being tested)
5. **Missing edge cases** (error paths, boundary conditions, concurrent scenarios)
6. **AAA violations** (code after first assert, multiple behaviors per test, multiple ACT calls)
7. **Convention violations** (not using project test utilities, fixtures vs builders)
8. **New code paths with zero tests** (most important finding)

## Language-specific test frameworks
- **TypeScript**: Jest, Vitest, Mocha
- **Java**: JUnit 5, Mockito, AssertJ
- **Python**: pytest, unittest, mock
- **Go**: testing package, testify
- **Rust**: #[test], proptest
- **Dart**: flutter_test, bloc_test, mocktail
- **C#**: xUnit, NUnit, Moq, FluentAssertions

## Severity
- **Critico**: Failing tests, new code with zero coverage, tests that don't actually test anything
- **Importante**: Missing edge cases, excessive mocking, implementation-detail testing
- **Menor**: Convention deviations, over-testing, readability
