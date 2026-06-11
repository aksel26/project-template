---
name: release
description: Build and publish @acg/create-exam to GitHub Packages. Use when cutting a new release of this CLI.
disable-model-invocation: true
---

# Release @acg/create-exam

Publishes the CLI to GitHub Packages (`https://npm.pkg.github.com`). Run this only when the user explicitly asks for a release.

`$ARGUMENTS` may contain a target version or a semver bump keyword (`patch`/`minor`/`major`). If empty, ask which to use.

## Steps

1. Ensure the working tree is clean (`git status`). If not, stop and report — don't publish uncommitted state.
2. Confirm an auth token is available for the GitHub Packages registry: `GITHUB_TOKEN` env var, or `gh auth token`. The token needs `write:packages` scope. If neither resolves, stop and tell the user.
3. Bump the version in `package.json`:
   - If `$ARGUMENTS` is a bump keyword: `pnpm version <keyword> --no-git-tag-version`
   - If it's an explicit version: set it directly.
   - Show the user the old → new version before continuing.
4. Build: `pnpm build` (tsc → `dist`). Verify `dist/index.js` exists.
5. Run `pnpm test` and confirm it passes. Do not publish on a failing test suite.
6. Publish: `pnpm publish` (respects `publishConfig.registry` → GitHub Packages). The `files` field ships only `dist`.
7. After a successful publish, offer to commit the version bump and create a git tag `v<version>`.

## Notes

- Never publish to npmjs.org — this is a private `@acg`-scoped package on GitHub Packages.
- If publish fails with 401/403, it's almost always a missing/under-scoped token (step 2).
