import * as vscode from 'vscode';
import {
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('bicep');
  const customServerPath = config.get<string>('languageServerPath');

  let languageServerPath: string;

  if (customServerPath) {
    // Use custom path if configured
    languageServerPath = customServerPath;
  } else {
    // Use bundled DLL
    const bundledDllPath = vscode.Uri.joinPath(
      context.extensionUri,
      'assets',
      'bicepLanguageServer',
      'Bicep.LangServer.dll',
    ).fsPath;
    languageServerPath = bundledDllPath;
  }

  // Acquire .NET Runtime 8.0 from ms-dotnettools.vscode-dotnet-runtime extension
  let dotnetPath: string;
  try {
    const dotnetResult = await vscode.commands.executeCommand<{
      dotnetPath: string;
    }>('dotnet.acquire', {
      version: '10.0',
      requestingExtensionId: 'Yamatatsu.vscode-bicep-for-openvsx',
    });

    if (!dotnetResult || !dotnetResult.dotnetPath) {
      throw new Error('Failed to acquire .NET Runtime');
    }

    dotnetPath = dotnetResult.dotnetPath;
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to acquire .NET Runtime: ${error}. Please install the "ms-dotnettools.vscode-dotnet-runtime" extension.`,
    );
    return;
  }

  // Build server options with .NET Runtime
  const serverOptions: ServerOptions = {
    run: {
      module: languageServerPath,
      transport: TransportKind.pipe,
      runtime: dotnetPath,
      options: {
        env: process.env,
      },
    },
    debug: {
      module: languageServerPath,
      transport: TransportKind.pipe,
      runtime: dotnetPath,
      options: {
        env: process.env,
      },
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'bicep' },
      { scheme: 'file', language: 'bicep-params' },
    ],
    synchronize: {
      fileEvents: [
        vscode.workspace.createFileSystemWatcher('**/*.bicep'),
        vscode.workspace.createFileSystemWatcher('**/*.bicepparam'),
      ],
    },
  };

  client = new LanguageClient(
    'bicep',
    'Bicep Language Server',
    serverOptions,
    clientOptions,
  );

  await client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
