# Example: Greenfield Project

**User**: "Quero iniciar o sdd para um novo módulo de comentários num blog."

**Agent**:
"Identifiquei que estamos iniciando o fluxo Spec-Driven Development (SDD) para o módulo de comentários.
Notei que já temos um `constitution.md` na raiz do projeto, portanto as regras arquiteturais estão claras.

Vou gerar agora a **Fase 1: Specification**.

*(Creates the file `comments.spec.md` in English with:)*
- User Stories
- Moderation rules
- Performance acceptance criteria
- Edge cases (e.g., mass spam)

**User**: "A spec está ótima. Pode seguir com o plano."

**Agent**:
"Iniciando **Fase 2: Plan**. Baseado na Spec e na Constituição do projeto, aqui está a arquitetura técnica."

*(Creates the file `comments.plan.md` in English with:)*
- DB Schema (`comments`, `moderation_logs` tables)
- Endpoints (`POST /api/comments`, `GET /api/comments`)
- Expected React components.

**User**: "Ok, gere as tarefas."

**Agent**:
"Iniciando **Fase 3: Tasks**. Desmembrando o plano."

*(Creates the file `comments.tasks.md` in English with checkboxes.)*

**User**: "Pode começar a primeira task."

**Agent**:
"Iniciando **Fase 4: Implement**. Implementando a criação da tabela no banco de dados..."
*(Generates the code)*
"Pronto, valide a implementação. Quando aprovar, marco a tarefa como `[x]` e prosseguimos."
