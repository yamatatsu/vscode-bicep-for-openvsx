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

## How It Works

This extension uses the **Bicep Language Server** (`Bicep.LangServer.dll`):
- Bundled with the extension (~100MB)
- Depends on .NET Runtime 10.0
  - Automatically installed via the Microsoft official extension [.NET Install Tool](https://open-vsx.org/extension/ms-dotnettools/vscode-dotnet-runtime)
- Currently using Bicep v0.40.2
- Runs via the .NET Install Tool extension

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

- Editor default settings (tab size, etc.)
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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, build instructions, and testing guidelines.

## License

This extension is MIT licensed. It includes components from the Bicep project (MIT, Microsoft Corporation); see [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES).
