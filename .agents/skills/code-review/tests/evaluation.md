# code-review — Evaluation Suite

## Valid Activation Prompts (10)

### V-01: Implicit Review Request (Portuguese)
```
Input: "revisa meu código"
Expected activation: YES
Expected mode: Implicit → detect current branch or ask
Key assertions:
  - Agent activates on generic Portuguese review request
  - Agent attempts to detect current branch via `git branch --show-current`
  - If branch is main/master, agent asks what to review
  - If on a feature branch, agent proceeds with branch review mode
  - Agent outputs review in Portuguese (pt-BR)
```

### V-02: Branch Review with Explicit Branch Name
```
Input: "code review do branch feature/xyz"
Expected activation: YES
Expected mode: Branch review
Key assertions:
  - Agent extracts branch name "feature/xyz"
  - Agent runs git diff origin/main...origin/feature/xyz
  - Agent indexes project on first run
  - Agent launches review agents based on detected files
  - Agent presents unified findings with severity classification
```

### V-03: GitLab MR Review
```
Input: "pode revisar o MR https://gitlab.com/org/repo/-/merge_requests/42"
Expected activation: YES
Expected mode: MR/PR review
Key assertions:
  - Agent detects GitLab MR URL pattern
  - Agent extracts owner, repo, and MR number
  - Agent fetches MR metadata via glab CLI or MCP
  - Agent offers inline comment posting on GitLab
  - Agent handles GitLab-specific suggestion syntax
```

### V-04: GitHub PR Review (English)
```
Input: "review this PR https://github.com/org/repo/pull/123"
Expected activation: YES
Expected mode: MR/PR review
Key assertions:
  - Agent detects GitHub PR URL pattern
  - Agent works in English when prompted in English
  - Agent fetches PR diff and metadata
  - Agent offers inline comment posting on GitHub
  - Agent uses GitHub suggestion syntax (```suggestion blocks)
```

### V-05: Single File Review
```
Input: "revisa o arquivo src/services/payment.service.ts"
Expected activation: YES
Expected mode: File review
Key assertions:
  - Agent extracts file path
  - Agent reads the file and its dependencies
  - Agent launches focused review agents (no diff context)
  - Agent includes Migration Plan section
  - Agent reviews the entire file, not just changes
```

### V-06: Pre-merge Review (English)
```
Input: "review before merge"
Expected activation: YES
Expected mode: Implicit → detect current branch
Key assertions:
  - Agent understands "before merge" implies branch review
  - Agent detects current branch
  - Agent proceeds with branch review mode
  - Agent emphasizes merge-blocking findings (Crítico severity)
```

### V-07: Develop Branch Review
```
Input: "revisa meu branch develop"
Expected activation: YES
Expected mode: Branch review
Key assertions:
  - Agent handles non-feature branches
  - Agent diffs develop against main
  - Agent warns if diff is very large (develop may accumulate many changes)
  - Agent suggests reviewing specific feature branches instead if diff > 1000 lines
```

### V-08: Mixed Language Review Request
```
Input: "review antes de mergear"
Expected activation: YES
Expected mode: Implicit → detect current branch
Key assertions:
  - Agent handles mixed Portuguese/English input
  - Agent detects current branch
  - Agent proceeds with branch review mode
  - Agent responds in Portuguese (user's primary language detected)
```

### V-09: Explicit File Review (English)
```
Input: "file review src/controllers/user.controller.ts"
Expected activation: YES
Expected mode: File review
Key assertions:
  - Agent detects "file review" + path pattern
  - Agent reads the file and dependencies
  - Agent launches focused review agents
  - Agent includes Migration Plan section
```

### V-10: Bitbucket PR Review
```
Input: "revisa o PR do bitbucket https://bitbucket.org/org/repo/pull-requests/55"
Expected activation: YES
Expected mode: MR/PR review
Key assertions:
  - Agent detects Bitbucket PR URL pattern
  - Agent extracts workspace, repo, and PR number
  - Agent fetches PR metadata via Bitbucket API
  - Agent warns that Bitbucket inline comments require manual token setup
  - Agent uses Bitbucket-appropriate suggestion syntax
```

---

## Misuse Prompts — Should NOT Activate (3)

### M-01: Template Creation Request
```
Input: "cria um arquivo de review template"
Expected activation: NO
Reason: User wants to create a file, not perform a code review. This is a file creation task.
Expected response: Agent does not activate code-review skill. If directly asked, clarifies that this skill performs code reviews, not template generation. May suggest creating the file manually or using a different tool.
```

### M-02: Educational Question
```
Input: "o que é code review?"
Expected activation: NO
Reason: User asks for a definition/explanation, not an actual review. This is an informational query.
Expected response: Agent does not activate code-review skill. Provides a general explanation of code review practices without launching the review pipeline.
```

### M-03: Comment Deletion Request
```
Input: "deleta os comentários do review"
Expected activation: NO
Reason: User wants to delete existing review comments, not create a new review. This is a different action entirely.
Expected response: Agent does not activate code-review skill. May explain how to delete comments on the relevant platform (GitHub, GitLab, Bitbucket) or clarify that the skill only creates reviews.
```

---

## Edge Cases (3)

### E-01: Branch Review Without Branch Name
```
Input: "revisa meu branch"
Expected behavior:
  - Agent detects "branch" keyword but no branch name
  - Agent runs `git branch --show-current` to detect the current branch
  - If current branch is a feature branch → proceeds with review
  - If current branch is main/master → asks "Qual branch você quer que eu revise?"
  - If git is not available → asks for the branch name explicitly
  - Agent never assumes or invents a branch name
```

### E-02: Bare Review Command
```
Input: "review"
Expected behavior:
  - Agent detects a review intent but no context (no branch, no file, no URL)
  - Agent asks: "O que você gostaria que eu revisasse? Posso revisar:
    1. Um branch (ex: feature/xyz)
    2. Um MR/PR (cole o link)
    3. Um arquivo específico (ex: src/services/auth.service.ts)
    4. O branch atual"
  - Agent does NOT proceed without user confirmation
  - Agent does NOT review the entire repository
```

### E-03: Very Large Diff (>1000 Lines)
```
Input: "revisa meu branch feature/big-refactor" (diff has 2500+ lines)
Expected behavior:
  - Agent detects the branch and starts diff analysis
  - Agent counts changed lines and detects > 1000 line threshold
  - Agent warns: "O diff do branch feature/big-refactor tem ~2500 linhas alteradas.
    Revisões acima de 1000 linhas perdem qualidade. Recomendo revisar em partes:
    1. Apenas arquivos de backend (api/)
    2. Apenas arquivos de frontend (web/)
    3. Apenas arquivos de teste
    4. Um diretório específico
    Qual parte deseja revisar primeiro?"
  - Agent does NOT silently truncate or skip files
  - Agent proceeds with full review only if user explicitly confirms
```

### E-04: Business Logic — False Dichotomy in Document Classification
```
Input: "revisa o arquivo src/utils/document.ts" (file contains the following code)

  const NON_ALPHANUMERIC_REGEX = /[^A-Z0-9]/g;
  const CPF_LENGTH = 11;

  function normalizeDocument(value?: string | null): string {
    return (value ?? "").toUpperCase().replace(NON_ALPHANUMERIC_REGEX, "");
  }

  function getDocumentType(value?: string | null): PlaceDocumentTypeEnum {
    return normalizeDocument(value).length === CPF_LENGTH
      ? PlaceDocumentTypeEnum.CPF
      : PlaceDocumentTypeEnum.CNPJ;
  }

  export function isCnpj(value?: string | null): boolean {
    return getDocumentType(value) === PlaceDocumentTypeEnum.CNPJ;
  }

Expected behavior:
  - Agent activates business-logic-reviewer as a core agent
  - Agent detects AT LEAST 3 of these 5 issues:
    1. [Crítico] isCnpj("A00") returns true — 3 chars is not a CNPJ
    2. [Crítico] False dichotomy: anything not CPF is classified as CNPJ (no INVALID state)
    3. [Importante] isCnpj name implies validation but only checks length
    4. [Importante] No checksum/mod-11 validation for either CPF or CNPJ
    5. [Importante] Documents with same length (NIE/NIF) would be misclassified
  - Agent provides concrete fix with proper validation logic
  - Agent includes Migration Plan with risk-ordered steps
  - Finding severity is Crítico (not Importante or Menor)
```

---

## Quality Assertions

### Severity and Classification
- [ ] Severity classification is consistent across languages (same issue = same severity in Go, TS, Python)
- [ ] "No issues found" is a valid output — not every review produces findings
- [ ] Pre-existing issues are clearly separated from change-related findings
- [ ] Findings include file path, line number, what, why, and fix

### Inline Comments
- [ ] GitHub comments use ````suggestion` syntax for code suggestions
- [ ] GitLab comments use the GitLab-specific suggestion syntax
- [ ] Bitbucket comments degrade gracefully if token is not configured
- [ ] Comment anchoring uses the correct diff line (not the file line)
- [ ] Failed comment posting is reported per-comment, not as a batch failure

### Agent Orchestration
- [ ] Complementary skills are detected and utilized when available
- [ ] Review agents are selected based on detected languages and changed files
- [ ] Agent conflict resolution follows priority rules (security > architecture > business-logic > simplicity)
- [ ] Agents that find no issues do not produce empty sections in the output

### Business Logic Correctness
- [ ] Functions named `is*`, `validate*`, `check*` are verified against their implementation
- [ ] Classification logic is checked for false dichotomies and non-exhaustive partitions
- [ ] Domain algorithms (CPF, CNPJ, Luhn, IBAN) are verified against canonical implementations
- [ ] Boundary inputs (null, empty, too short, too long) are traced through the code path
- [ ] Financial/monetary calculations are flagged when using floating-point arithmetic

### Project Context
- [ ] Project index is created on first run and reused on subsequent runs
- [ ] Index correctly identifies languages, frameworks, and architecture patterns
- [ ] Index is invalidated when project structure changes significantly

### Output Quality
- [ ] Positive observations (Pontos Fortes) are always included
- [ ] Output language matches the user's detected language (Portuguese or English)
- [ ] Migration Plan is included in single-file reviews
- [ ] Cross-language consistency checks appear in polyglot reviews
- [ ] Findings reference specific lines, not vague file-level comments

### Edge Case Handling
- [ ] Branch not found → clear error message, not a crash
- [ ] File not found → clear error message, asks for correct path
- [ ] Empty diff → reports "no changes to review"
- [ ] Binary files in diff → skipped with a note
- [ ] Merge conflicts in diff → warns user to resolve before review
