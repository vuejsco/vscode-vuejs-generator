import {
  access,
  existsSync,
  mkdirSync,
  open,
  readFileSync,
  writeFile,
} from 'fs';
import * as mustache from 'mustache';
import { dirname, join } from 'path';
import {
  Uri,
  WorkspaceFolder,
  commands,
  l10n,
  window,
  workspace,
} from 'vscode';
import { ContentTemplate, ExtensionConfig } from '../configs';
import {
  camelize,
  constantize,
  kebabize,
  pascalize,
  sentenceCase,
  snakeize,
  titleize,
} from '../helpers';

/**
 * The FileGeneratorService class.
 * This class is responsible for generating files.
 *
 * @class
 * @example
 * const service = new FileGeneratorService(config);
 * service.generateEntity('class', Uri.parse('path'), true);
 */
export class FileGeneratorService {
  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * The constructor.
   *
   * @param {ExtensionConfig} config - The extension configuration.
   * @param {string} extensionUri - The extension URI.
   * @memberof FileGeneratorService
   */
  constructor(
    private readonly config: ExtensionConfig,
    private readonly extensionUri: Uri,
  ) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * The generateComponent method.
   *
   * @function generateComponent
   * @public
   * @async
   * @memberof FilesController
   * @example
   * controller.generateComponent(Uri.parse('path'), 'component');
   *
   * @param {Uri} folderPath - The folder path
   * @param {string} componentType - The component type
   *
   * @returns {Promise<void>} - The promise with no return value
   */
  async generateComponent(
    folderPath?: Uri,
    componentType?: string,
  ): Promise<void> {
    if (!folderPath || !componentType) {
      const message = l10n.t('Operation cancelled!');
      window.showInformationMessage(message);
      return;
    }

    await this.generateEntity(folderPath, componentType);
  }

  /**
   * The generateCustomComponent method.
   *
   * @function generateCustomComponent
   * @public
   * @async
   * @memberof FilesController
   * @example
   * controller.generateCustomComponent(Uri.parse('path'));
   *
   * @param {Uri} folderPath - The folder path
   *
   * @returns {Promise<void>} - The promise with no return value
   */
  async generateCustomComponent(folderPath?: Uri): Promise<void> {
    if (!folderPath) {
      const message = l10n.t('Operation cancelled!');
      window.showInformationMessage(message);
      return;
    }

    await this.generateComponentTemplate(folderPath);
  }

  // Private methods

  /**
   * The promptInput method.
   *
   * @function promptInput
   * @private
   * @async
   * @memberof FilesController
   * @example
   * controller.promptInput('prompt', 'placeHolder', 'value', (input) => 'error');
   *
   * @param {string} prompt - The prompt
   * @param {string} placeHolder - The place holder
   * @param {string} value - The value
   * @param {(input: string) => string | undefined} validateInput - The validate input
   *
   * @returns {Promise<string | undefined>} - The promise with the return value
   */
  private async promptInput(
    prompt: string,
    placeHolder: string,
    value?: string,
    validateInput?: (input: string) => string | undefined,
  ): Promise<string | undefined> {
    return await window.showInputBox({
      prompt,
      placeHolder,
      value,
      validateInput,
    });
  }

  /**
   * The generateEntity method.
   *
   * @function generateEntity
   * @public
   * @async
   * @memberof FilesController
   * @example
   * controller.generateEntity('class', Uri.parse('path'), true);
   *
   * @param {FileEntityType} componentType - The entity type
   * @param {Uri} folderPath - The folder path
   * @param {boolean} allowEntityTypeInput - The flag to allow entity type input
   *
   * @returns {Promise<void>} - The promise with no return value
   */
  private async generateEntity(
    folderPath: Uri,
    componentType: string,
  ): Promise<void> {
    const { skipFolderConfirmation, author, owner, maintainer } = this.config;

    let workspaceFolder: WorkspaceFolder | undefined;
    let relativeFolderPath: string = '';

    if (folderPath) {
      workspaceFolder = workspace.getWorkspaceFolder(folderPath);
      relativeFolderPath = workspace.asRelativePath(folderPath);
    } else if (
      workspace.workspaceFolders &&
      workspace.workspaceFolders.length === 1
    ) {
      workspaceFolder = workspace.workspaceFolders[0];
    } else {
      const placeHolder = l10n.t(
        'Select a workspace folder to use. This folder will be used to generate the file',
      );
      workspaceFolder = await window.showWorkspaceFolderPick({
        placeHolder,
      });
    }

    if (!workspaceFolder) {
      const message = l10n.t(
        'The workspace folder does not exist. Please select a valid workspace folder to use',
      );
      window.showErrorMessage(message);
      return;
    }

    let folderName: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {
      folderName = await this.promptInput(
        l10n.t(
          'Enter the folder name where the {0} will be created',
          componentType,
        ),
        l10n.t('Enter the folder name, e.g. models, services, utils, etc.'),
        relativeFolderPath,
        (path) =>
          !/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)
            ? l10n.t(
                'The folder name is invalid! Please enter a valid folder name',
              )
            : undefined,
      );

      if (!folderName) {
        const message = l10n.t('Operation cancelled!');
        window.showInformationMessage(message);
        return;
      }
    } else {
      folderName = relativeFolderPath;
    }

    const componentName = await this.promptInput(
      l10n.t(
        'Enter the file name for the custom component. The file extension will be added automatically',
      ),
      l10n.t('Enter the file name, e.g. User, Product, Order, etc.'),
      undefined,
    );

    if (!componentName) {
      const message = l10n.t('Operation cancelled!');
      window.showInformationMessage(message);
      return;
    }

    const template = this.getTemplate(componentType);

    if (!template) {
      const message = l10n.t(
        'The template for the {0} does not exist. Please try again',
        componentType,
      );
      window.showErrorMessage(message);
      return;
    }

    const content = this.generateFileContent(template.template);

    const variables = {
      fileName: componentName,
      fileNameCamelCase: camelize(componentName),
      fileNamePascalCase: pascalize(componentName),
      fileNameKebabCase: kebabize(componentName),
      fileNameSnakeCase: snakeize(componentName),
      fileNameConstantCase: constantize(componentName),
      fileNameDotCase: componentName.replace(/\s+/g, '.').toLowerCase(),
      fileNamePathCase: componentName.replace(/\s+/g, '/').toLowerCase(),
      fileNameSentenceCase: sentenceCase(componentName),
      fileNameLowerCase: componentName.toLowerCase(),
      fileNameTitleCase: titleize(componentName),
      fileNameWithExt: `${componentName}.${template.type}`,
      fileExt: template.type,
      date: new Date().toISOString().split('T')[0],
      author,
      owner,
      maintainer,
    };

    const fileContent = mustache.render(content, variables);

    const resolvedFolderPath = join(workspaceFolder.uri.fsPath, folderName);
    const fileName = `${componentName}.${template.type}`;

    this.saveFile(resolvedFolderPath, fileName, fileContent);
  }

  /**
   * The getTemplate method.
   *
   * @function getTemplate
   * @private
   * @memberof FilesController
   * @example
   * controller.getTemplate('command');
   *
   * @param {string} command - The command
   *
   * @returns {ContentTemplate | undefined} - The template or null
   */
  private getTemplate(command: string): ContentTemplate | undefined {
    const templatePath = Uri.joinPath(
      this.extensionUri,
      'templates',
      `${command}.json`,
    );

    if (!existsSync(templatePath.fsPath)) {
      return;
    }

    return JSON.parse(readFileSync(templatePath.fsPath, 'utf-8'));
  }

  /**
   * The generateComponentTemplate method.
   *
   * @function generateComponentTemplate
   * @public
   * @async
   * @memberof FilesController
   * @example
   * controller.generateComponentTemplate(Uri.parse('path'));
   *
   * @param {Uri} folderPath - The folder path
   *
   * @returns {Promise<void>} - The promise with no return value
   */
  private async generateComponentTemplate(folderPath: Uri): Promise<void> {
    const {
      skipFolderConfirmation,
      customComponents,
      author,
      owner,
      maintainer,
    } = this.config;

    let workspaceFolder: WorkspaceFolder | undefined;
    let relativeFolderPath: string = '';

    if (folderPath) {
      workspaceFolder = workspace.getWorkspaceFolder(folderPath);
      relativeFolderPath = workspace.asRelativePath(folderPath);
    } else if (
      workspace.workspaceFolders &&
      workspace.workspaceFolders.length === 1
    ) {
      workspaceFolder = workspace.workspaceFolders[0];
    } else {
      const placeHolder = l10n.t(
        'Select a workspace folder to use. This folder will be used to generate the file',
      );
      workspaceFolder = await window.showWorkspaceFolderPick({
        placeHolder,
      });
    }

    if (!workspaceFolder) {
      const message = l10n.t(
        'The workspace folder does not exist. Please select a valid workspace folder to use',
      );
      window.showErrorMessage(message);
      return;
    }

    let folderName: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {
      folderName = await this.promptInput(
        l10n.t(
          'Enter the folder name where the custom component will be created',
        ),
        l10n.t('Enter the folder name, e.g. components, shared, etc.'),
        relativeFolderPath,
        (path) =>
          !/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)
            ? l10n.t(
                'The folder name is invalid! Please enter a valid folder name',
              )
            : undefined,
      );

      if (!folderName) {
        const message = l10n.t('Operation cancelled!');
        window.showInformationMessage(message);
        return;
      }
    } else {
      folderName = relativeFolderPath;
    }

    if (customComponents.length === 0) {
      const message = l10n.t(
        'The custom components list is empty. Please add custom components to the configuration',
      );
      window.showErrorMessage(message);
      return;
    }

    const items = customComponents.map((item: any) => {
      return {
        label: item.name,
        description: item.description,
        detail: item.type,
      };
    });

    const option = await window.showQuickPick(items, {
      placeHolder: l10n.t(
        'Select the template for the custom element generation',
      ),
    });

    if (!option) {
      const message = l10n.t('Operation cancelled!');
      window.showInformationMessage(message);
      return;
    }

    const componentName = await this.promptInput(
      l10n.t(
        'Enter the file name for the custom component. The file extension will be added automatically',
      ),
      l10n.t('Enter the file name, e.g. User, Product, Order, etc.'),
      undefined,
    );

    if (!componentName) {
      const message = l10n.t('Operation cancelled!');
      window.showInformationMessage(message);
      return;
    }

    const template = customComponents.find(
      (item: any) => item.name === option.label,
    );

    if (!template) {
      const message = l10n.t(
        'The template for the custom component does not exist. Please try again',
      );
      window.showErrorMessage(message);
      return;
    }

    const content = this.generateFileContent(template.template);

    const variables = {
      fileName: componentName,
      fileNameCamelCase: camelize(componentName),
      fileNamePascalCase: pascalize(componentName),
      fileNameKebabCase: kebabize(componentName),
      fileNameSnakeCase: snakeize(componentName),
      fileNameConstantCase: constantize(componentName),
      fileNameDotCase: componentName.replace(/\s+/g, '.').toLowerCase(),
      fileNamePathCase: componentName.replace(/\s+/g, '/').toLowerCase(),
      fileNameSentenceCase: sentenceCase(componentName),
      fileNameLowerCase: componentName.toLowerCase(),
      fileNameTitleCase: titleize(componentName),
      fileNameWithExt: `${componentName}.${template.type}`,
      fileExt: template.type,
      date: new Date().toISOString().split('T')[0],
      author,
      owner,
      maintainer,
    };

    const fileContent = mustache.render(content, variables);

    const resolvedFolderPath = join(workspaceFolder.uri.fsPath, folderName);
    const fileName = `${componentName}.${template.type}`;

    this.saveFile(resolvedFolderPath, fileName, fileContent);
  }

  /**
   * The fileContentTemplate method.
   *
   * @function fileContentTemplate
   * @param {string} entityName - The entity name
   * @param {string[]} template - The template
   * @memberof FilesController
   * @private
   * @example
   * controller.fileContentTemplate(['template']);
   *
   * @returns {string} - The file content
   */
  private generateFileContent(template: string[]): string {
    const {
      excludeSemiColonAtEndOfLine,
      endOfLine,
      headerCommentTemplate,
      insertFinalNewline,
    } = this.config;

    const newline = endOfLine === 'crlf' ? '\r\n' : '\n';

    let content: string = '';

    if (headerCommentTemplate.length > 0) {
      content += headerCommentTemplate.join(newline) + newline + newline;
    }

    content += template.join(newline);

    // Add a final newline
    if (insertFinalNewline) {
      content += newline;
    }

    if (excludeSemiColonAtEndOfLine) {
      content = content.replace(/;$/, '');
    }

    return content;
  }

  /**
   * The saveFile method.
   *
   * @function saveFile
   * @private
   * @async
   * @memberof FilesController
   * @example
   * controller.saveFile('path', 'filename', 'data');
   *
   * @param {string} directoryPath - The path
   * @param {string} fileName - The filename
   * @param {string} fileContent - The data
   *
   * @returns {Promise<void>} - The promise with no return value
   */
  private async saveFile(
    directoryPath: string,
    fileName: string,
    fileContent: string,
  ): Promise<void> {
    const file = join(directoryPath, fileName);

    if (!existsSync(dirname(file))) {
      mkdirSync(dirname(file), { recursive: true });
    }

    access(file, (err: any) => {
      if (err) {
        open(file, 'w+', (err: any, fd: any) => {
          if (err) {
            const message = l10n.t(
              'The file has not been created! Please try again',
            );
            window.showErrorMessage(message);
            return;
          }

          writeFile(fd, fileContent, 'utf8', (err: any) => {
            if (err) {
              const message = l10n.t(
                'The {0} has been created successfully',
                fileName,
              );
              window.showErrorMessage(message);
              return;
            }

            const openPath = Uri.file(file);

            workspace.openTextDocument(openPath).then(async (filename) => {
              await commands.executeCommand('workbench.action.files.saveAll');
              await window.showTextDocument(filename);
            });
          });
        });

        const message = l10n.t('File created successfully!');
        window.showInformationMessage(message);
      } else {
        const message = l10n.t(
          'The file name already exists! Please enter a different name',
        );
        window.showWarningMessage(message);
      }
    });
  }
}
