import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateHookCommand class.
 *
 * @class
 * @classdesc The class that represents the generate hook command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateHookCommand(config);
 */
export class GenerateHookCommand extends BaseCommand {
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
   * @memberof generateHookCommand
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'hook');
  }
}
