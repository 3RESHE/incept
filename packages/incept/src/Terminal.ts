import type ConfigLoader from './loader/Config';

import path from 'path';
import IdeaTerminal from '@stackpress/idea-transformer/dist/Terminal';
import Project from './Project';

export default class InceptTerminal extends IdeaTerminal {
  // brand to prefix in all logs
  public static brand: string = '[INCEPT]';
  //access to static methods from the instance
  //@ts-ignore - Types of construct signatures are incompatible.
  public readonly terminal: typeof InceptTerminal;
  //the project
  public readonly project: Project;

  protected _bootstrapped = false;

  /**
   * Preloads the input and output settings
   */
  public constructor(args: string[], loader: ConfigLoader) {
    super(args, { cwd: loader.cwd, fs: loader.fs });
    //make static methods available to this instance
    this.terminal = this.constructor as typeof InceptTerminal;
    //create a new project
    this.project = new Project(
      loader.require<Record<string, any>>(
        path.join(loader.cwd, 'incept.config.js'), 
        { cwd: loader.cwd }
      )
    );
  }

  /**
   * Bootstraps the project and binds with the terminal
   */
  public async bootstrap() {
    if (!this._bootstrapped) {
      await this.project.bootstrap();
      this.use(this.project);
    }
    return this;
  }

  /**
   * Runs the command
   */
  public async run() {
    if (this._command === 'transform') {
      //@ts-ignore - Expecting [ Hash ], oops...
      await this.emit('idea', this.transformer);
    }
    return await this.emit(this._command, this.params);
  }
}