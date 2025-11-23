import type * as vscode from 'vscode';
import * as languageClient from './language/client';

export async function activate(context: vscode.ExtensionContext) {
  console.log('Bicep extension is now active!');
  await languageClient.activate(context);
}

export function deactivate(): Thenable<void> | undefined {
  return languageClient.deactivate();
}
