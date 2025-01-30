import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GeneratePageCommad class.
 *
 * @class
 * @classdesc The class that represents the generate page command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GeneratePageCommad(config);
 */
export class GeneratePageCommad extends BaseCommand {
  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * The execute method.
   *
   * @async
   * @method execute
   * @public
   * @memberof generatePageCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'page');
  }
}
