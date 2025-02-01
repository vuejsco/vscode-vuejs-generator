import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateModelCommand class.
 *
 * @class
 * @classdesc The class that represents the generate model command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateModelCommand(config);
 */
export class GenerateModelCommand extends BaseCommand {
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
   * @memberof generateModelCommand
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'model');
  }
}
