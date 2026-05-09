# Example 01: Redundancy Audit — Authentication Logic

## Scenario

A mid-size engineering organization (6 teams, 12 backend services) asks a Staff
Engineer to investigate repeated reports of inconsistent JWT validation behavior
across services. Token expiration is handled differently in 4 services.

---

## User Input

```
Temos 6 times de backend. Estou recebendo relatos de comportamento inconsistente
na validação de JWT. Alguns serviços rejeitam tokens que outros aceitam.
Precisamos de um diagnóstico e plano de ação.
```

---

## Agent Response

### 🔍 Phase 1: OBSERVE

Analyzing the described context:
- 6 backend teams, ~12 services mentioned
- JWT validation inconsistency reported across services
- Divergent token acceptance behavior = signature of AP-001 (Reinvented Wheels)

Identified signals:
- Same authentication logic implemented N times independently
- No shared authentication library referenced
- Behavioral divergence in edge cases (expiration, clock skew, audience validation)

---

### 🧠 Phase 2: REFLECT

Questions this raises:
- Does a shared auth library already exist? If so, why aren't all services using it?
- Are the divergences intentional (different auth requirements per domain) or accidental?
- Is there an organizational standard for JWT validation? If yes, is it enforced in CI?

Assessment:
- This matches AP-001 (Reinvented Wheels) — HIGH severity
- Potential also AP-010 (Standards Without Enforcement) — MEDIUM severity
- Abstraction threshold: ≥4 implementations of same pattern → EXCEEDED → shared library is warranted

---

### ⚡ Phase 3: ACT — Mode: Redundancy Audit

---

## 1. Diagnóstico

### Estado Atual

Identificadas **4+ implementações independentes** de validação JWT entre os times de backend. Comportamento divergente confirmado em:
- Validação de expiração (clock skew treatment)
- Validação de audience (`aud` claim)
- Tratamento de tokens revogados
- Formato de erros retornados (401 vs 403 vs 500)

### Duplicidades Identificadas

| Pattern | Repos | Severity | Est. Maintenance Cost |
|---|---|---|---|
| JWT validation logic | 4+ services | HIGH | 8-12h/mês (bugs + sync) |
| Auth error handling | 6 services | MEDIUM | 4-6h/mês |
| Token parsing utilities | 4 services | HIGH | 3-5h/mês |

**Total estimado**: 15-23h/mês de overhead de manutenção evitável.

---

## 2. Impacto Organizacional

- **Times afetados**: Todos os 6 times de backend
- **Custo de manutenção**: ~20h/mês (bugs que surgem em um serviço e devem ser replicados manualmente)
- **Impacto em segurança**: Token aceito em serviço A pode ser rejeitado em B → falhas de UX e potencial vetor de ataque
- **Impacto em onboarding**: Novos engenheiros devem aprender 4 variações do mesmo padrão

---

## 3. Anti-patterns Identificados

| ID | Anti-Pattern | Severity | Evidence |
|---|---|---|---|
| AP-001 | Reinvented Wheels | HIGH | 4 implementações independentes de JWT |
| AP-010 | Standards Without Enforcement | MEDIUM | Sem validação de auth em CI |

---

## 4. Recomendações

### Prioridade Alta
1. **Criar shared library `@org/auth-jwt`** — Impacto: elimina 4 implementações divergentes | Esforço: 5-8 dias

### Prioridade Média
2. **Definir e documentar Auth Standard** — Impacto: previne regressão futura | Esforço: 2-3 dias
3. **Adicionar enforcement em CI** — Impacto: garante adoção do padrão | Esforço: 1-2 dias

---

## 5. Plano de Refatoração

### Fase 1: Quick Win — Diagnóstico Completo (Semana 1)
- [ ] Mapear todas as implementações JWT nos 12 serviços — Owner: Staff Engineer
- [ ] Identificar a implementação mais completa e correta como base — Owner: Security + Backend leads
- [ ] Documentar todos os casos edge encontrados — Owner: Staff Engineer

### Fase 2: Criação da Library (Semanas 2-3)
- [ ] Extrair e publicar `@org/auth-jwt` v1.0.0 com API estável — Owner: Platform team
- [ ] Cobertura de testes: 100% dos edge cases mapeados — Owner: Platform team
- [ ] Documentação de migração para cada serviço consumidor — Owner: Platform team

### Fase 3: Migração Paralela (Semanas 4-6)
- [ ] Cada time adota `@org/auth-jwt` mantendo implementação antiga em paralelo — Owner: cada time
- [ ] Validar paridade de comportamento em staging por 1 semana — Owner: cada time
- [ ] Remover implementações antigas após validação — Owner: cada time

### Fase 4: Enforcement (Semana 7)
- [ ] Adicionar lint rule ou architecture test em CI para barrar novas implementações locais — Owner: DevOps/Platform

---

## 6. Riscos

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Library introduz regressão de segurança | Low | Critical | Security review + pentest antes do GA |
| Time não migra (low adoption) | Medium | High | Tornar enforcement obrigatório em CI após 60 dias |
| Breaking change no contrato da library | Low | High | SemVer estrito + deprecation notice de 30 dias |

---

## 7. Estratégia Incremental

**Semana 1**: Mapear e documentar todas as variações existentes  
**Semana 2-3**: Publicar v1.0.0 da `@org/auth-jwt` com testes completos  
**Semana 4-6**: Migração paralela nos 6 times (suporte da Platform team)  
**Semana 7**: Enforcement automático em CI — novas implementações locais bloqueadas  

**Critérios de sucesso**:
- Implementações duplicadas: 4 → 1
- Overhead de manutenção: 20h/mês → < 2h/mês
- Comportamento JWT: 100% consistente entre serviços
- Cobertura de testes da library: ≥ 95%
