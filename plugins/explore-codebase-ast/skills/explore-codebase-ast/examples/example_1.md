# Example: Mapping a Backend Architecture

## Input
```
User request: "/explore ./backend .ts,.js 3"
```

## Internal Execution
The AI verifies Python is installed and executes:
```bash
python .agents/skills/explore-codebase-ast/scripts/explore.py ./backend .ts,.js 3
```

## Expected Output
```markdown
## AST Architecture Map for `./backend`
📁 src/
  📁 controllers/
    📄 UserController.ts
      - Class: UserController
        - Method: getUser
        - Method: createUser
    📄 ProductController.ts
      - Class: ProductController
        - Method: listProducts
  📁 services/
    📄 UserService.ts
      - Class: UserService
        - Method: findById
```

## AI Response to User
"Analisei a estrutura do seu backend na pasta `./backend`. A arquitetura é composta por `UserController` e `ProductController` na pasta `controllers`, e a lógica de negócios parece estar em `services/UserService.ts`. Gostaria que eu abrisse algum desses arquivos para modificar um endpoint específico?"
