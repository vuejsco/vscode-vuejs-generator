// The module 'vscode' contains the VSCode extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { ExtensionRuntime } from './extension.runtime';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // The code you place here will be executed every time your command is executed
  try {
    const runtime = new ExtensionRuntime(context);

    if (!(await runtime.initialize())) {
      return;
    }

    await runtime.start();
  } catch (error) {
    console.error('Error activating extension:', error);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
