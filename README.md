# Bicep for Open VSX

Open VSX compatible Bicep language support for VS Code (Unofficial).

> **Note**: Bicep is a trademark of Microsoft Corporation. This extension is an unofficial community project and is not affiliated with Microsoft.

## Features

This extension provides language support for Bicep files (`.bicep`) and Bicep parameter files (`.bicepparam`), including:

- **Syntax Highlighting**: Colorization for Bicep keywords, strings, comments, and more.
- **Language Server Features**:
  - Validation (Error/Warning diagnostics)
  - IntelliSense (Code completion)
  - Hover information
  - Formatting
- **Configuration Support**: JSON schema validation for `bicepconfig.json` files

## Setup

This extension includes the Bicep Language Server and should work out of the box for most users (Windows, macOS, Linux).

### Requirements

- **.NET Runtime 8.0**: Automatically installed via the [.NET Install Tool](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.vscode-dotnet-runtime) extension
  - This extension declares `ms-dotnettools.vscode-dotnet-runtime` as a dependency
  - The .NET runtime will be acquired automatically when the extension activates

### How It Works

This extension uses the **Bicep Language Server** (`Bicep.LangServer.dll`):
- Bundled with the extension (~100MB)
- Requires .NET Runtime 8.0
- Currently using Bicep v0.39.26
- Runs via the .NET Install Tool extension

### Manual Configuration (Optional)

If you wish to use a custom Bicep Language Server DLL, you can configure the path manually:

1. **Download Bicep Language Server**: Get `Bicep.LangServer.dll` from [Bicep Releases](https://github.com/Azure/bicep/releases)
2. **Configure Extension**:
   Open your VS Code settings (`settings.json`) and add:

   ```json
   {
     "bicep.languageServerPath": "/path/to/Bicep.LangServer.dll"
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

## Roadmap

This project aims to provide essential language support for Bicep in Open VSX compatible environments.

### Current Status

✅ **Implemented:**
- Bicep syntax highlighting (`.bicep` and `.bicepparam` files)
- Language Server integration (diagnostics, IntelliSense, hover, formatting)
- `.bicepparam` file support
- `bicepconfig.json` JSON schema validation
- Configurable language server path

### Planned Features

#### Phase 1: Basic Language Features
- Editor default settings (tab size, etc.)

#### Phase 2: Developer Experience Enhancements
- Bicep syntax highlighting in Markdown code blocks
- Snippets for common patterns

### Not Planned

#### Build and Compile Commands
Build and decompile commands will **not** be implemented in this extension. Users should use the Bicep CLI directly for these operations:
- `bicep build` - Build ARM Template
- `bicep decompile` - Decompile JSON to Bicep
- `bicep generate-params` - Generate parameters file

**Rationale:** The Bicep CLI already provides excellent command-line tools for these operations. This extension focuses on editor integration rather than duplicating CLI functionality.

#### Advanced Features (Not Currently Planned)
- Bicep Visualizer
- Azure deployment features
- Resource insertion
- Module restore functionality

**Note:** Azure integration features are out of scope for this project.

### Philosophy

This extension follows a **lightweight, focused approach**:
- Provide excellent language support and editor integration
- Defer to the Bicep CLI for build/compile operations
- Avoid duplicating functionality available in other tools
- Keep the extension small and fast

## License

This extension is MIT licensed. It includes components from the Bicep project (MIT, Microsoft Corporation); see [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES).
