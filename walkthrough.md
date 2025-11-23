# Bicep for Open VSX Extension Verification Walkthrough

> [!IMPORTANT]
> **Unofficial Extension**: This is an independent community project and is not affiliated with Microsoft. Bicep is a trademark of Microsoft Corporation.
> **Scope**: This extension provides core language support (syntax highlighting, validation, completion) via the Bicep Language Server. It does not include UI-heavy features like the Visualizer or Deployment Pane.

## Prerequisites
- **Bun**: Ensure Bun is installed (`bun --version`).
- **Bicep Language Server**: You need the Bicep Language Server binary.

## 1. Build the Extension
Run the following command to build the extension:
```bash
bun run build
```

## 2. Download Bicep Language Server
 (This step is now handled automatically by the build script)
 
 ## 3. Configure Extension
 No configuration is required as the extension now bundles the Language Server.
 
 If you need to use a custom server, you can still set `bicep.languageServerPath`.

## 4. Verify Functionality
1. Open a `.bicep` file (or create `test.bicep`).
2. **Syntax Highlighting**: Verify that keywords like `resource`, `param` are colored.
3. **Language Server**:
   - Check the "Output" panel and select "Bicep Language Server" to see if it started.
   - Try typing `res` to see if completions appear.
   - Write invalid code (e.g., `param foo int = 'string'`) and check for error squiggles.

## Troubleshooting
- If the Language Server doesn't start, check the path in settings.
- Check the "Bicep for Open VSX" output channel for errors.

## Running Tests

### Unit Tests
Run unit tests (logic tests) using Bun:
```bash
bun test
```

### E2E Tests
Run E2E tests (VS Code integration tests):
```bash
bun run test:e2e
```
Note: This will download a separate instance of VS Code and run the tests in it.
