# Stack Detection Patterns

File-to-technology mapping reference for the Scanner agent. Organized by
category with indicator files, config patterns, and dependency names.

---

## Languages

| Language | Indicator Files | Config Files | Key Extensions |
|---|---|---|---|
| **JavaScript** | `package.json` (no TS) | `jsconfig.json`, `.babelrc` | `.js`, `.jsx`, `.mjs`, `.cjs` |
| **TypeScript** | `tsconfig.json` | `tsconfig.*.json` | `.ts`, `.tsx`, `.mts`, `.cts` |
| **Python** | `pyproject.toml`, `setup.py`, `requirements.txt`, `Pipfile` | `setup.cfg`, `tox.ini` | `.py`, `.pyi` |
| **Go** | `go.mod` | `go.sum` | `.go` |
| **Rust** | `Cargo.toml` | `Cargo.lock`, `rust-toolchain.toml` | `.rs` |
| **Java** | `pom.xml`, `build.gradle` | `settings.gradle`, `gradle.properties` | `.java` |
| **Kotlin** | `build.gradle.kts` (with kotlin plugin) | `kotlin-js-store/` | `.kt`, `.kts` |
| **C#** | `*.csproj`, `*.sln` | `nuget.config`, `global.json` | `.cs` |
| **Ruby** | `Gemfile` | `Gemfile.lock`, `.ruby-version` | `.rb`, `.erb` |
| **PHP** | `composer.json` | `composer.lock`, `phpunit.xml` | `.php` |
| **Swift** | `Package.swift` | `*.xcodeproj`, `*.xcworkspace` | `.swift` |
| **Dart/Flutter** | `pubspec.yaml` | `analysis_options.yaml` | `.dart` |
| **Elixir** | `mix.exs` | `mix.lock` | `.ex`, `.exs` |
| **Scala** | `build.sbt` | `project/build.properties` | `.scala` |
| **Clojure** | `deps.edn`, `project.clj` | `shadow-cljs.edn` | `.clj`, `.cljs`, `.cljc` |
| **Zig** | `build.zig` | `build.zig.zon` | `.zig` |
| **C/C++** | `CMakeLists.txt`, `Makefile` | `.clang-format`, `compile_commands.json` | `.c`, `.cpp`, `.h`, `.hpp` |
| **Haskell** | `*.cabal`, `stack.yaml` | `cabal.project` | `.hs` |

---

## Frameworks

### JavaScript / TypeScript

| Framework | Detection Pattern |
|---|---|
| **React** | `react` in dependencies |
| **Next.js** | `next` in dependencies, `next.config.*` file |
| **Vite** | `vite` in devDependencies, `vite.config.*` file |
| **Vue** | `vue` in dependencies |
| **Nuxt** | `nuxt` in dependencies, `nuxt.config.*` file |
| **Angular** | `@angular/core` in dependencies, `angular.json` file |
| **Svelte** | `svelte` in dependencies |
| **SvelteKit** | `@sveltejs/kit` in dependencies |
| **Astro** | `astro` in dependencies, `astro.config.*` file |
| **Remix** | `@remix-run/react` in dependencies |
| **Express** | `express` in dependencies |
| **NestJS** | `@nestjs/core` in dependencies, `nest-cli.json` file |
| **Fastify** | `fastify` in dependencies |
| **Hono** | `hono` in dependencies |
| **Koa** | `koa` in dependencies |
| **AdonisJS** | `@adonisjs/core` in dependencies |
| **Electron** | `electron` in dependencies |
| **Tauri** | `@tauri-apps/api` in dependencies, `src-tauri/` dir |
| **React Native** | `react-native` in dependencies |
| **Expo** | `expo` in dependencies, `app.json` with expo config |

### Python

| Framework | Detection Pattern |
|---|---|
| **Django** | `django` in dependencies, `manage.py` file, `settings.py` |
| **Flask** | `flask` in dependencies |
| **FastAPI** | `fastapi` in dependencies |
| **Starlette** | `starlette` in dependencies |
| **Tornado** | `tornado` in dependencies |
| **Pyramid** | `pyramid` in dependencies |
| **Streamlit** | `streamlit` in dependencies |

### Go

| Framework | Detection Pattern |
|---|---|
| **Gin** | `github.com/gin-gonic/gin` in go.mod |
| **Echo** | `github.com/labstack/echo` in go.mod |
| **Fiber** | `github.com/gofiber/fiber` in go.mod |
| **Chi** | `github.com/go-chi/chi` in go.mod |
| **Gorilla Mux** | `github.com/gorilla/mux` in go.mod |

### Rust

| Framework | Detection Pattern |
|---|---|
| **Actix-web** | `actix-web` in Cargo.toml dependencies |
| **Axum** | `axum` in Cargo.toml dependencies |
| **Rocket** | `rocket` in Cargo.toml dependencies |
| **Warp** | `warp` in Cargo.toml dependencies |

### Java / Kotlin

| Framework | Detection Pattern |
|---|---|
| **Spring Boot** | `spring-boot-starter` in pom.xml or build.gradle |
| **Quarkus** | `io.quarkus` in pom.xml |
| **Micronaut** | `io.micronaut` in pom.xml or build.gradle |
| **Jakarta EE** | `jakarta.` packages in dependencies |

### Ruby

| Framework | Detection Pattern |
|---|---|
| **Rails** | `rails` in Gemfile, `config/routes.rb` file |
| **Sinatra** | `sinatra` in Gemfile |
| **Hanami** | `hanami` in Gemfile |

### PHP

| Framework | Detection Pattern |
|---|---|
| **Laravel** | `laravel/framework` in composer.json, `artisan` file |
| **Symfony** | `symfony/framework-bundle` in composer.json |
| **Slim** | `slim/slim` in composer.json |

---

## Package Managers

| Package Manager | Lockfile | Config File |
|---|---|---|
| **npm** | `package-lock.json` | `.npmrc` |
| **Yarn (Classic)** | `yarn.lock` (no `.yarnrc.yml`) | `.yarnrc` |
| **Yarn (Berry)** | `yarn.lock` + `.yarnrc.yml` | `.yarnrc.yml` |
| **pnpm** | `pnpm-lock.yaml` | `.npmrc`, `.pnpmrc` |
| **Bun** | `bun.lockb` or `bun.lock` | `bunfig.toml` |
| **pip** | `requirements.txt` | `pip.conf` |
| **Poetry** | `poetry.lock` | `pyproject.toml [tool.poetry]` |
| **PDM** | `pdm.lock` | `pyproject.toml [tool.pdm]` |
| **uv** | `uv.lock` | `pyproject.toml [tool.uv]` |
| **Pipenv** | `Pipfile.lock` | `Pipfile` |
| **Maven** | — (central) | `pom.xml` |
| **Gradle** | `gradle.lockfile` | `build.gradle(.kts)`, `settings.gradle(.kts)` |
| **Cargo** | `Cargo.lock` | `Cargo.toml` |
| **Go Modules** | `go.sum` | `go.mod` |
| **Bundler** | `Gemfile.lock` | `Gemfile` |
| **Composer** | `composer.lock` | `composer.json` |
| **CocoaPods** | `Podfile.lock` | `Podfile` |
| **pub** | `pubspec.lock` | `pubspec.yaml` |

---

## Build Tools

| Tool | Indicator | Language/Ecosystem |
|---|---|---|
| **Webpack** | `webpack.config.*` | JS/TS |
| **Vite** | `vite.config.*` | JS/TS |
| **esbuild** | `esbuild` in deps or scripts | JS/TS |
| **Rollup** | `rollup.config.*` | JS/TS |
| **Turbopack** | `next.config.*` with turbo | JS/TS (Next.js) |
| **Parcel** | `parcel` in deps | JS/TS |
| **tsc** | `tsc` in scripts | TypeScript |
| **SWC** | `@swc/core` in deps, `.swcrc` | JS/TS |
| **Babel** | `.babelrc`, `babel.config.*` | JS/TS |
| **Make** | `Makefile` | Multi-language |
| **CMake** | `CMakeLists.txt` | C/C++ |
| **Bazel** | `WORKSPACE`, `BUILD` files | Multi-language |
| **Gradle** | `build.gradle(.kts)` | Java/Kotlin |
| **Maven** | `pom.xml` | Java |

---

## Command Extraction

How to find build/test/lint/run commands for each stack type:

### Node.js (package.json)

```
scripts.install    → install command (or default: npm install)
scripts.dev        → dev server (also: start, serve)
scripts.test       → test runner (also: test:unit, test:e2e)
scripts.lint       → linter (also: lint:fix, eslint)
scripts.build      → build (also: compile, bundle)
scripts.format     → formatter (also: prettier, fmt)
scripts.typecheck  → type checker (also: tsc, check-types)
```

### Python (pyproject.toml)

```
[project.scripts]     → CLI entry points
[tool.poetry.scripts] → Poetry scripts
[tool.pdm.scripts]    → PDM scripts
```

Also check `Makefile` targets and CI workflow steps.

### Go

```
go build ./...   → build
go test ./...    → test
golangci-lint run → lint (if .golangci.yml exists)
go run .         → run
```

### Rust

```
cargo build      → build
cargo test       → test
cargo clippy     → lint
cargo run        → run
cargo fmt --check → format check
```

### Java/Kotlin

```
Maven: mvn compile, mvn test, mvn package
Gradle: ./gradlew build, ./gradlew test, ./gradlew check
```

### Fallback: CI Workflow

If no direct scripts found, parse CI workflow files for build/test steps:
- `.github/workflows/*.yml` → `jobs.*.steps[].run`
- `.gitlab-ci.yml` → `script:` blocks
- `Makefile` → target recipes
