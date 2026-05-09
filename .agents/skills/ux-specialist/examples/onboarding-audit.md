# Auditoria de Onboarding

**User Request:** "Por favor, revise o nosso fluxo de onboarding. Os usuários estão reclamando que não sabem quantos passos faltam para terminar e acabam fechando a aba no meio."

**Agent Reasoning (Simulated):**
1. **Observação**: Falta de indicador de progresso. Alta taxa de abandono (fechando a aba).
2. **Reflexão**: Isso é intuitivo? Não. Há fricção? Sim, incerteza gera ansiedade. Qual heurística? Visibilidade do status do sistema.
3. **Ação**: Sugerir a inclusão de um "stepper" ou barra de progresso no topo, com microcopy claro (ex: "Passo 2 de 4").
4. **Avaliação**: Isso vai reduzir a ansiedade e, consequentemente, a taxa de abandono.

**Output:**

1. **Problema UX**: O fluxo de onboarding não possui um indicador de progresso, deixando os usuários "cegos" sobre a duração do processo.
2. **Impacto no Usuário**: Gera ansiedade, incerteza e fadiga cognitiva, levando ao abandono antes da conclusão.
3. **Violação de Heurística**: Visibilidade do status do sistema (Visibility of system status).
4. **Recomendação**: Adicionar uma barra de progresso (Progress Bar) ou um Stepper (Passo 1 de 4) no topo do componente, garantindo que o usuário saiba exatamente onde está e o que falta.
5. **Acessibilidade**: A barra de progresso deve usar `role="progressbar"`, com `aria-valuenow`, `aria-valuemin` e `aria-valuemax` definidos para que leitores de tela consigam anunciar o avanço no fluxo.
6. **Métricas Esperadas**: Redução significativa na taxa de abandono (drop-off) no meio do funil e aumento na conversão final de novos usuários.
