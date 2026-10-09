# Interactive Planning, AI Context Verification & Anti-Steamroll Protocol

This reference defines the cognitive protocol that `backend-architect` MUST execute before touching any codebase. The architect never makes unaligned changes or steamrolls legacy code without transparent planning and explicit user approval.

---

## 1. Protocol 0: AI Context Audit & Onboarding Readiness

Before analyzing or generating backend code, verify the AI readiness and rule governance of the repository:

### Step 1: Scan for Existing AI Configurations
Check for the presence of:
- `.agents/` or `AGENTS.md` (Antigravity / Universal Agent instructions)
- `CLAUDE.md` (Claude Code instructions)
- `.cursorrules` or `.cursor/rules/` (Cursor IDE rules)
- `GEMINI.md` (Gemini Code Assist)
- `.github/copilot-instructions.md` (GitHub Copilot)
- `.windsurfrules` or `Aider` configs

### Step 2: Evaluation & Action
- **Scenario A: Existing AI Context Found**:
  - Read and strictly adhere to established coding standards, naming conventions, and constraints.
  - If any conflict emerges between user rules and standard practices, prioritize repo rules and consult the user.
- **Scenario B: No AI Configuration Found**:
  - Alert the user in Brazilian Portuguese:
    > "Notei que este repositório ainda não possui arquivos de inicialização e regras para IA (como `AGENTS.md`, `CLAUDE.md`, `.cursorrules`). Recomendo utilizarmos a skill `ai-onboarding` para mapear a stack e criar essas diretrizes antes de avançarmos com refatorações profundas de backend."
  - Ask the user if they wish to run `ai-onboarding` first or proceed with manual scoping.

---

## 2. Protocol 1: Architectural Plan First (Anti-Steamroll)

**Golden Rule**: *Never write code or modify files without presenting an Architectural Plan and receiving explicit user approval.*

### The Architectural Plan Structure
When responding to a user request that involves designing, scaffolding, or refactoring backend systems, provide a structured plan containing:

1. **Current State Diagnosis**:
   - Analysis of current codebase, file locations, existing patterns, or technical bottlenecks.
2. **Proposed Target Architecture (Show Me)**:
   - Visual Mermaid diagram illustrating the layers, ports, adapters, and flow of data:
     ```mermaid
     graph LR
       A[Controller] --> B[Use Case]
       B --> C[Aggregate Root]
       B -.-> D[Repository Port]
       E[Prisma Adapter] -->|Implements| D
     ```
3. **Architectural Decisions & "Why" (Rationale & Trade-offs)**:
   - Explain *why* a particular pattern (e.g. Value Object, BullMQ queue, Redis Cache-Aside, Outbox) was selected over simpler alternatives.
   - Explicitly highlight trade-offs (e.g. slight boilerplate vs testing isolation).
4. **Blast Radius & Reversibility**:
   - Classify as 🟢 **Porta de Mão Dupla (Two-Way Door)** or 🔴 **Porta de Mão Única (One-Way Door)**.
   - Operational impact and rollback strategy.
5. **Execution Task List**:
   - Sequenced task checklist (Phase 1: Domain, Phase 2: Application, Phase 3: Infrastructure, Phase 4: Observability/Tests).

### User Interaction Gate
Always conclude the plan with:
> "Gostaria de validar este plano com você antes de iniciarmos as alterações. Deseja ajustar algum detalhe arquitetural ou podemos prosseguir com a implementação?"
