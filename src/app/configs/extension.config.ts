import { WorkspaceConfiguration } from 'vscode';

import {
  ContentTemplate,
  DEFAULT_AUTHOR,
  DEFAULT_CONTENT_TEMPLATES,
  DEFAULT_ENABLE,
  DEFAULT_END_OF_LINE,
  DEFAULT_EXCLUDE_SEMI_COLON_AT_END_OF_LINE,
  DEFAULT_HEADER_COMMENT_TEMPLATE,
  DEFAULT_INSERT_FINAL_NEWLINE,
  DEFAULT_MAINTAINER,
  DEFAULT_OWNER,
  DEFAULT_SKIP_FOLDER_CONFIRMATION,
} from './constants.config';

/**
 * The Config class.
 *
 * @class
 * @classdesc The class that represents the configuration of the extension.
 * @export
 * @public
 * @property {WorkspaceConfiguration} config - The workspace configuration
 * @property {boolean} enable - The enable the extension
 * @property {boolean} skipFolderConfirmation - The skip folder confirmation
 * @property {boolean} excludeSemiColonAtEndOfLine - The exclude semi-colon at the end of line
 * @property {'crlf' | 'lf'} endOfLine - The end of line
 * @property {string[]} headerCommentTemplate - The header comment template
 * @property {boolean} insertFinalNewline - The insert final newline
 * @property {ContentTemplate[]} customComponents - The custom components
 * @example
 * const config = new Config(workspace.getConfiguration());
 * console.log(config.enable);
 */
export class ExtensionConfig {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /**
   * The enable the extension.
   * @type {boolean}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.enable);
   * @default true
   */
  enable: boolean;

  /**
   * The skip folder confirmation.
   * @type {boolean}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.skipFolderConfirmation);
   * @default false
   */
  skipFolderConfirmation: boolean;

  /**
   * The exclude semi-colon at the end of line.
   * @type {boolean}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.excludeSemiColonAtEndOfLine);
   * @default false
   */
  excludeSemiColonAtEndOfLine: boolean;

  /**
   * The end of line.
   * @type {'crlf' | 'lf'}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.endOfLine);
   * @default 'lf'
   */
  endOfLine: 'crlf' | 'lf';

  /**
   * The header comment template.
   * @type {string[]}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.headerCommentTemplate);
   * @default []
   */
  headerCommentTemplate: string[];

  /**
   * The insert final newline.
   * @type {boolean}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.insertFinalNewline);
   * @default true
   */
  insertFinalNewline: boolean;

  /**
   * The custom components.
   * @type {object[]}
   * @public
   * @memberof ExtensionConfig
   * @example
   * const config = new ExtensionConfig(workspace.getConfiguration());
   * console.log(config.customComponents);
   */
  customComponents: ContentTemplate[];

  /**
   * The author.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * const config = new ExtensionConfig(workspace.getConfiguration());
   * console.log(config.author);
   * @default ''
   */
  author: string;

  /**
   * The owner.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * const config = new ExtensionConfig(workspace.getConfiguration());
   * console.log(config.owner);
   * @default ''
   */
  owner: string;

  /**
   * The repository.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * const config = new ExtensionConfig(workspace.getConfiguration());
   * console.log(config.repository);
   * @default ''
   */
  maintainer: string;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the Config class.
   *
   * @constructor
   * @param {WorkspaceConfiguration} config - The workspace configuration
   * @public
   * @memberof Config
   */
  constructor(readonly config: WorkspaceConfiguration) {
    this.enable = config.get<boolean>('enable', DEFAULT_ENABLE);
    this.skipFolderConfirmation = config.get<boolean>(
      'files.skipFolderConfirmation',
      DEFAULT_SKIP_FOLDER_CONFIRMATION,
    );
    this.excludeSemiColonAtEndOfLine = config.get<boolean>(
      'formatting.excludeSemiColonAtEndOfLine',
      DEFAULT_EXCLUDE_SEMI_COLON_AT_END_OF_LINE,
    );
    this.endOfLine = config.get<'crlf' | 'lf'>(
      'formatting.endOfLine',
      DEFAULT_END_OF_LINE,
    );
    this.headerCommentTemplate = config.get<string[]>(
      'formatting.headerCommentTemplate',
      DEFAULT_HEADER_COMMENT_TEMPLATE,
    );
    this.insertFinalNewline = config.get<boolean>(
      'formatting.insertFinalNewline',
      DEFAULT_INSERT_FINAL_NEWLINE,
    );
    this.customComponents = config.get<ContentTemplate[]>(
      'templates.customComponents',
      DEFAULT_CONTENT_TEMPLATES,
    );
    this.author = config.get<string>('project.author', DEFAULT_AUTHOR);
    this.owner = config.get<string>('project.owner', DEFAULT_OWNER);
    this.maintainer = config.get<string>(
      'project.maintainer',
      DEFAULT_MAINTAINER,
    );
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * The update method.
   *
   * @function update
   * @param {WorkspaceConfiguration} config - The workspace configuration
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * config.update(workspace.getConfiguration());
   */
  update(config: WorkspaceConfiguration): void {
    this.enable = config.get<boolean>('enable', this.enable);
    this.skipFolderConfirmation = config.get<boolean>(
      'files.skipFolderConfirmation',
      this.skipFolderConfirmation,
    );
    this.excludeSemiColonAtEndOfLine = config.get<boolean>(
      'formatting.excludeSemiColonAtEndOfLine',
      this.excludeSemiColonAtEndOfLine,
    );
    this.endOfLine = config.get<'crlf' | 'lf'>(
      'formatting.endOfLine',
      this.endOfLine,
    );
    this.headerCommentTemplate = config.get<string[]>(
      'formatting.headerCommentTemplate',
      this.headerCommentTemplate,
    );
    this.insertFinalNewline = config.get<boolean>(
      'formatting.insertFinalNewline',
      this.insertFinalNewline,
    );
    this.customComponents = config.get<ContentTemplate[]>(
      'templates.customComponents',
      this.customComponents,
    );
    this.author = config.get<string>('project.author', this.author);
    this.owner = config.get<string>('project.owner', this.owner);
    this.maintainer = config.get<string>('project.maintainer', this.maintainer);
  }
}
