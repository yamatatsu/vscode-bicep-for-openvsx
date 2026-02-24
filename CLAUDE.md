# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

VS Code extension providing Bicep language support for Open VSX. Bicep is Microsoft Azure's DSL for infrastructure as code.

**Architecture**: TypeScript extension (client) -> vscode-languageclient -> .NET 10.0 Runtime -> Bicep Language Server (DLL)

## Essential Commands

```bash
bun install              # Install dependencies
bun run download-server  # Download Bicep Language Server (~90MB per platform)
bun run build            # Build extension to dist/
bun run watch            # Watch mode for development
bun run check            # Run linting (Biome) + type checking (TypeScript)
bun run check:lint:fix   # Auto-fix linting issues
bun run test:e2e         # Run E2E tests (compiles and runs in real VS Code)
bun run package          # Create .vsix package
```

## Project Structure

```
src/
  extension.ts           # Extension entry point (activate/deactivate)
  language/client.ts     # Language Client setup and .NET runtime acquisition
__E2E__/
  extension.test.ts      # E2E test suite (Mocha)
  fixtures/              # Test fixtures (.bicep, .bicepparam files)
scripts/
  download-server.ts     # Downloads Bicep Language Server from GitHub releases
  update-bicep-reference.ts  # Updates vendor/bicep git subtree
syntaxes/                # TextMate grammar for syntax highlighting
schemas/                 # JSON schema for bicepconfig.json
vendor/bicep/            # Azure/bicep repo (git subtree reference)
```

## Code Style

- **Formatter**: Biome with 2-space indentation
- **Quotes**: Single quotes for JavaScript/TypeScript
- **TypeScript**: Strict mode enabled, target ES2020
- **Linting**: Biome recommended rules

Run `bun run check:lint:fix` before committing.

## Testing

- **E2E tests only**: Tests run in a real VS Code instance
- Run with `bun run test:e2e`
- Tests are in `__E2E__/extension.test.ts`
- Test fixtures in `__E2E__/fixtures/`

## Design Philosophy

This extension intentionally keeps a **minimal scope**:

**Included**: Syntax highlighting, diagnostics, IntelliSense, hover, formatting, bicepconfig.json schema validation

**Excluded by design** (use Bicep CLI instead):
- Build/compile commands
- JSON to Bicep decompilation
- Parameter file generation
- Bicep Visualizer
- Azure deployment integration

## Key Dependencies

- `vscode-languageclient`: Language Server Protocol client
- `ms-dotnettools.vscode-dotnet-runtime`: .NET runtime acquisition (extension dependency)
- Bicep Language Server: Downloaded from Azure/bicep GitHub releases (v0.40.2)

## Updating Bicep Reference

The `vendor/bicep` directory is a git subtree of Azure/bicep:

```bash
bun run update-bicep-reference  # Pull latest from Azure/bicep main
```

## CI/CD

- **test.yml**: Runs on every push (lint, type check, build, E2E tests)
- **release.yml**: Manual workflow dispatch for releases to Open VSX
- **update-grammar.yml**: Weekly auto-update of TextMate grammar from Azure/bicep (creates PR if changes detected)
