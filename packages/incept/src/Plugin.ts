import fs from 'fs';
import path from 'path';
import Exception from '@stackpress/types/dist/Exception';
import Loader from '@stackpress/idea-transformer/dist/Loader';

export default class PluginLoader {
  /**
   * The current working directory
   */
  public readonly cwd: string;
  
  /**
   * The location for `node_modules`
   */
  protected _modules: string;

  /**
   * List of plugins
   */
  protected _plugins?: string[];

  /**
   * If the config is not set, then it loads it.
   * Returns the plugin configs
   */
  public get plugins(): string[] {
    if (!this._plugins) {
      let plugins = require(this.resolve());
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
  public constructor(cwd: string, modules?: string, plugins?: string[]) {
    this.cwd = cwd;
    //if no node_modules directory
    if (!modules) {
      //make it the current directory
      modules = Loader.modules(cwd);
    }
    this._modules = modules;
    this._plugins = plugins;
  }

  /**
   * Requires all the files and registers it to the context.
   * You can only bootstrap server files.
   */
  public async bootstrap(loader: (name: string, plugin: unknown) => Promise<void>) {
    //config should be a list of files
    for (let pathname of this.plugins) {
      pathname = this.resolve(pathname);
      //require the plugin
      let plugin = require(pathname);
      //if using import
      if (plugin.default) {
        plugin = plugin.default;
      }

      //if package.json, look for the `incept` key
      if (plugin.incept) {
        plugin = plugin.incept;
      } 
      
      if(Array.isArray(plugin)) {
        //get the folder name of the plugin pathname
        const cwd = path.dirname(pathname);
        //make a new plugin
        const child = new PluginLoader(cwd, this._modules, plugin);
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

  /**
   * Resolves the path name to a path that can be required
   */
  public resolve(pathname?: string): string {
    //if no pathname
    if (!pathname) {
      pathname = this.cwd;
    //ex. ./plugin or ../plugin -> [cwd] / plugin 
    } else if (pathname.match(/^.{1,2}\//g)) {
      pathname = path.resolve(this.cwd, pathname);
    //ex. plugin/foo
    } else {
      pathname = path.resolve(this._modules, pathname);
    }
    //ex. /plugin/foo
    //it's already absolute...

    //1. Check if pathname is literally a file
    let file = pathname;
    //2. check for [pathname].js
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file += '.js';
    }
    //3. check for [pathname].json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file += 'on';
    }
    //4. Check for incept.js
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'incept.js');
    }
    //5. Check for incept.json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) { 
      file += 'on';
    }
    //6. Check for package.json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'package.json');
    }

    Exception.require (
      fs.existsSync(file) && fs.lstatSync(file).isFile(),
      'Could not resolve `%s`',
      pathname
    );

    return file;
  }
}