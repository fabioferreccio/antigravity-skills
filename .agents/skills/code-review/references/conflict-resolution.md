# Conflict Resolution

Rules for resolving conflicts when multiple review agents flag the same code:

## Priority (highest → lowest)
1. **Security findings** → always take precedence
2. **Architecture findings** → take precedence over simplicity
3. **Database/Performance findings** → independent, never downgraded
4. **Testing findings** → independent
5. **Simplicity findings** → framed as suggestions ("considere", "uma alternativa seria")
6. **Style/naming findings** → lowest priority, never blocks

## Deduplication rules
- Same file:line, same concern → keep the more detailed finding
- Same file:line, different concerns → keep both, order by priority
- Same concern, different lines → keep all (not duplicates)

## Conflict patterns
- **Architecture vs Simplicity:** Note tension inline. Architecture wins but acknowledge the simplicity concern.
- **Security vs Simplicity:** Security always wins. Never remove validation for simplicity.
- **Testing vs Simplicity:** If testing recommends more tests but simplicity says it's over-testing, note both perspectives.
- **Frontend vs Architecture:** Architecture wins on layer violations; frontend wins on component API and a11y.
- **Complementary skill vs core reviewer:** Complementary skill findings are additive, never contradictory.

## Change-related vs Pre-existing
- If a finding is in code **THE USER CHANGED** → it's change-related (PRIMARY)
- If a finding is in surrounding/imported code the user did **NOT** change → it's pre-existing (SECONDARY)
- Pre-existing findings go in the collapsible "Observações Gerais" section
- **Exception:** if pre-existing code has a CRITICAL security issue → promote to change-related
