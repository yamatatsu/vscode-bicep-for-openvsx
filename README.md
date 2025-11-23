# Bicep for Open VSX

Open VSX compatible Bicep language support for VS Code (Unofficial).

> **Note**: Bicep is a trademark of Microsoft Corporation. This extension is an unofficial community project and is not affiliated with Microsoft.

## Features

This extension provides language support for Bicep files (`.bicep`), including:

- **Syntax Highlighting**: Colorization for Bicep keywords, strings, comments, and more.
- **Language Server Features**:
  - Validation (Error/Warning diagnostics)
  - IntelliSense (Code completion)
  - Hover information
  - Formatting

## Setup

This extension includes the Bicep Language Server, so it should work out of the box for most users (Windows, macOS, Linux).

### How It Works

This extension uses the **Bicep CLI** in Language Server mode (`bicep jsonrpc --stdio`):
- No .NET Runtime required
- Standalone binaries for all platforms
- Currently using Bicep v0.39.26

### Manual Configuration (Optional)

If you wish to use a specific version of the Bicep CLI, you can configure the path manually:

1. **Install Bicep CLI**: Download from [Bicep Releases](https://github.com/Azure/bicep/releases)
2. **Configure Extension**:
   Open your VS Code settings (`settings.json`) and add the following configuration:

   ```json
   {
     "bicep.languageServerPath": "/path/to/your/bicep-cli-binary"
   }
   ```

## Development

### Prerequisites

- **Bun**: This project uses [Bun](https://bun.sh) as the package manager, test runner, and bundler.
  - Version: See `.bun-version` (currently 1.3.1)

### Build & Run

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

### Testing

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

### Azure/bicep Reference Repository

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

## License

This extension is MIT licensed. It includes components from the Bicep project (MIT, Microsoft Corporation); see [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES).
