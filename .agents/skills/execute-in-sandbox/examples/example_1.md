# Example: Running Unit Tests Safely

## Input
```
User request: "/run_test 'npm run test' node:18 15000"
```

## Internal Execution
The AI verifies Python is installed and executes:
```bash
python .agents/skills/execute-in-sandbox/scripts/sandbox.py "npm run test" "node:18" "15000"
```

## Expected Output
```text
Executing in Sandbox (Image: node:18, Timeout: 15.0s)...
Command: docker run --rm -v /path/to/project:/workspace:ro -w /workspace node:18 sh -c npm run test

--- STDOUT ---
> project@1.0.0 test
> jest

FAIL src/utils.test.js
  ● utils › calculateTotal › should return 0 for empty cart
    Expected: 0
    Received: NaN

--- STDERR ---
<empty>

Exit Code: 1
```

## AI Response to User
"Os testes falharam no caso do carrinho vazio (retornou `NaN` em vez de `0`). Já identifiquei que a função `calculateTotal` no `utils.js` não tem um check para arrays vazios. Vou ajustar isso no código agora mesmo e rodar o teste de novo."
