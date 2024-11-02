//types
import { PluginProps } from '@stackpress/idea-transformer/dist/Transformer';

import BaseTerminal from '@stackpress/types/dist/Terminal';
import Transformer from '@stackpress/idea-transformer/dist/Transformer';
import Loader from '@stackpress/idea-transformer/dist/Loader';
import Project from './Project';

export type CLIProps = { cli: InceptTerminal };
export type TerminalTransformer = Transformer<CLIProps>
export type PluginWithCLIProps = PluginProps<CLIProps>;

export default class InceptTerminal extends BaseTerminal {
  // brand to prefix in all logs
  public static brand: string = '[INCEPT]';
  //access to static methods from the instance
  public readonly terminal: typeof InceptTerminal;
  public readonly project: Project;

  protected _bootstrapped = false;

  /**
   * Preloads the input and output settings
   */
  public constructor(args: string[], cwd = Loader.cwd()) {
    super(args, cwd);
    this.terminal = this.constructor as typeof InceptTerminal;
    this.project = new Project(cwd);
    this.on('transform', _ => {
      //get io from commandline
      const input = Loader.absolute(
        //get the idea location from the cli
        this.expect([ 'input', 'i' ], './schema.idea'), 
        this.cwd
      );
      const transformer = new Transformer<CLIProps>(input, this.cwd);
      transformer.transform({ cli: this });
      this.terminal.success('Your idea has been transformed');
    });
  }

  /**
   * Bootstraps the project and binds with the terminal
   */
  public bootstrap() {
    if (!this._bootstrapped) {
      this.project.bootstrap();
      this.use(this.project);
    }
    return this;
  }
}