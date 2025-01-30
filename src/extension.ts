// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
  GenerateComponentCommad,
  GenerateComposableCommand,
  GenerateCustomComponentCommad,
  GenerateDirectiveCommand,
  GeneratePageCommad,
  GenerateRouterCommad,
  GenerateStoreCommand,
} from './app/commands';
import {
  EXTENSION_DISPLAY_NAME,
  EXTENSION_ID,
  EXTENSION_NAME,
  ExtensionConfig,
  USER_PUBLISHER,
} from './app/configs';
import { CommandInvoker } from './app/controllers';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // The code you place here will be executed every time your command is executed
  let resource: vscode.WorkspaceFolder | undefined;

  // Check if there are workspace folders
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    const message = vscode.l10n.t(
      'No workspace folders are open. Please open a workspace folder to use this extension',
    );
    vscode.window.showErrorMessage(message);
    return;
  }

  // Optionally, prompt the user to select a workspace folder if multiple are available
  if (vscode.workspace.workspaceFolders.length === 1) {
    resource = vscode.workspace.workspaceFolders[0];
  } else {
    const placeHolder = vscode.l10n.t(
      'Select a workspace folder to use. This folder will be used to load workspace-specific configuration for the extension',
    );
    const selectedFolder = await vscode.window.showWorkspaceFolderPick({
      placeHolder,
    });

    resource = selectedFolder;
  }

  // -----------------------------------------------------------------
  // Initialize the extension
  // -----------------------------------------------------------------

  // Get the configuration for the extension
  const config = new ExtensionConfig(
    vscode.workspace.getConfiguration(EXTENSION_ID, resource?.uri),
  );

  // Watch for changes in the configuration
  vscode.workspace.onDidChangeConfiguration((event) => {
    const workspaceConfig = vscode.workspace.getConfiguration(
      EXTENSION_ID,
      resource?.uri,
    );

    if (event.affectsConfiguration(`${EXTENSION_ID}.enable`, resource?.uri)) {
      const isEnabled = workspaceConfig.get<boolean>('enable');

      config.update(workspaceConfig);

      if (isEnabled) {
        const message = vscode.l10n.t('{0} is now enabled and ready to use', [
          EXTENSION_DISPLAY_NAME,
        ]);
        vscode.window.showInformationMessage(message);
      } else {
        const message = vscode.l10n.t('{0} is now disabled', [
          EXTENSION_DISPLAY_NAME,
        ]);
        vscode.window.showInformationMessage(message);
      }
    }

    if (event.affectsConfiguration(EXTENSION_ID, resource?.uri)) {
      config.update(workspaceConfig);
    }
  });

  // -----------------------------------------------------------------
  // Get version of the extension
  // -----------------------------------------------------------------

  // Get the previous version of the extension
  const previousVersion = context.globalState.get('version');
  // Get the current version of the extension
  const currentVersion = context.extension.packageJSON.version;

  // Check if the extension is running for the first time
  if (!previousVersion) {
    const message = vscode.l10n.t(
      'Welcome to {0} version {1}! The extension is now active',
      [EXTENSION_DISPLAY_NAME, currentVersion],
    );
    vscode.window.showInformationMessage(message);

    // Update the version in the global state
    context.globalState.update('version', currentVersion);
  }

  // Check if the extension has been updated
  if (previousVersion && previousVersion !== currentVersion) {
    const actions: vscode.MessageItem[] = [
      {
        title: vscode.l10n.t('Release Notes'),
      },
      {
        title: vscode.l10n.t('Dismiss'),
      },
    ];

    const message = vscode.l10n.t(
      'New version of {0} is available. Check out the release notes for version {1}',
      [EXTENSION_DISPLAY_NAME, currentVersion],
    );
    vscode.window.showInformationMessage(message, ...actions).then((option) => {
      if (!option) {
        return;
      }

      // Handle the actions
      switch (option.title) {
        case actions[0].title:
          vscode.env.openExternal(
            vscode.Uri.parse(
              `https://marketplace.visualstudio.com/items/${USER_PUBLISHER}.${EXTENSION_NAME}/changelog`,
            ),
          );
          break;

        default:
          break;
      }
    });

    // Update the version in the global state
    context.globalState.update('version', currentVersion);
  }

  // -----------------------------------------------------------------
  // Register the commands
  // -----------------------------------------------------------------

  // Create a new invoker
  const invoker = new CommandInvoker(config.enable);

  // Define the commands and their corresponding handlers
  const commands = [
    {
      name: 'generateCustomComponent',
      handler: new GenerateCustomComponentCommad(config, context.extensionUri),
    },
    {
      name: 'generateComponent',
      handler: new GenerateComponentCommad(config, context.extensionUri),
    },
    {
      name: 'generatePage',
      handler: new GeneratePageCommad(config, context.extensionUri),
    },
    {
      name: 'generateStore',
      handler: new GenerateStoreCommand(config, context.extensionUri),
    },
    {
      name: 'generateRouter',
      handler: new GenerateRouterCommad(config, context.extensionUri),
    },
    {
      name: 'generateComposable',
      handler: new GenerateComposableCommand(config, context.extensionUri),
    },
    {
      name: 'generateDirective',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
    {
      name: 'generateMiddleware',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
    {
      name: 'generateModel',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
    {
      name: 'generateLayout',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
    {
      name: 'generateService',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
    {
      name: 'generateTest',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
    {
      name: 'generateEnum',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
    {
      name: 'generateConstant',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
    {
      name: 'generateHook',
      handler: new GenerateDirectiveCommand(config, context.extensionUri),
    },
  ];

  // Register the commands dynamically and push them to the context subscriptions
  commands.forEach(({ name, handler }) => {
    invoker.register(name, handler);

    const disposable = vscode.commands.registerCommand(
      `${EXTENSION_ID}.${name}`,
      async (uri: vscode.Uri) => await invoker.execute(name, uri),
    );

    context.subscriptions.push(disposable);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
