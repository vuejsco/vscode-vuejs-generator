import {
  commands,
  ExtensionContext,
  env,
  l10n,
  MessageItem,
  Uri,
  WorkspaceFolder,
  window,
  workspace,
} from 'vscode';
import { VSCodeMarketplaceClient } from 'vscode-marketplace-client';

import {
  GenerateComponentCommand,
  GenerateComposableCommand,
  GenerateConstantCommand,
  GenerateCustomComponentCommand,
  GenerateDirectiveCommand,
  GenerateEnumCommand,
  GenerateHookCommand,
  GenerateLayoutCommand,
  GenerateMiddlewareCommand,
  GenerateModelCommand,
  GeneratePageCommand,
  GenerateRouterCommand,
  GenerateServiceCommand,
  GenerateStoreCommand,
  GenerateTestCommand,
} from './app/commands';
import {
  CommandIds,
  ContextKeys,
  EXTENSION_DISPLAY_NAME,
  EXTENSION_ID,
  EXTENSION_NAME,
  ExtensionConfig,
  REPOSITORY_URL,
  USER_PUBLISHER,
} from './app/configs';
import { CommandInvoker } from './app/controllers';

export class ExtensionRuntime {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties

  /**
   * Tracks whether the user has already been warned about the extension being disabled,
   * preventing redundant popup messages.
   *
   * @type {boolean}
   * @private
   * @memberof ExtensionRuntime
   * @example
   * if (!extensionRuntime.isExtensionEnabled()) {
   *   // Warning will only be shown the first time this condition is met
   * }
   */
  private hasDisabledWarningBeenShown = false;

  /**
   * The current configuration instance, loaded based on the selected workspace folder.
   *
   * @type {ExtensionConfig}
   * @private
   * @memberof ExtensionRuntime
   * @example
   * const config = extensionRuntime.extensionConfig;
   * console.log(config.enable);
   */
  private config!: ExtensionConfig;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructs a new instance of the extension runtime.
   *
   * @param context - The context provided by VS Code upon activation.
   */
  constructor(private readonly context: ExtensionContext) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * Initializes the extension runtime.
   * Selects the active workspace, loads configuration, and handles version notifications.
   * This must complete successfully before start() is invoked.
   *
   * @returns A promise that resolves to true if initialization succeeded, false otherwise.
   */
  async initialize(): Promise<boolean> {
    const workspaceFolder = await this.selectWorkspaceFolder();

    if (!workspaceFolder) {
      return false;
    }

    this.initializeConfiguration(workspaceFolder);

    this.startVersionChecks();

    this.isExtensionEnabled();

    return true;
  }

  /**
   * Starts command registration after successful initialization.
   *
   * @remarks
   * Keeps orchestration in runtime while generation behavior remains in services.
   */
  async start(): Promise<void> {
    this.registerWorkspaceCommands();
    this.registerGeneratorCommands();
  }

  /**
   * Starts version-related checks without blocking extension activation.
   * Local notifications are fast and run immediately, while the marketplace
   * check runs in the background because it requires a network request.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * extensionRuntime.startVersionChecks();
   */
  private startVersionChecks(): void {
    void this.handleLocalVersionNotifications();
    void this.checkMarketplaceVersion();
  }

  /**
   * Returns the version declared in the extension's package.json.
   * If the version cannot be resolved, a fallback value of '0.0.0' is returned.
   *
   * @returns The current version string.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * const currentVersion = extensionRuntime.getCurrentVersion();
   * console.log(`Current extension version: ${currentVersion}`);
   */
  private getCurrentVersion(): string {
    return this.context.extension.packageJSON?.version ?? '0.0.0';
  }

  /**
   * Handles version notifications that depend only on local information.
   * This includes first activation messages and update notifications.
   * This method runs synchronously during activation since it does not require any network requests.
   *
   * @returns A promise that resolves when all notifications have been handled.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * await extensionRuntime.handleLocalVersionNotifications();
   */
  private async handleLocalVersionNotifications(): Promise<void> {
    const previousVersion = this.context.globalState.get<string>(
      ContextKeys.Version,
    );

    const currentVersion = this.getCurrentVersion();

    // Handle first activation of the extension
    if (!previousVersion) {
      const welcomeMessage = l10n.t(
        'Welcome to {0} version {1}! The extension is now active',
        EXTENSION_DISPLAY_NAME,
        currentVersion,
      );

      window.showInformationMessage(welcomeMessage);

      await this.context.globalState.update(
        ContextKeys.Version,
        currentVersion,
      );

      return;
    }

    // Handle extension update
    if (previousVersion !== currentVersion) {
      const actionReleaseNotes: MessageItem = {
        title: l10n.t('Release Notes'),
      };
      const actionDismiss: MessageItem = { title: l10n.t('Dismiss') };
      const availableActions = [actionReleaseNotes, actionDismiss];

      const updateMessage = l10n.t(
        "The {0} extension has been updated. Check out what's new in version {1}",
        EXTENSION_DISPLAY_NAME,
        currentVersion,
      );

      const userSelection = await window.showInformationMessage(
        updateMessage,
        ...availableActions,
      );

      // Open the changelog in the marketplace if requested by the user
      if (userSelection?.title === actionReleaseNotes.title) {
        const changelogUrl = `${REPOSITORY_URL}/blob/main/CHANGELOG.md`;
        env.openExternal(Uri.parse(changelogUrl));
      }

      // Persist the new version locally
      await this.context.globalState.update(
        ContextKeys.Version,
        currentVersion,
      );
    }
  }

  /**
   * Checks the VS Code Marketplace for a newer extension version.
   * This operation requires a network request and therefore runs in the background.
   * If a newer version is found, the user is notified with an option to update immediately.
   *
   * @returns A promise that resolves when the check is complete and any notifications have been handled.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * await extensionRuntime.checkMarketplaceVersion();
   */
  private async checkMarketplaceVersion(): Promise<void> {
    const currentVersion = this.getCurrentVersion();

    try {
      const latestVersion = await VSCodeMarketplaceClient.getLatestVersion(
        USER_PUBLISHER,
        EXTENSION_NAME,
      );

      // No action required if the extension is already up to date
      if (latestVersion === currentVersion) {
        return;
      }

      const actionUpdateNow: MessageItem = { title: l10n.t('Update Now') };
      const actionDismiss: MessageItem = { title: l10n.t('Dismiss') };
      const availableActions = [actionUpdateNow, actionDismiss];

      const updateMessage = l10n.t(
        'A new version of {0} is available. Update to version {1} now',
        EXTENSION_DISPLAY_NAME,
        latestVersion,
      );

      const userSelection = await window.showInformationMessage(
        updateMessage,
        ...availableActions,
      );

      // Trigger the VS Code command to install the new version
      if (userSelection?.title === actionUpdateNow.title) {
        await commands.executeCommand(
          'workbench.extensions.action.install.anotherVersion',
          `${USER_PUBLISHER}.${EXTENSION_NAME}`,
        );
      }
    } catch {
      // Ignore marketplace check failures to avoid interrupting extension startup.
    }
  }

  /**
   * Selects the workspace folder to use for the extension.
   * VS Code does not guarantee a workspace folder exists during activation,
   * so this method explicitly handles missing workspace scenarios.
   *
   * @returns A promise that resolves to the selected WorkspaceFolder, or undefined if none.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * const selectedFolder = await extensionRuntime.selectWorkspaceFolder();
   * if (selectedFolder) {
   *   console.log(`Selected workspace folder: ${selectedFolder.name}`);
   * } else {
   *   console.log('No workspace folder selected');
   * }
   */
  private async selectWorkspaceFolder(): Promise<WorkspaceFolder | undefined> {
    const availableWorkspaceFolders = workspace.workspaceFolders;

    // Check if there are any workspace folders open
    if (!availableWorkspaceFolders || availableWorkspaceFolders.length === 0) {
      return undefined;
    }

    // Try to load the previously selected workspace folder from global state
    const previousFolderUriString = this.context.globalState.get<string>(
      ContextKeys.SelectedWorkspaceFolder,
    );
    let previousFolder: WorkspaceFolder | undefined;

    // Find the workspace folder by matching URI
    if (previousFolderUriString) {
      previousFolder = availableWorkspaceFolders.find(
        (folder) => folder.uri.toString() === previousFolderUriString,
      );
    }

    // If only one workspace folder is available, use it directly
    if (availableWorkspaceFolders.length === 1) {
      return availableWorkspaceFolders[0];
    }

    // Use the previously selected workspace folder if available
    if (previousFolder) {
      // Notify the user which workspace is being used
      window.showInformationMessage(
        l10n.t('Using workspace folder: {0}', previousFolder.name),
      );

      return previousFolder;
    }

    // Multiple workspace folders are available and no previous selection exists
    const pickerPlaceholder = l10n.t(
      '{0}: Select a workspace folder to use. This folder will be used to load workspace-specific configuration for the extension',
      EXTENSION_DISPLAY_NAME,
    );
    const selectedFolder = await window.showWorkspaceFolderPick({
      placeHolder: pickerPlaceholder,
    });

    // Remember the user's selection for future use
    if (selectedFolder) {
      this.context.globalState.update(
        ContextKeys.SelectedWorkspaceFolder,
        selectedFolder.uri.toString(),
      );
    }

    return selectedFolder;
  }

  /**
   * Initializes configuration and sets up a listener for configuration changes.
   * The listener updates context keys and notifies users when the enable state changes.
   *
   * @param selectedWorkspaceFolder - The workspace folder used to load the configuration.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * const selectedFolder = await extensionRuntime.selectWorkspaceFolder();
   * if (selectedFolder) {
   *   extensionRuntime.initializeConfiguration(selectedFolder);
   * }
   */
  private initializeConfiguration(
    selectedWorkspaceFolder: WorkspaceFolder,
  ): void {
    // Get the configuration for the extension within the selected workspace
    this.config = new ExtensionConfig(
      workspace.getConfiguration(EXTENSION_ID, selectedWorkspaceFolder.uri),
    );

    this.config.workspaceSelection = selectedWorkspaceFolder.uri.fsPath;

    // Watch for changes in the workspace configuration
    workspace.onDidChangeConfiguration((configurationChangeEvent) => {
      const updatedWorkspaceConfig = workspace.getConfiguration(
        EXTENSION_ID,
        selectedWorkspaceFolder.uri,
      );

      if (
        configurationChangeEvent.affectsConfiguration(
          `${EXTENSION_ID}.enable`,
          selectedWorkspaceFolder.uri,
        )
      ) {
        const isExtensionEnabled =
          updatedWorkspaceConfig.get<boolean>('enable');

        this.config.update(updatedWorkspaceConfig);

        if (isExtensionEnabled) {
          const enabledMessage = l10n.t(
            'The {0} extension is now enabled and ready to use',
            EXTENSION_DISPLAY_NAME,
          );
          window.showInformationMessage(enabledMessage);
        } else {
          const disabledMessage = l10n.t(
            'The {0} extension is now disabled',
            EXTENSION_DISPLAY_NAME,
          );
          window.showInformationMessage(disabledMessage);
        }
      }

      if (
        configurationChangeEvent.affectsConfiguration(
          EXTENSION_ID,
          selectedWorkspaceFolder.uri,
        )
      ) {
        this.config.update(updatedWorkspaceConfig);
      }
    });
  }

  /**
   * Checks if the extension is enabled based on the current configuration.
   * If disabled, shows a warning message to the user (only once).
   *
   * @returns true if the extension is enabled, false otherwise.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * if (extensionRuntime.isExtensionEnabled()) {
   *   // Execute command handler logic
   * } else {
   *   // Command handler will be skipped and a warning will be shown (only on the first check)
   * }
   */
  private isExtensionEnabled(): boolean {
    const isEnabled = this.config.enable;

    if (isEnabled) {
      this.hasDisabledWarningBeenShown = false;
      return true;
    }

    if (!this.hasDisabledWarningBeenShown) {
      this.showError(
        l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        ),
      );
      this.hasDisabledWarningBeenShown = true;
    }

    return false;
  }

  /**
   * Registers a VS Code command that is gated by the extension's enabled state.
   * If the extension is disabled when the command is invoked, the handler is skipped.
   *
   * @param commandId - The unique identifier for the command.
   * @param commandHandler - The function to execute when the command is invoked.
   * @returns A disposable that removes the command registration when disposed.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * const disposable = extensionRuntime.registerCommand(
   *   'pythonGenerator.myCommand',
   *   () => {
   *     // Command handler logic that only runs if the extension is enabled
   *   }
   * );
   * // Remember to dispose of the command when it's no longer needed
   * disposable.dispose();
   */
  private registerCommand<CommandArgs extends unknown[]>(
    commandId: string,
    commandHandler: (...args: CommandArgs) => void | Promise<void>,
  ) {
    return commands.registerCommand(commandId, async (...args: CommandArgs) => {
      if (!this.isExtensionEnabled()) {
        return;
      }

      try {
        const resource = await this.resolveExecutionResource(args);
        if (!resource) {
          this.showError(
            l10n.t(
              '{0} could not find an active folder. Select a workspace folder to continue.',
              EXTENSION_DISPLAY_NAME,
            ),
          );
          return;
        }

        return commandHandler(...([resource, ...args.slice(1)] as CommandArgs));
      } catch (error) {
        this.showError(
          l10n.t(
            '{0} failed: {1}. Verify your target folder and try again.',
            EXTENSION_DISPLAY_NAME,
            error instanceof Error ? error.message : String(error),
          ),
        );
      }
    });
  }

  /**
   * Registers workspace selection command for multi-root workspaces.
   */
  private registerWorkspaceCommands(): void {
    const disposableChangeWorkspace = commands.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ChangeWorkspace}`,
      async () => {
        const pickerPlaceholder = l10n.t('Select a workspace folder to use');
        const selectedFolder = await window.showWorkspaceFolderPick({
          placeHolder: pickerPlaceholder,
        });

        if (selectedFolder) {
          this.context.globalState.update(
            ContextKeys.SelectedWorkspaceFolder,
            selectedFolder.uri.toString(),
          );

          const updatedWorkspaceConfig = workspace.getConfiguration(
            EXTENSION_ID,
            selectedFolder.uri,
          );
          this.config.update(updatedWorkspaceConfig);

          this.config.workspaceSelection = selectedFolder.uri.fsPath;

          window.showInformationMessage(
            l10n.t('Switched to workspace folder: {0}', selectedFolder.name),
          );
        }
      },
    );

    this.context.subscriptions.push(disposableChangeWorkspace);
  }

  /**
   * Resolves the execution resource for a command.
   *
   * If a URI is provided in the arguments, it is used directly.
   * Otherwise, attempts to infer the active folder from the workspace context.
   *
   * @param args - Command arguments passed during execution.
   * @returns The resolved URI or undefined if it cannot be determined.
   */
  private async resolveExecutionResource(
    args: unknown[],
  ): Promise<Uri | undefined> {
    const firstArg = args[0];

    if (firstArg instanceof Uri) {
      return firstArg;
    }

    const availableWorkspaceFolders = workspace.workspaceFolders;

    if (!availableWorkspaceFolders?.length) {
      this.showError(
        l10n.t(
          'No workspace folder found. Open a folder before generating files.',
        ),
      );
      return undefined;
    }

    if (availableWorkspaceFolders.length === 1) {
      return availableWorkspaceFolders[0].uri;
    }

    if (this.config.workspaceSelection) {
      const selectedFolder = workspace.getWorkspaceFolder(
        Uri.file(this.config.workspaceSelection),
      );

      if (selectedFolder) {
        return selectedFolder.uri;
      }
    }

    const previousFolderUriString = this.context.globalState.get<string>(
      ContextKeys.SelectedWorkspaceFolder,
    );

    if (previousFolderUriString) {
      const previousFolder = availableWorkspaceFolders.find(
        (folder) => folder.uri.toString() === previousFolderUriString,
      );

      if (previousFolder) {
        return previousFolder.uri;
      }
    }

    const selectedFolder = await window.showWorkspaceFolderPick({
      placeHolder: l10n.t('Select a target folder'),
    });

    if (selectedFolder) {
      await this.context.globalState.update(
        ContextKeys.SelectedWorkspaceFolder,
        selectedFolder.uri.toString(),
      );
      this.config.workspaceSelection = selectedFolder.uri.fsPath;
    }

    return selectedFolder?.uri;
  }

  /**
   * Shows a user-facing error through VS Code notifications.
   */
  private showError(message: string): void {
    window.showErrorMessage(message);
  }

  private registerGeneratorCommands(): void {
    // Create a new invoker
    const invoker = new CommandInvoker(this.config!.enable);

    // Define the commands and their corresponding handlers
    const commands = [
      {
        id: CommandIds.GenerateCustomComponent,
        handler: new GenerateCustomComponentCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateComponent,
        handler: new GenerateComponentCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GeneratePage,
        handler: new GeneratePageCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateStore,
        handler: new GenerateStoreCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateRouter,
        handler: new GenerateRouterCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateComposable,
        handler: new GenerateComposableCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateDirective,
        handler: new GenerateDirectiveCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateMiddleware,
        handler: new GenerateMiddlewareCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateModel,
        handler: new GenerateModelCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateLayout,
        handler: new GenerateLayoutCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateService,
        handler: new GenerateServiceCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateTest,
        handler: new GenerateTestCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateEnum,
        handler: new GenerateEnumCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateConstant,
        handler: new GenerateConstantCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
      {
        id: CommandIds.GenerateHook,
        handler: new GenerateHookCommand(
          this.config!,
          this.context.extensionUri,
        ),
      },
    ];

    // Register the commands dynamically and push them to the context subscriptions
    commands.forEach(({ id, handler }) => {
      invoker.register(id, handler);

      const disposable = this.registerCommand(
        `${EXTENSION_ID}.${id}`,
        async (uri: Uri) => await invoker.execute(id, uri),
      );

      this.context.subscriptions.push(disposable);
    });
  }
}
