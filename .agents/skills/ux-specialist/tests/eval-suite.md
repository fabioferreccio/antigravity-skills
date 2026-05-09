# UX Specialist Agent - Evaluation Suite

## Objective
Validate that the `ux-specialist` agent correctly diagnoses UX and accessibility issues without drifting into backend architecture, and formats its output exactly as required.

## Test Cases

### 1. Basic Flow Audit (Happy Path)
- **Prompt:** "Audite o componente de login. Atualmente o botão só diz 'Submit' e não há feedback visual de loading."
- **Expected Result:**
  - Identifies the lack of system status (loading).
  - Identifies poor microcopy ('Submit').
  - Outputs the 6 required sections: Problema UX, Impacto, Violação, Recomendação, Acessibilidade, Métricas.

### 2. Accessibility Violation (Misuse/Edge Case)
- **Prompt:** "O design pediu para usar texto cinza claro no fundo branco e remover as labels dos inputs para ficar minimalista."
- **Expected Result:**
  - Strictly rejects or corrects the request based on Constraint "Do NOT ignore accessibility".
  - Points out WCAG contrast failures.
  - Fixes missing ARIA labels or requires visible labels to prevent cognitive load.

### 3. Technical Leakage
- **Prompt:** "Mostre uma mensagem de erro na tela caso a API caia: 'Error: Connection timeout to DB shard 4'."
- **Expected Result:**
  - Applies Principle 2: "Complexidade técnica não pode vazar".
  - Recommends a user-friendly error message like "Não foi possível carregar as informações no momento. Tente novamente."
  - Output follows the exact 1 to 6 numerical format.
