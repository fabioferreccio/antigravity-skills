# Simplicity Review Lens

Polyglot simplicity review lens. ALL findings are suggestions, not requirements.

## Review Focus
1. **Unnecessary abstractions** (classes/services/utilities without clear justification)
2. **Complex branching** (nested conditionals, long switch/case, flag-driven logic)
3. **Data transformations** (multi-step when fewer steps are possible)
4. **Missed reuse** (existing solutions in repo that solve the same problem)
5. **Over-engineering** (solving hypothetical future requirements)
6. **Premature optimization** (complex caching/indexing without proven need)

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
