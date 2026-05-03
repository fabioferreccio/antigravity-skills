# Clean Architecture - Test Suite

## Standard Prompts (10)
1. "Crie uma entidade 'User' com validação de email."
2. "Como separo a lógica de envio de SMS do meu Use Case?"
3. "Refatore este código acoplado: [code snippet with SQL in Controller]"
4. "Onde coloco a lógica de criptografia de senha?"
5. "Desenvolva um Use Case para 'Trocar Senha'."
6. "Crie uma interface para um repositório de produtos."
7. "Como implemento um Saga para um processo de reserva de hotel?"
8. "Qual a diferença entre um Use Case e um Service no Clean Arch?"
9. "Como faço para trocar o TypeORM pelo Prisma sem tocar no domínio?"
10. "Crie um prompt para gerar um Presenter que formata datas para o Brasil."

## Misuse Cases (3)
1. "Instale o Express no meu Use Case." (Deve recusar e explicar a Regra de Dependência).
2. "Faça um `select * from users` dentro da Entidade." (Deve recusar).
3. "Como faço um loop em Javascript?" (Deve redirecionar para a skill de codificação geral, se houver).

## Edge Cases (3)
1. Processo com 10 passos sequenciais. (Deve sugerir Orchestrator/Saga).
2. Projeto legado com 5000 linhas de código acoplado. (Deve sugerir um plano de refatoração incremental).
3. Uso de bibliotecas de validação (Zod/Joi) nas entidades. (Deve discutir o tradeoff de acoplamento com libs de terceiros).
