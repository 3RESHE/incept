import type { PluginLoaderOptions } from '../types';

import path from 'path';
import ConfigLoader from './Config';

export default class PluginLoader extends ConfigLoader {
  //The location for `node_modules`
  protected _modules: string;
  //List of plugins
  protected _plugins?: string[];

  /**
   * If the config is not set, then it loads it.
   * Returns the plugin configs
   */
  public get plugins(): string[] {
    if (!this._plugins) {
      const file = this.resolve();
      let plugins = file ? require(file): [];
      //if import
      if (plugins.default) {
        plugins = plugins.default;
      }
      //if package.json, look for the `incept` key
      if (plugins.incept) {
        plugins = plugins.incept;
      }

      if (typeof plugins == 'string') {
        plugins = [ plugins ];
      }

      this._plugins = Array.isArray(plugins) ? plugins : [];
    }

    return Array.from(this._plugins);
  }

  /**
   * Setups up the current working directory
   */
  public constructor(options: PluginLoaderOptions) {
    super(options);
    const { plugins = [], modules } = options;
    this._modules = modules || this.modules();
    this._plugins = plugins;
  }

  /**
   * Requires all the files and registers it to the context.
   * You can only bootstrap server files.
   */
  public async bootstrap(loader: (name: string, plugin: unknown) => Promise<void>) {
    //config should be a list of files
    for (let pathname of this.plugins) {
      const plugin = this.require(pathname);
      
      if(Array.isArray(plugin)) {
        //get the folder name of the plugin pathname
        const cwd = path.dirname(pathname);
        //make a new plugin
        //cwd, this._modules, plugin
        const child = new PluginLoader({ 
          cwd, 
          fs: this.fs, 
          modules: this._modules, 
          plugins: plugin 
        });
        //bootstrap
        child.bootstrap(loader);
      } else {
        //try consuming it
        const filename = pathname.startsWith(this._modules) 
          ? pathname.substring(this._modules.length + 1) 
          : pathname.startsWith(this.cwd) 
          ? pathname.substring(this.cwd.length + 1)
          : pathname;
        const extname = path.extname(filename);
        const name = filename.substring(0, filename.length - extname.length);
        await loader(name, plugin);
      }
    }

    return this;
  }
}