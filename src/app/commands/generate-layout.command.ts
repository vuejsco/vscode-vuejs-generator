import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateLayoutCommand class.
 *
 * @class
 * @classdesc The class that represents the generate layout command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateLayoutCommand(config);
 */
export class GenerateLayoutCommand extends BaseCommand {
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
   * @memberof generateLayoutCommand
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'layout');
  }
}
