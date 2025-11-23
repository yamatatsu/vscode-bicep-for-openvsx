# Contributing Guidelines

## Testing Strategy
- **Unit Tests (`bun test`)**: Run these frequently during development. Ideally after every logical change or before committing.
- **E2E Tests (`bun run test:e2e`)**: Run these at implementation milestones (e.g., finishing a feature) or before a final review. These are slower and heavier, so they don't need to be run as often as unit tests.

## Linting & Type Checking
- Use `bun run check` to run both Biome linting and TypeScript type checking.
- Use `bun run check:lint:fix` to automatically fix linting errors.
