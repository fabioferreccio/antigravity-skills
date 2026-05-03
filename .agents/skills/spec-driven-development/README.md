# Spec-Driven Development (SDD) Skill

This skill implements the methodological rigor of Spec-Driven Development in your workspace, enforcing the separation between intention ("The What") and technical implementation ("The How").

Inspired by the GitHub Spec Kit and technical articles on eliminating "vibe coding", this skill acts as an orchestrator that guides the developer through the 5 essential phases before and during AI code generation.

## Workflow Phases

0. **Constitution**: The non-negotiable rules and stack of the project.
1. **Specify**: Definition of business rules, user stories, and constraints.
2. **Plan**: System architecture, DB schema, and APIs for the spec functionality.
3. **Tasks**: Breaking down the plan into granular verifiable tasks.
4. **Implement**: Execution with human checkpoints at each step.

## How to Use

### Triggering the Skill

Just speak to the agent in Portuguese:

- *"iniciar sdd para o sistema de login"*
- *"criar spec de compartilhamento de fotos"*
- *"gerar tasks do sdd para o carrinho de compras"*
- *"speckit constitution"*

The agent will read the current context of the project, identify which SDD phase you are in, and suggest the next step and artifacts (e.g., `login.spec.md`, `login.plan.md`, etc). 

**Note**: As per the internal rules, all internal files (specs, plans, tasks) will be generated in **English**, while the agent will chat with you in **Portuguese**.
