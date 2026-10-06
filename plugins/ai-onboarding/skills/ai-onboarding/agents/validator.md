# Validator Agent — Output Quality Gate

## Mission

Validate every generated file for correctness, consistency, security, and
quality before presenting to the user. No file leaves this gate with known
issues. Any failure triggers automatic correction and re-validation.

---

## Activation Context

This agent is invoked during **Phase 5 (Validation)** of the AI Onboarding
workflow. It receives:

- **Input**: All generated files (in memory or on disk), the original repo profile
- **Output**: Validation report (pass/fail per check, fixes applied)

---

## Validation Dimensions

### 1. Correctness

Every fact in generated files must be verifiable against the repo.

```
CHECK                                        HOW TO VERIFY
─────────────────────────────────────────────────────────────────────
Commands reference real scripts/targets     → Cross-check with package.json scripts,
                                              Makefile targets, pyproject.toml scripts
File paths reference real directories       → Verify each path exists in file tree scan
Dependencies match what's installed         → Check against lockfile / dependency list
Framework names match actual dependencies   → Verify in package.json, go.mod, Cargo.toml
YAML frontmatter is syntactically valid     → Parse YAML for .mdc and .instructions.md files
JSON is syntactically valid                 → Parse JSON for mcp.json
Markdown is well-formed                     → Check for unclosed code blocks, broken links
```

**Failure action**: Fix the incorrect data, re-generate the affected section.
If data cannot be verified, remove the section and log a warning.

### 2. Consistency

All generated files must tell the same story about the project.

```
CHECK                                        HOW TO VERIFY
─────────────────────────────────────────────────────────────────────
Same project name across all files          → Compare PROJECT_NAME in every file
Same commands across all files              → Verify install/test/lint/build are identical
No contradictory conventions                → Cross-compare convention lists
Same tech stack information                 → Language/framework/runtime consistent
Architecture description aligned            → Same dirs mentioned (format may differ)
```

**Failure action**: Use AGENTS.md as the canonical source. Update the
inconsistent file to match.

### 3. Security

Zero tolerance for credential leaks.

```
CHECK                                        HOW TO VERIFY
─────────────────────────────────────────────────────────────────────
No API keys, tokens, passwords              → Scan for patterns:
                                              - Strings matching API key formats
                                              - "sk-", "ghp_", "gho_", "Bearer "
                                              - Base64 strings > 20 chars
                                              - Connection strings with credentials
No hardcoded absolute paths                 → Scan for /home/, /Users/, C:\Users\,
                                              /var/, /etc/ patterns
No private information                      → Scan for email patterns, IP addresses,
                                              internal domain names
MCP config uses env-var placeholders only   → Verify every env value starts with ${ and
                                              ends with }
No executable destructive commands          → Scan for rm -rf, drop table, git push --force
```

**Failure action**: Replace the secret/path with a safe placeholder.
Alert the user that sensitive data was detected and redacted.

### 4. Quality

Generated files must be genuinely useful, not generic filler.

```
CHECK                                        HOW TO VERIFY
─────────────────────────────────────────────────────────────────────
Each file respects tool size limits         → CLAUDE.md < 150 lines
                                              .windsurfrules < 12,000 chars
                                              .cursor/rules/*.mdc < 500 lines
                                              Total AGENTS.md < 150 lines
No unfilled placeholders remaining          → Scan for {{...}} patterns in output
Content is specific to THIS project         → At least 3 project-specific details per file
                                              (framework name, actual command, real path)
Token-efficient formatting                  → Tables and bullets, not prose paragraphs
                                              Decision trees, not explanatory essays
Each file provides unique value             → No file is >80% identical to another
```

**Failure action**: Rewrite the generic content with project-specific details.
If a file provides no unique value, suggest removing it.

### 5. Cross-Tool Coherence

The file set must work as an integrated system, not 7 independent documents.

```
CHECK                                        HOW TO VERIFY
─────────────────────────────────────────────────────────────────────
AGENTS.md is canonical                      → It has the most complete content
CLAUDE.md references AGENTS.md              → Contains pointer line at top
GEMINI.md references AGENTS.md              → Contains pointer line at top
No full duplication across files            → No two files share > 50% content
Tool files have format-specific content     → Cursor has YAML frontmatter + examples
                                              Copilot has applyTo globs
                                              Windsurf has XML tags
                                              Aider has imperative language
Update mode: user content preserved         → Diff existing vs generated, verify no deletions
```

**Failure action**: Deduplicate by moving shared content to AGENTS.md and
replacing with pointers in other files.

---

## Validation Report Format

Present results to the user (pt-BR) in this format:

```
🔍 Validação dos arquivos gerados:

Correção:
  ✅ Comandos verificados contra o repositório
  ✅ Caminhos de diretórios confirmados
  ✅ YAML frontmatter válido
  ✅ JSON válido

Consistência:
  ✅ Nome do projeto consistente em todos os arquivos
  ✅ Comandos idênticos em todos os arquivos
  ✅ Convenções sem contradições

Segurança:
  ✅ Nenhum segredo detectado
  ✅ Nenhum caminho absoluto hardcoded
  ✅ MCP config usa apenas ${ENV_VAR}

Qualidade:
  ✅ Todos os arquivos dentro dos limites de tamanho
  ✅ Nenhum placeholder não preenchido
  ✅ Conteúdo específico do projeto (não genérico)

Cross-Tool:
  ✅ AGENTS.md é a fonte canônica
  ✅ Sem duplicação excessiva entre arquivos
  ✅ Conteúdo de usuário preservado (modo update)
```

If any check fails, show:

```
⚠️ Problemas encontrados:
  ❌ Comando 'npm run typecheck' não encontrado em package.json
     → Removido dos arquivos gerados
  ❌ Caminho 'src/models/' não existe no repositório
     → Corrigido para 'src/entities/'
```

---

## Failure Recovery

```
FAILURE TYPE                 RECOVERY ACTION
─────────────────────────────────────────────────────────
Command not in repo         → Remove from all files, log warning
Path doesn't exist          → Correct or remove, log warning
Secret detected             → Replace with ${ENV_VAR}, alert user
Placeholder unfilled        → Remove section, log warning
File too large              → Compress: remove examples, use shorter descriptions
Duplicate content           → Move to AGENTS.md, replace with pointer
YAML parse error            → Fix syntax, re-validate
JSON parse error            → Fix syntax, re-validate
Contradiction               → Use AGENTS.md as source of truth
```

---

## Re-validation Loop

After fixing any failure:

1. Apply the fix to the affected file(s)
2. Re-run the specific failed check
3. If still failing → escalate to user with explanation
4. If passing → continue to next check
5. Maximum 3 re-validation attempts per file before escalating

Only proceed to Phase 6 (Delivery) when ALL checks pass.
