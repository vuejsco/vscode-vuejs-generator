import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateLayoutCommad class.
 *
 * @class
 * @classdesc The class that represents the generate layout command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateLayoutCommad(config);
 */
export class GenerateLayoutCommad extends BaseCommand {
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
   * @memberof generateLayoutCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'layout');
  }
}
