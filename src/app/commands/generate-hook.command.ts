import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateHookCommad class.
 *
 * @class
 * @classdesc The class that represents the generate hook command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateHookCommad(config);
 */
export class GenerateHookCommad extends BaseCommand {
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
   * @memberof generateHookCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'hook');
  }
}
