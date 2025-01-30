import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateCustomComponentCommad class.
 *
 * @class
 * @classdesc The class that represents the generate custom component command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateCustomComponentCommad(config);
 */
export class GenerateCustomComponentCommad extends BaseCommand {
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
   * @memberof generateComponentCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateCustomComponent(folderPath);
  }
}
