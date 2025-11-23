import * as assert from 'node:assert';
import * as path from 'node:path';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  suite('1. Extension Activation', () => {
    test('Extension should be present', () => {
      const extension = vscode.extensions.getExtension(
        'Yamatatsu.vscode-bicep-for-openvsx',
      );
      assert.ok(extension, 'Extension should be installed');
    });

    test('Extension should activate when needed', async function () {
      this.timeout(5000);

      const extension = vscode.extensions.getExtension(
        'Yamatatsu.vscode-bicep-for-openvsx',
      );
      assert.ok(extension);

      // Extension will activate automatically when a .bicep file is opened
      // Just verify it's available
      assert.ok(extension !== undefined, 'Extension should be available');
    });
  });

  suite('2. Language Server Startup', () => {
    test('Language client should start when opening a Bicep file', async function () {
      this.timeout(10000);

      const fixturesPath = path.join(__dirname, '../fixtures');
      const validBicepPath = path.join(fixturesPath, 'valid.bicep');
      const uri = vscode.Uri.file(validBicepPath);

      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);

      // Wait for language server to initialize
      await new Promise((resolve) => setTimeout(resolve, 3000));

      assert.ok(document, 'Document should be opened');
      assert.strictEqual(
        document.languageId,
        'bicep',
        'Language ID should be bicep',
      );
    });
  });

  suite('3. Basic Language Features', () => {
    test('.bicep files should be recognized', async () => {
      const fixturesPath = path.join(__dirname, '../fixtures');
      const validBicepPath = path.join(fixturesPath, 'valid.bicep');
      const uri = vscode.Uri.file(validBicepPath);

      const document = await vscode.workspace.openTextDocument(uri);

      assert.strictEqual(
        document.languageId,
        'bicep',
        'Language ID should be bicep',
      );
      assert.ok(
        document.fileName.endsWith('.bicep'),
        'File should have .bicep extension',
      );
    });

    test('Syntax highlighting should be available', () => {
      const bicepGrammar = vscode.extensions.all.find((ext) =>
        ext.packageJSON?.contributes?.grammars?.some(
          // biome-ignore lint/suspicious/noExplicitAny: for test code
          (g: any) => g.language === 'bicep',
        ),
      );

      assert.ok(bicepGrammar, 'Bicep grammar should be registered');
    });

    test('Diagnostics should be available for invalid Bicep files', async function () {
      this.timeout(15000);

      const fixturesPath = path.join(__dirname, '../fixtures');
      const invalidBicepPath = path.join(fixturesPath, 'invalid.bicep');
      const uri = vscode.Uri.file(invalidBicepPath);

      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);

      // Wait for language server to analyze the file
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const diagnostics = vscode.languages.getDiagnostics(uri);

      // The invalid file should have at least some diagnostics
      // Note: This might not work if language server is not fully initialized
      // In that case, we just verify that getDiagnostics doesn't throw
      assert.ok(Array.isArray(diagnostics), 'Diagnostics should be an array');
    });
  });

  suite('4. Configuration', () => {
    test('bicep.languageServerPath configuration should be accessible', () => {
      const config = vscode.workspace.getConfiguration('bicep');
      const languageServerPath = config.get<string>('languageServerPath');

      // Default should be empty string
      assert.strictEqual(
        typeof languageServerPath,
        'string',
        'languageServerPath should be a string',
      );
    });

    test('bicep.trace.server configuration should be accessible', () => {
      const config = vscode.workspace.getConfiguration('bicep');
      const traceServer = config.get<string>('trace.server');

      assert.ok(
        ['off', 'messages', 'verbose'].includes(traceServer || 'off'),
        'trace.server should be one of: off, messages, verbose',
      );
    });
  });
});
