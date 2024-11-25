import type { ConfigLoaderOptions } from '../types';

import NodeFS from '@stackpress/types/dist/filesystem/NodeFS';
import FileLoader from '@stackpress/types/dist/filesystem/FileLoader';
import Exception from '../Exception';

export default class ConfigLoader extends FileLoader {
  /**
   * Setups up the current working directory
   */
  public constructor(options: ConfigLoaderOptions = {}) {
    super(options.fs || new NodeFS(), options.cwd || process.cwd());
  }

  /**
   * Simulates an import statement
   */
  public async import<T = any>(pathname = this.cwd, defaults?: T) {
    //resolve the pathname
    const file = this.resolve(pathname);
    //if no file was resolved
    if (!file) {
      //throw an exception if there are no defaults
      Exception.require (
        typeof defaults !== 'undefined',
        'Could not resolve `%s`',
        pathname
      );
      //return the defaults
      return defaults;
    }
    //require the plugin
    let imported = await import(file);
    //if using import
    if (imported.default) {
      imported = imported.default;
    }
    //if package.json, look for the `incept` key
    if (imported.incept) {
      imported = imported.incept;
    } 
    return imported as T;
  }

  /**
   * Simulates a require statement
   */
  public require<T = any>(pathname = this.cwd, defaults?: T) {
    //resolve the pathname
    const file = this.resolve(pathname);
    //if no file was resolved
    if (!file) {
      //throw an exception if there are no defaults
      Exception.require (
        typeof defaults !== 'undefined',
        'Could not resolve `%s`',
        pathname
      );
      //return the defaults
      return defaults;
    }
    //require the plugin
    let imported = require(file);
    //if using import
    if (imported.default) {
      imported = imported.default;
    }
    //if package.json, look for the `incept` key
    if (imported.incept) {
      imported = imported.incept;
    } 
    return imported as T;
  }

  /**
   * Resolves the path name to a path that can be required
   */
  public resolve(pathname = this.cwd) {
    //get the absolute path
    return super.resolve(pathname, this.cwd, [
      '/incept.config.js', 
      '/incept.config.json', 
      '/incept.js', 
      '/incept.json', 
      '/package.json',
      '.js', 
      '.json', 
    ]);
  }
}