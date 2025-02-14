import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateTestCommand class.
 *
 * @class
 * @classdesc The class that represents the generate test command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateTestCommand(config);
 */
export class GenerateTestCommand extends BaseCommand {
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
   * @memberof generateTestCommand
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'test');
  }
}
