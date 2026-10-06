# Active Remediation Protocol (Human-in-the-Loop)

This protocol defines how the `code-review` skill prepares and suggests automated remediations (auto-fix commits) without violating user agency or executing unilateral changes.

## 1. Principles

1. **Human Decision First**: The agent NEVER commits changes or publishes review comments directly to the remote repository without explicit confirmation.
2. **Deterministic Remediation**: Only safe, deterministic, non-breaking modifications are eligible for automated commit suggestions:
   - Formatting and indentation alignment.
   - Removing unused imports, dead variables, or extraneous comments.
   - Applying repository-defined naming conventions or lint fixes (`npm run lint -- --fix`).
   - Adding missing TypeScript types or obvious null-safety guards.
3. **No Behavioral Rewrites**: Complex domain logic, algorithm restructuring, or architectural redesigns must remain as actionable review findings for human consideration, NOT silent auto-commits.

---

## 2. Interactive Phase Flow

At the end of the review output (Phase 6/7), the agent compiles:
1. **Fixable Items**: Minor style, lint, convention, and hygiene items that can be remedied safely.
2. **Review Comments**: Findings intended for inline posting on GitHub / GitLab / Bitbucket.

Then, present the options clearly:

```markdown
---

### 🛠️ Próximos Passos & Remediação Ativa

Foram identificados **{N} ajustes automáticos seguros** (estilo, importações não utilizadas, tipagem e convenções).

Como deseja proceder?
1. **Aplicar correções seguras via commit**: Deseja que eu aplique essas correções diretamente em um commit nesta branch? *(Sim / Não)*
2. **Publicar comentários no MR/PR**: Deseja que eu publique os apontamentos detalhados diretamente como comentários inline na plataforma? *(Sim / Não)*
```

If the project lacks a `coding-standards.md` file, append:
```markdown
3. **Padrões de Código**: Notei que o projeto não possui um arquivo `coding-standards.md`. Deseja que eu gere um arquivo inicial baseado nos padrões e convenções detectados na base? *(Sim / Não)*
```
