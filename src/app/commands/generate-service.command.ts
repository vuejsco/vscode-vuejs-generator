import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateServiceCommad class.
 *
 * @class
 * @classdesc The class that represents the generate service command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateServiceCommad(config);
 */
export class GenerateServiceCommad extends BaseCommand {
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
   * @memberof generateServiceCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'service');
  }
}
