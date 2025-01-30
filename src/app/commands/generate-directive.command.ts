import { Uri } from 'vscode';
import { BaseCommand } from './base.command';

/**
 * The GenerateDirectiveCommand class.
 *
 * @class
 * @classdesc The class that represents the generate directive command.
 * @extends {BaseCommand}
 * @export
 * @public
 * @example
 * const command = new GenerateDirectiveCommand(config);
 */
export class GenerateDirectiveCommand extends BaseCommand {
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
   * @memberof generateDirectiveCommad
   *
   * @param {Uri} folderPath - The folder path
   */
  async execute(folderPath?: Uri): Promise<void> {
    this.service.generateComponent(folderPath, 'directive');
  }
}
