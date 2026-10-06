# Example 2: Safe Migration on Large Table

## Context

SaaS application. The `documents` table has 50M rows in production.
Team needs to add a `processed_at TIMESTAMP NOT NULL` column.

## User Input

```
Preciso adicionar uma coluna NOT NULL em documentos com 50M de linhas.
A migration está assim:

ALTER TABLE documents ADD COLUMN processed_at TIMESTAMP NOT NULL;
```

## Expected Agent Output

```
## 1. Diagnóstico
Migration perigosa: ADD COLUMN NOT NULL sem DEFAULT em tabela de 50M rows.
Em PostgreSQL < 11: rewrite completo da tabela + lock exclusivo durante toda a operação.
Em PostgreSQL >= 11: ainda seguro? Depende — NOT NULL sem DEFAULT ainda exige constraint check.

## 2. Root Cause
- NOT NULL sem DEFAULT = PostgreSQL precisa validar cada row existente
- Em versões < 11: table rewrite completo (horas de downtime)
- Em versões >= 11: ADD COLUMN com DEFAULT volátil ainda causa rewrite
- Lock exclusivo bloqueia leitura e escrita durante a operação

## 3. Query Plan Anotado
N/A — DDL operation. Lock analysis:
  ALTER TABLE → ACCESS EXCLUSIVE LOCK
  Duration estimada (50M rows, SSD): 15-45 minutos
  Impacto: 100% das queries na tabela bloqueadas durante este período

## 4. Impacto
- Downtime: 15-45 minutos de indisponibilidade total em documents
- Lock: ACCESS EXCLUSIVE impede qualquer SELECT/INSERT/UPDATE
- Risco de timeout em conexões aguardando o lock
- Replication lag pode aumentar significativamente em replicas

## 5. Recomendação — Migração em 3 Fases (Zero Downtime)

-- FASE 1: Adicionar coluna nullable (sem lock de longa duração)
ALTER TABLE documents ADD COLUMN processed_at TIMESTAMP;
-- Em PostgreSQL >= 11 com DEFAULT constante: instantâneo
-- Executar em horário de baixo tráfego de qualquer forma

-- FASE 2: Backfill em lotes (sem locks)
-- Executar via script ou job agendado
UPDATE documents
SET processed_at = created_at  -- ou valor de negócio adequado
WHERE processed_at IS NULL
  AND id BETWEEN :batch_start AND :batch_end;
-- Repetir em lotes de 10.000-50.000 rows com SLEEP entre lotes

-- FASE 3: Adicionar constraint NOT NULL (após backfill completo)
-- PostgreSQL 12+: validação sem lock completo
ALTER TABLE documents
  ALTER COLUMN processed_at SET NOT NULL;

-- Verificação antes da fase 3:
SELECT COUNT(*) FROM documents WHERE processed_at IS NULL;
-- Deve retornar 0

## 6. Trade-offs
✅ Zero downtime: operação distribuída em 3 fases
✅ Reversível a qualquer momento antes da fase 3
⚠️  Duração total: horas/dias dependendo do tamanho do lote e volume de dados
⚠️  Aplicação deve tolerar NULL em processed_at durante o backfill
❌ NÃO usar valores DEFAULT com funções voláteis (NOW()) no ADD COLUMN — causa rewrite

## 7. Rollback Plan
-- Qualquer fase pode ser revertida:
ALTER TABLE documents DROP COLUMN processed_at;
-- DROP COLUMN é rápido (mark-only em PostgreSQL)
-- Dados serão efetivamente removidos no próximo VACUUM
```
