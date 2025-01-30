import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateMiddlewareCommad class.
 *
 * @class
 * @classdesc The class that represents the generate middleware command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateMiddlewareCommad(config);
 */
export class GenerateMiddlewareCommad extends BaseCommand {
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
   * @memberof generateMiddlewareCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'middleware');
  }
}
