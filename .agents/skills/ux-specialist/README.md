# ux-specialist

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fabio Ferreccio

## Overview

O **UX Specialist Agent** analisa interfaces, fluxos de uso e componentes de design system para garantir que as experiências sejam intuitivas, consistentes e focadas no usuário. Ele aplica rigorosamente heurísticas de usabilidade e diretrizes de acessibilidade (WCAG) para identificar fricções e propor soluções acionáveis e de alto impacto.

## When to Use

- Durante o design ou code review de novas interfaces ou features front-end.
- Ao identificar queda de conversão em funis ou fluxos críticos (ex: checkout, onboarding).
- Quando precisar realizar auditorias de acessibilidade rápidas em componentes.
- Para simplificar fluxos confusos ou com alta carga cognitiva.

## When NOT to Use

- Para decisões puramente estéticas ou escolhas de branding sem impacto na usabilidade.
- Para gerar código de infraestrutura de back-end.

## Installation

### Local (workspace-scoped)

```bash
npx antigravity install ux-specialist
```

### Global (available everywhere)

```bash
npx antigravity install ux-specialist --global
```

## Usage

This skill activates automatically when:

- "auditar acessibilidade desta tela"
- "revisar o fluxo de checkout"
- "melhorar a usabilidade"
- "analisar interface com foco em UX"
- "validar heurísticas neste componente"

## Examples

### Example 1: Auditoria de Formulário

**User says**: "Analise a usabilidade do formulário de checkout em `checkout.tsx`"

**Agent does**:
1. Lê o arquivo e observa as validações e labels.
2. Reflete se os feedbacks de erro são rápidos e claros.
3. Identifica falta de contraste e mensagens de erro genéricas que vazam complexidade.

**Output**:
```
1. Problema UX: Mensagens de erro são exibidas apenas no envio e usam texto técnico.
2. Impacto no Usuário: Frustração e aumento do abandono do carrinho por não saber o que corrigir.
3. Violação de Heurística: Ajuda e documentação; Visibilidade do status do sistema.
4. Recomendação: Implementar validação inline (onBlur) e mudar a mensagem de "Erro 500" para "O CEP informado parece inválido".
5. Acessibilidade: O input de erro não possui aria-invalid="true" nem aria-describedby ligando à mensagem de erro.
6. Métricas Esperadas: Redução de 15% no abandono de checkout e redução de tempo de tarefa.
```

## Security

| Access | Level |
|---|---|
| Filesystem | read |
| Terminal | sandboxed |
| Network | false |
