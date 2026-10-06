# Example: Paginating a large Configuration File

## Input
```
User request: "/read ./config/legacy-settings.json 200 250"
```

## Internal Execution
The AI verifies Python is installed and executes:
```bash
python .agents/skills/read-file-chunked/scripts/read.py ./config/legacy-settings.json 200 250
```

## Expected Output
```text
 200 |   "database": {
 201 |     "host": "localhost",
 202 |     "port": 5432,
...
 250 |   }
```

## AI Response to User
"Li as linhas de 200 a 250 do `legacy-settings.json`. Vejo que a configuração do banco de dados está na linha 201 (`host: localhost`). Deseja que eu crie um script para alterar essa chave dinamicamente?"
