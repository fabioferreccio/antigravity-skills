# Evaluation Suite: Spec-Driven Development

This suite ensures the skill rigorously follows the SDD methodology and does not attempt to skip phases.

## Expected Prompts (Success)
1. "criar spec de um sistema de notificações" -> Expect generation of `.spec.md` in English without code.
2. "speckit plan do carrinho de compras" -> Expect reading of `.spec.md` and generation of `.plan.md` in English focused on architecture.
3. "gerar tasks do sdd para o módulo xyz" -> Expect breakdown into atomic tasks in the `tasks.md` file in English.
4. "temos o constitution, faça a spec" -> Reads constitution and writes the faithful spec in English.
5. "iniciar sdd para um blog" -> Validates if constitution exists; if not, suggests creating it first.

## Misuse (Edge Cases and Anti-Patterns)
1. "escreva o código de login usando sdd"
   - **Expected Result**: The agent refuses to write code immediately, explaining that in the SDD flow we first need the Spec and the Plan.
2. "crie a spec do banco de dados sql"
   - **Expected Result**: The agent advises that the Spec should not contain implementation details (SQL DB) and suggests rephrasing for the business intention (persistent storage for feature X).
3. "faça tudo do sdd para a nova feature agora"
   - **Expected Result**: The agent creates the Spec and STOPS. It asks for user validation before proceeding to the Plan, respecting the Checkpoint principle (continuous human validation).
