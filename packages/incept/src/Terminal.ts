import type { PluginLoaderOptions } from '@stackpress/ingest/dist/types';

import IdeaTerminal from '@stackpress/idea-transformer/dist/Terminal';
import Factory from '@stackpress/ingest/dist/Factory';

export default class InceptTerminal extends IdeaTerminal {
  // brand to prefix in all logs
  public static brand: string = '[INCEPT]';
  //access to static methods from the instance
  //@ts-ignore - Types of construct signatures are incompatible.
  public readonly terminal: typeof InceptTerminal;
  //the project
  public readonly factory: Factory;

  protected _bootstrapped = false;

  /**
   * Preloads the input and output settings
   */
  public constructor(args: string[], options: PluginLoaderOptions = {}) {
    super(args, options);
    //make static methods available to this instance
    this.terminal = this.constructor as typeof InceptTerminal;
    //create a new project
    this.factory = new Factory({
      filenames: [
        '/incept.build.js', 
        '/incept.build.json'
      ],
      ...options
    });
  }

  /**
   * Bootstraps the project and binds with the terminal
   */
  public async bootstrap() {
    if (!this._bootstrapped) {
      await this.factory.bootstrap();
    }
    return this;
  }

  /**
   * Runs the command
   */
  public async run() {
    if (this._command === 'transform') {
      const request = this.factory.request({ 
        data: { transformer: this.transformer } 
      });
      const response = this.factory.response();
      await this.factory.emit('idea', request, response);
    }
    const request = this.factory.request({ data: this.params });
    const response = this.factory.response();
    return await this.factory.emit(this._command, request, response);
  }
}