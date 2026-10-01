---
name: pr-craftsman
description: >
  Supreme Pull Request engineering skill that analyzes changesets to calculate
  operational blast radius, classifies decision reversibility (One-Way vs.
  Two-Way Doors), produces concise visual Mermaid architectural diagrams, and
  composes high-signal, human-friendly PR descriptions that eliminate reviewer
  fatigue.
version: 1.0.0
author: Fábio Ferreccio
tags:
  - pull-request
  - blast-radius
  - one-way-door
  - mermaid
  - code-review
  - supreme
triggers:
  - "craft pr"
  - "gerar pull request"
  - "criar descrição de pr"
  - "generate pr description"
  - "pr-craftsman"
  - "preparar pr"
  - "blast radius do pr"
scope: workspace
tools:
  - filesystem
  - terminal
security:
  network: false
  filesystem: read-write
  terminal: sandboxed
---

# Goal

Operate as an elite Pull Request engineer and human-experience advocate. Given a local git branch or diff, calculate the systemic blast radius, classify the operational decision door (One-Way vs. Two-Way), render an intuitive Mermaid architecture diagram, and construct a concise, high-signal PR description that guides reviewers effortlessly through the changes.

# Language Rule

- **User interaction & PR Description**: Brazilian Portuguese (PT-BR). (If repository description guidelines mandate English, follow the repository language).
- **Internal reasoning, code snippets, git commands**: English.

# Modular Context Loading

Load reference files on-demand:
- `references/blast-radius-matrix.md`: Quantitative blast radius evaluation rules.
- `references/decision-doors.md`: Taxonomy of One-Way vs. Two-Way Doors.
- `references/visual-diagrams.md`: Mermaid formatting conventions and diagram selection.

# Workflow

## Phase 1: Diff & Scope Discovery

1. Identify the active branch and default branch:
   ```bash
   git branch --show-current
   git symbolic-ref refs/remotes/origin/HEAD --short | sed 's|origin/||'
   ```
2. Extract the diff summary and file list:
   ```bash
   git diff origin/{DEFAULT_BRANCH}...HEAD --stat
   git log origin/{DEFAULT_BRANCH}...HEAD --oneline
   git diff origin/{DEFAULT_BRANCH}...HEAD
   ```
3. Group affected files by layer: Domain/Entities, Application/Use Cases, Infrastructure/DB, API/Controllers, Tests, Config.

## Phase 2: Risk & Blast Radius Calculation

→ Read `references/blast-radius-matrix.md` and `references/decision-doors.md`.

1. **Classify Decision Door**:
   - 🔴 **One-Way Door**: Schema changes with locks, public API breaking changes, auth/crypto mutations, billing/monetary calculations.
   - 🟢 **Two-Way Door**: Internal refactors behind deep modules, new endpoints, additive nullable migrations, UI tweaks, test suites.
2. **Assign Blast Radius Tier**: Tier 1 (Critical Core), Tier 2 (Internal Feature), or Tier 3 (Cosmetic/Leaf).
3. **Map Impacted Entities**: List touched tables, consumers, and dependencies.

## Phase 3: Visual Summary Generation (Show Me)

→ Read `references/visual-diagrams.md`.

Generate a clean, compact Mermaid diagram (max 8 nodes) illustrating:
- Architecture before vs. after, OR
- Sequence of calls across components, OR
- State machine transition changes.

> **Crucial Rule**: The Mermaid diagram accelerates cognitive comprehension, but does NOT replace textual explanations.

## Phase 4: Construct High-Signal PR Description

Assemble the PR description using the standard template:

```markdown
# [PR] {Título conciso e direto — max 10 palavras}

## 🚪 Triagem de Decisão & Raio de Explosão
- **Classificação**: 🔴 **Porta de Mão Única (Irreversível)** | 🟢 **Porta de Mão Dupla (Reversível)**
- **Nível de Risco (Blast Radius)**: Tier 1 (Alto) | Tier 2 (Médio) | Tier 3 (Baixo)
- **Justificativa**: {1-2 frases explicando o risco operacional e facilidade/dificuldade de rollback}
- **Rollback Viável**: {Sim, git revert imediato | Requer script de rollback de dados / migração}

---

## 🗺️ Visão Arquitetural das Alterações (Show Me)
```mermaid
{Mermaid Diagram}
```

---

## 🎯 Objetivo & Motivação
{Resumo em 2-3 parágrafos explicando o contexto de negócio, o problema resolvido e o que foi implementado.}

---

## 🔍 Guia para o Revisor ("Por onde começar")
1. Comece revisando o contrato/interface em `{file1}`.
2. Observe a implementação do caso de uso em `{file2}`.
3. Valide a suíte de testes de integração em `{file3}`.

---

## 🧪 Como foi testado?
- [ ] Testes unitários cobrindo casos de borda executados com sucesso
- [ ] Testes de integração com banco/containers validados
- [ ] Sem regressão em fluxos adjacentes
```

## Phase 5: Verification & Presentation

Present the drafted PR description to the user. Ask:
- *"Deseja que eu crie o PR via CLI (`gh pr create`) ou prefere copiar a descrição?"*
- Never execute `gh pr create` without explicit confirmation.
