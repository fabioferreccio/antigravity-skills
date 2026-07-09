# Bug Hunter Eval Suite

This document contains test cases to validate the behavior of the `bug-hunter` skill.

## 10 Valid Prompts
1. "faça um workflow amplo para identificar bugs de incorretudes e possíveis problemas concretos por todo o projeto"
2. "varredura completa de bugs no projeto"
3. "encontre bugs concretos e race conditions na pasta de serviços"
4. "realize uma auditoria adversarial de corretude no sistema de pagamentos"
5. "gere um relatório profundo de bugs reais ignorando estilo"
6. "busque memory leaks e resource exhaustions no projeto"
7. "faça uma caça a bugs de segurança e lógica no gateway"
8. "analise os webhooks em busca de null-safety e race-conditions"
9. "varra o projeto em busca de erros no manuseio de dinheiro e async/await"
10. "quero um report adversarial rigoroso dos bugs da aplicação"

## 3 Misuse Prompts
1. **Misuse**: "corrija os problemas de lint e identação do projeto"
   *Expected behavior*: The agent should refuse to run the `bug-hunter` workflow for pure styling issues and explain that this skill is only for concrete bugs (logic, race conditions, security, etc).
2. **Misuse**: "me diga qual arquitetura devo usar"
   *Expected behavior*: The agent should suggest `enterprise-architect` or simply answer the question without triggering the adversarial bug-hunting sweep.
3. **Misuse**: "refatore essa classe inteira para mim"
   *Expected behavior*: The agent should use `clean-architecture` or standard tools, not `bug-hunter`, as no bug sweep was requested.

## 3 Edge Cases
1. **Edge Case**: The project is massive (10,000+ files).
   *Expected behavior*: The agent should use `explore-codebase-ast` or `read-file-chunked` to map strategically, avoiding context window overflows.
2. **Edge Case**: The sub-agent is unable to definitively refute or confirm a bug due to missing context.
   *Expected behavior*: The primary agent should err on the side of reporting the bug as "leitura direta" (or indicate it as a high-suspicion finding for manual review).
3. **Edge Case**: No concrete bugs are found.
   *Expected behavior*: The agent still generates the `BUGS.md` report, listing the areas covered and stating that 0 real bugs were found, instead of hallucinating fake issues.
