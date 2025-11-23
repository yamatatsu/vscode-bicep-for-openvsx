---
description: Common development tasks (Build, Test, Lint)
---

# Development Workflows

## Build
Run the build script to compile the extension.
// turbo
bun run build

## Test
Run the unit tests. Run this frequently during development to ensure no regressions.
// turbo
bun test

## Check (Lint & Type)
Run the linter and type checker.
// turbo
bun run check

## E2E Test
Run the end-to-end tests. Run this at major implementation milestones or before submitting changes.
// turbo
bun run test:e2e
