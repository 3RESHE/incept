//stackpress
import type { ServerOptions } from '@stackpress/ingest/dist/types';
import IdeaTerminal from '@stackpress/idea-transformer/dist/Terminal';
import Server from '@stackpress/ingest/dist/Server';

export default class InceptTerminal extends IdeaTerminal {
  // brand to prefix in all logs
  public static brand: string = '[INCEPT]';
  //access to static methods from the instance
  //@ts-ignore - Types of construct signatures are incompatible.
  public readonly terminal: typeof InceptTerminal;
  //the server
  public readonly server: Server;

  /**
   * Preloads the input and output settings
   */
  public constructor(args: string[], options: ServerOptions = {}) {
    super(args, options);
    //make static methods available to this instance
    this.terminal = this.constructor as typeof InceptTerminal;
    //create a new project
    this.server = new Server(options);
    this.server.on('transform', _ => {
      this.transformer.transform({ cli: this });
    });
  }

  /**
   * Bootstraps the project and binds with the terminal
   */
  public async bootstrap() {
    await this.server.bootstrap();
    return this;
  }

  /**
   * Runs the command
   */
  public async run() {
    if (this._command === 'transform') {
      const request = this.server.request({ 
        data: { transformer: this.transformer } 
      });
      const response = this.server.response();
      await this.server.emit('idea', request, response);
    }
    const request = this.server.request({ data: this.params });
    const response = this.server.response();
    return await this.server.emit(this._command, request, response);
  }
}