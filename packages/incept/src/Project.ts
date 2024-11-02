import EventEmitter from '@stackpress/types/dist/EventEmitter';
import PluginLoader from './Plugin';

export default class Project extends EventEmitter<Record<string, any[]>> {
  /**
   * Makes a new project and bootstraps it
   */
  public static bootstrap(cwd?: string, plugins: string[] = []) {
    const project = new Project(cwd, plugins);
    return project.bootstrap();
  }

  //plugin loader
  public readonly loader: PluginLoader;
  //list of plugins
  public readonly plugins = new Map<string, Record<string, any>>();

  /**
   * The current working directory
   */
  public get cwd() {
    return this.loader.cwd;
  }

  /**
   * Sets up the plugin loader
   */
  public constructor(cwd?: string, plugins: string[] = []) {
    super();
    this.loader = new PluginLoader(
      cwd || process.cwd(), 
      undefined, 
      plugins
    );
  }

  /**
   * Loads the plugins and allows them to 
   * self bootstrap and configure themselves
   */
  public async bootstrap() {
    await this.loader.bootstrap(async (name, plugin) => {
      if (typeof plugin === 'function') {
        const config = await plugin(this);
        if (config && typeof config === 'object') {
          this.register(name, config);
        }
      } else if (plugin && typeof plugin === 'object') {
        this.register(name, plugin);
      }
    });
    return this;
  }

  /**
   * Gets the plugin by name
   */
  public get<T = Record<string, any> | undefined>(name: string) {
    return this.plugins.get(name) as T;
  }

  /**
   * Registers a plugin
   */
  public register(name: string, config: Record<string, any>) {
    this.plugins.set(name, config);
    return this;
  }
}