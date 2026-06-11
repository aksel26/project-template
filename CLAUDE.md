# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@acg/create-exam` — a CLI that scaffolds a customer-specific exam/interview turborepo (admin + user + api) from a private GitHub template repo, then runs `pnpm install`. Distributed as `npx @acg/create-exam`.

## Commands

- `pnpm dev` — run the CLI from source via `tsx src/index.ts` (no build needed)
- `pnpm build` — `tsc` compiles `src/` → `dist/`. The `bin` (`create-exam`) points at `dist/index.js`, so the published CLI requires a build first.
- `pnpm test` — `vitest run`. Single file: `pnpm vitest run test/core.test.ts`. Single test: `pnpm vitest run -t 'name'`.
- Package manager is **pnpm** (pnpm-lock.yaml). Don't use npm/yarn for installs here.

## Non-obvious rules

- **ESM + NodeNext**: `"type": "module"` and `moduleResolution: NodeNext`. Relative imports MUST include the `.js` extension even when importing a `.ts` source file — e.g. `import { parseArgs } from './cli.js'`. Omitting it breaks compilation and runtime.
- **Token resolution** (private template repo access): `GITHUB_TOKEN` env var first, then `gh auth token`. See `src/token.ts`.
- **Publishing**: GitHub Packages, not npmjs. `@acg` scope → `https://npm.pkg.github.com` (see `.npmrc` + `publishConfig`). Bump `version` in package.json before publishing; `files` ships only `dist`, so build first.
- DB password is intentionally prompt-only — never accept it as a CLI flag.

## Architecture

`run()` in `src/index.ts` orchestrates: `cli.parseArgs` → `fetch.fetchTemplate` (giget, or `--template-dir` for local) → `manifest.loadManifest` → `prompt.runPrompts` → `core.createProject`.

`createProject` (`src/core.ts`) runs the generation pipeline in order: `compose` → `transform` → `env.generateEnv` → `install`. On any failure after the target dir is created it calls `rollback` (unless `--keep`). When editing the pipeline, preserve this ordering and the rollback guarantee.

Tests inject prompt answers through the `deps` object passed to `run()` (keys matching manifest prompt keys), bypassing interactive prompts — see `src/index.ts` and `test/`.
