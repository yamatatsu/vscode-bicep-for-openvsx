# Contributing Guidelines

Thank you for your interest in contributing to Bicep for Open VSX!

## Prerequisites

- **Bun**: This project uses [Bun](https://bun.sh) as the package manager, test runner, and bundler.
  - Version: See `.bun-version` (currently 1.3.1)

## Development Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Download Bicep Language Server binaries:
   ```bash
   bun run download-server
   ```
   This downloads Bicep CLI binaries (~90MB per platform) for all supported platforms.

3. Build the extension:
   ```bash
   bun run build
   ```

4. Watch for changes (development):
   ```bash
   bun run watch
   ```

5. Package (VSIX):
   ```bash
   bun run package
   ```
   Note: This automatically runs `download-server` and `build` via the `vscode:prepublish` script.

## Testing Strategy

- **Unit Tests (`bun test`)**: Run these frequently during development. Ideally after every logical change or before committing.
- **E2E Tests (`bun run test:e2e`)**: Run these at implementation milestones (e.g., finishing a feature) or before a final review. These are slower and heavier, so they don't need to be run as often as unit tests.

### Running Tests

Run unit tests:
```bash
bun test
```

Run E2E tests:
```bash
bun run test:e2e
```

The E2E tests will:
- Compile TypeScript test files
- Download VS Code test instance (if not cached)
- Run tests in a real VS Code environment

## Linting & Type Checking

- Use `bun run check` to run both Biome linting and TypeScript type checking.
- Use `bun run check:lint:fix` to automatically fix linting errors.

## Azure/bicep Reference Repository

This project includes the [Azure/bicep](https://github.com/Azure/bicep) repository as a reference using **git subtree** in the `vendor/bicep` directory. This allows us to reference the original source code for syntax definitions, language server implementation, and other features.

**Update the reference:**
```bash
bun run update-bicep-reference
```

This will pull the latest changes from the Azure/bicep main branch.

**Manual update (alternative):**
```bash
git subtree pull --prefix=vendor/bicep https://github.com/Azure/bicep main --squash
```
