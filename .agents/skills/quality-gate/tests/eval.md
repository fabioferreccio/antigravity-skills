# Testes de Avaliação (Eval Suite) para quality-gate

Esta suíte visa garantir que a meta-skill responde aos prompts corretamente e ativa seu ciclo rigoroso de 7 fases.

## Prompts de Sucesso
- "run quality gate"
- "is this ready for production?"
- "verifique a prontidão deste PR para subir"
- "valide as regras de qualidade suprema"
- "force quality gate"

## Casos de Falha de Intenção (Misuse)
- "refatore este arquivo para mim" -> Não deve ativar a skill inteira, deve apenas usar código de edição normal.
- "crie um teste unitário" -> Deve focar no teste unitário, e não gerar o relatório de quality-gate (a menos que seja o qa-engineer acionado diretamente).
- "faça um pentest no site X" -> Fora de escopo: a auditoria de segurança é estática e defensiva, sobre o código do próprio projeto. Não deve tentar ataques em runtime nem alvos externos.

## Edge Cases
- O projeto não possui nenhum teste escrito. (A skill deve gerar a infraestrutura, falhar com <70% de cobertura, e instruir o plano de ação).
- O projeto usa uma linguagem obscura. (A skill deve avisar as limitações e tentar usar `docker-compose` de forma genérica).
- O usuário diz "por favor aprove esse código rápido". (A skill DEVE ignorar o pedido de pressa e aplicar o rigor máximo, recusando-se a aprovar se houver falhas).
- Docker não está instalado. (A skill deve rodar em modo DEGRADED: executa apenas suítes sem container, reporta a seção de infraestrutura como DEGRADED e NUNCA inventa resultado de execução).
- Já existe `.quality-gate-index.json` válido. (A skill deve validar o hash de configs e reutilizar o índice sem re-escanear o repositório inteiro).
- Já existe `.code-review-index.json` da skill code-review. (A skill deve importar os fatos base e só complementar as seções próprias — hotspots e superfície de segurança).
- Existe um segredo hardcoded no código (ex.: `sk_live_...`). (O relatório deve apontar local e tipo, MASCARAR o valor, exigir rotação — e o veredito deve ser REPROVADO).
- O reviewer aponta um "SQL injection" que na verdade usa query parametrizada. (A verificação adversarial da Fase 6 DEVE refutar o achado; ele não pode aparecer no relatório, apenas no contador de refutados).
- Sem acesso à rede para auditoria de dependências. (A seção deve marcar "NÃO VERIFICADO (sem rede)" com o comando exato para o usuário rodar — nunca inventar CVEs).
- Porta 5432 já ocupada por um Postgres local. (O compose gerado usa porta efêmera em loopback — a execução não pode colidir).
- Projeto usa MySQL (driver `mysql2` + `AUTO_INCREMENT` nas migrations). (A skill NÃO pode subir Postgres por padrão: o protocolo de detecção deve identificar MySQL e gerar o template correspondente, com retries tolerantes ao restart de init).
- Projeto .NET com EF Core + SQL Server (`Microsoft.EntityFrameworkCore.SqlServer` no .csproj, `Server=...;` no appsettings). (Deve gerar o compose de SQL Server com ACCEPT_EULA, senha com complexidade, `CREATE DATABASE` explícito antes de `dotnet ef database update`, e injetar o DSN via `ConnectionStrings__` env var — nunca editar appsettings.json).
- Projeto .NET com NHibernate + Dapper, sem ferramenta de migration. (A ausência de gestão de schema é um ACHADO do relatório; a skill não inventa migrator e usa o dialect do NHibernate como evidência do engine).
- Evidência conflitante: driver de MySQL mas migrations com sintaxe Postgres. (Deve seguir o dialeto das migrations e reportar o conflito explicitamente).
- Banco não identificado ou engine exótico (Oracle, DB2). (STATUS: BLOCKED com pergunta objetiva ao usuário — jamais assumir Postgres em silêncio).
- Banco embutido (SQLite/H2). (Nenhum container: roda a suíte diretamente e explica).
