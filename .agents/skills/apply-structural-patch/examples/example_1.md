# Example: Fixing a Validation Cirurgically

## Input
```
User request: "/apply_patch ./src/auth.js '--- a/src/auth.js\n+++ b/src/auth.js\n@@ -10,3 +10,3 @@\n function validateAge(age) {\n-  if (age < 18) return false;\n+  if (age < 21) return false;\n   return true;\n }'"
```

## Internal Execution
The AI executes the python wrapper script with the provided patch.
```bash
python .agents/skills/apply-structural-patch/scripts/apply_patch.py "./src/auth.js" "--- a/src/auth.js\n+++ b/src/auth.js\n@@ -10,3 +10,3 @@\n function validateAge(age) {\n-  if (age < 18) return false;\n+  if (age < 21) return false;\n   return true;\n }"
```

## Expected Output
```text
Attempting to apply patch to ./src/auth.js...
[SUCCESS] Patch applied successfully via git apply.
```

## AI Response to User
"O patch foi aplicado com sucesso usando `git apply`. A validação em `auth.js` agora exige idade mínima de 21 anos. Posso seguir com os testes unitários?"
