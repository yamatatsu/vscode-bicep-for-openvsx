import * as assert from 'node:assert';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { retryWhile } from './utils/retry';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  suite('0. Language Server Health Check (Critical)', () => {
    test('Language server should be ready and respond to requests', async function () {
      // Max observed: 1357ms local, CI needs more time for .NET Runtime + Language Server initialization
      // Recommended: 15000ms (generous buffer for CI environment)
      this.timeout(15000);

      // 1. Get extension and explicitly activate it
      const extension = vscode.extensions.getExtension(
        'Yamatatsu.vscode-bicep-for-openvsx',
      );
      assert.ok(extension, 'Extension should be installed');

      if (!extension.isActive) {
        await extension.activate();
      }

      // 2. Open a simple Bicep document
      const document = await vscode.workspace.openTextDocument({
        language: 'bicep',
        content: 'param location string = resourceGroup().location\n',
      });
      await vscode.window.showTextDocument(document);

      // 3. Wait for language server to start and respond to hover requests
      const hovers = await retryWhile(
        async () =>
          await vscode.commands.executeCommand<vscode.Hover[]>(
            'vscode.executeHoverProvider',
            document.uri,
            new vscode.Position(0, 6), // 'location' parameter name
          ),
        (result) => !result || result.length === 0,
        { timeout: 12000, interval: 1000 },
      );

      // 4. Verify language server is responding
      assert.ok(
        hovers && hovers.length > 0,
        'Language server should provide hover information',
      );
      assert.ok(hovers[0].contents.length > 0, 'Hover should have content');
    });

    test('Language server should provide completions', async function () {
      // Max observed: 189ms, recommended: 1000ms (5x buffer for quick tests)
      this.timeout(1000);

      // Create a document with completion trigger
      const document = await vscode.workspace.openTextDocument({
        language: 'bicep',
        content: 'param name string = resource',
      });
      await vscode.window.showTextDocument(document);

      // Wait for completion provider to be ready
      const completions = await retryWhile(
        async () =>
          await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            document.uri,
            new vscode.Position(0, 28), // After 'resource'
          ),
        (result) => !result || result.items.length === 0,
        { timeout: 800, interval: 200 },
      );

      // Verify completions are provided
      assert.ok(
        completions && completions.items.length > 0,
        'Language server should provide completions',
      );
    });

    test('Language server should provide diagnostics for invalid code', async function () {
      // Allow extra time for diagnostic generation in CI: 6000ms
      this.timeout(6000);

      // Create a document with an error
      const document = await vscode.workspace.openTextDocument({
        language: 'bicep',
        content: 'invalid syntax here\n',
      });
      await vscode.window.showTextDocument(document);

      // Wait for diagnostics to be generated
      await retryWhile(
        async () => {
          const diagnostics = vscode.languages.getDiagnostics(document.uri);
          return diagnostics;
        },
        (diagnostics) => diagnostics.length === 0,
        { timeout: 5000, interval: 500 },
      );

      const diagnostics = vscode.languages.getDiagnostics(document.uri);
      assert.ok(
        diagnostics.length > 0,
        'Language server should report errors for invalid code',
      );
      assert.ok(
        diagnostics.some((d) => d.severity === vscode.DiagnosticSeverity.Error),
        'Should have at least one error diagnostic',
      );
    });
  });

  suite('1. Extension Activation', () => {
    test('Extension should be present', () => {
      const extension = vscode.extensions.getExtension(
        'Yamatatsu.vscode-bicep-for-openvsx',
      );
      assert.ok(extension, 'Extension should be installed');
    });

    test('Extension should activate when needed', async function () {
      // Increased for CI environment with .NET Runtime initialization
      this.timeout(15000);

      const extension = vscode.extensions.getExtension(
        'Yamatatsu.vscode-bicep-for-openvsx',
      );
      assert.ok(extension, 'Extension should be installed');

      // Explicitly activate the extension
      if (!extension.isActive) {
        await extension.activate();
      }

      assert.ok(
        extension.isActive,
        'Extension should be active after activation',
      );
    });
  });

  suite('2. Language Server Startup', () => {
    test('Language client should start when opening a Bicep file', async function () {
      // Max observed: 148ms local, increased for CI language server initialization
      this.timeout(10000);

      const fixturesPath = path.join(__dirname, '../fixtures');
      const validBicepPath = path.join(fixturesPath, 'valid.bicep');
      const uri = vscode.Uri.file(validBicepPath);

      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);

      assert.ok(document, 'Document should be opened');
      assert.strictEqual(
        document.languageId,
        'bicep',
        'Language ID should be bicep',
      );

      // Wait for language server to initialize by checking if it responds
      const hovers = await retryWhile(
        async () =>
          await vscode.commands.executeCommand<vscode.Hover[]>(
            'vscode.executeHoverProvider',
            document.uri,
            new vscode.Position(0, 0),
          ),
        (result) => !result || result.length === 0,
        { timeout: 8000, interval: 1000 },
      );

      assert.ok(
        hovers !== undefined,
        'Language server should be initialized and responding',
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

    test('.bicepparam files should be recognized', async () => {
      const fixturesPath = path.join(__dirname, '../fixtures');
      const validBicepParamPath = path.join(fixturesPath, 'valid.bicepparam');
      const uri = vscode.Uri.file(validBicepParamPath);

      const document = await vscode.workspace.openTextDocument(uri);

      assert.strictEqual(
        document.languageId,
        'bicep-params',
        'Language ID should be bicep-params',
      );
      assert.ok(
        document.fileName.endsWith('.bicepparam'),
        'File should have .bicepparam extension',
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

    test('Syntax highlighting should be available for .bicepparam files', () => {
      const bicepParamsGrammar = vscode.extensions.all.find((ext) =>
        ext.packageJSON?.contributes?.grammars?.some(
          // biome-ignore lint/suspicious/noExplicitAny: for test code
          (g: any) => g.language === 'bicep-params',
        ),
      );

      assert.ok(
        bicepParamsGrammar,
        'Bicep params grammar should be registered',
      );
    });

    test('Diagnostics should be available for invalid Bicep files', async function () {
      // Max observed: 2020ms local, increased for CI file analysis
      this.timeout(8000);

      const fixturesPath = path.join(__dirname, '../fixtures');
      const invalidBicepPath = path.join(fixturesPath, 'invalid.bicep');
      const uri = vscode.Uri.file(invalidBicepPath);

      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);

      // Wait for language server to analyze the file and provide diagnostics
      const diagnostics = await retryWhile(
        async () => vscode.languages.getDiagnostics(uri),
        (diagnostics) => diagnostics.length === 0,
        { timeout: 6000, interval: 500 },
      );

      // The invalid file should have at least some diagnostics
      assert.ok(
        diagnostics.length > 0,
        'Invalid Bicep file should have diagnostics',
      );
      assert.ok(
        diagnostics.some((d) => d.severity === vscode.DiagnosticSeverity.Error),
        'Should have at least one error diagnostic',
      );
    });

    test('Diagnostics should be available for invalid .bicepparam files', async function () {
      // Max observed: 2020ms local, increased for CI file analysis
      this.timeout(8000);

      const fixturesPath = path.join(__dirname, '../fixtures');
      const invalidBicepParamPath = path.join(
        fixturesPath,
        'invalid.bicepparam',
      );
      const uri = vscode.Uri.file(invalidBicepParamPath);

      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);

      // Wait for language server to analyze the file and provide diagnostics
      const diagnostics = await retryWhile(
        async () => vscode.languages.getDiagnostics(uri),
        (diagnostics) => diagnostics.length === 0,
        { timeout: 6000, interval: 500 },
      );

      // The invalid file should have at least some diagnostics
      assert.ok(
        diagnostics.length > 0,
        'Invalid .bicepparam file should have diagnostics',
      );
      assert.ok(
        diagnostics.some((d) => d.severity === vscode.DiagnosticSeverity.Error),
        'Should have at least one error diagnostic',
      );
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
