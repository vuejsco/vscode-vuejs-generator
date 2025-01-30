import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateConstantCommad class.
 *
 * @class
 * @classdesc The class that represents the generate constant command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateConstantCommad(config);
 */
export class GenerateConstantCommad extends BaseCommand {
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
   * @memberof generateConstantCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'constant');
  }
}
