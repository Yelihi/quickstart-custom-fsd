# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`quickstart-custom-plate` is a Node.js CLI tool (published as `quickstart` bin) that scaffolds FSD (Feature-Sliced Design) frontend projects. It interactively prompts the user and then copies/merges template files into a new project directory.

## Commands

```bash
# Type-check
npm run typecheck

# Build (outputs to dist/)
npm run build

# Run tests (watch mode)
npm run test

# Run tests once (CI)
npm run test:run

# Run the CLI locally after build
node dist/index.js
```

To run a single test file:
```bash
npx vitest run src/path/to/file.test.ts
```

## Architecture

### CLI Flow (`src/index.ts`)
- Parses `process.argv`, routes to `create` or `add` command
- Default command is `create` when no subcommand is given

### `create` command (`src/commands/create.ts`)
1. Prompts user for project name, framework, language, and optional features
2. Validates project name
3. Resolves `templates/<framework>/base-<language>` as the base template
4. Copies base template to `<cwd>/<projectName>`
5. Determines overlays via `overlaysFor()` and applies each: copies files, merges `package.json`
6. Renames `_gitignore` → `.gitignore`, applies token replacement (`__PROJECT_NAME__`), forces package name

### Templates & Overlays
Templates live in `templates/<framework>/` (not bundled in source — must be present at runtime):
- `base-ts/` and `base-js/` — base project skeletons
- `overlays/<name>/` — additive layers merged on top of base

Overlay names: `tailwind`, `store-zustand`, `store-pinia`, `tanstack-query`, `test-jest`, `test-vitest`, `husky`

Framework choices: `react-vite`, `next`, `vue-vite`

### `src/core/` modules
| File | Purpose |
|------|---------|
| `copy-template.ts` | Recursive dir copy; `ensureEmptyDir` to guard target |
| `merge-package.ts` | Deep-merge overlay `package.json` into project's `package.json` |
| `render.ts` | Token replacement (`__PROJECT_NAME__`) across all files in a dir |
| `pm.ts` | Detect package manager (npm/yarn/pnpm) from env; generate install/run commands |
| `prompt.ts` | All `prompts` interactions; contains `presetFor()` defaults per framework |
| `validate.ts` | Project name validation |
| `print.ts` | Terminal output formatting (`help()`, `output()`) |
| `utils.ts` | `normalizeArgv`, `exists`, `forcePackageName`, `renameGitignore` |

### Build
- `tsup` bundles `src/index.ts` → `dist/index.js` (ESM, Node 18+)
- Templates directory must be distributed alongside `dist/` when publishing
- `__dirname` equivalent is constructed via `fileURLToPath(import.meta.url)` since the build uses ESM

### FSD Reference
The `.agents/skills/clean-architecture/reference/` directory contains the FSD layer design guidelines used when generating template content. Dependency direction: `shared` ← `entities` ← `features` ← `widgets` ← `views` ← `app`.
