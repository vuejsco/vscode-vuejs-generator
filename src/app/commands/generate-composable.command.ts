import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateComposableCommand class.
 *
 * @class
 * @classdesc The class that represents the generate composable command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateComposableCommand(config);
 */
export class GenerateComposableCommand extends BaseCommand {
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
   * @memberof generateComposeableCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'composable');
  }
}
