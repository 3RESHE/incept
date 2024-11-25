import ReadonlyNest from '@stackpress/types/dist/readonly/Nest';
import EventEmitter from '@stackpress/types/dist/EventEmitter';
import PluginLoader from './loader/Plugin';

export default class Project extends EventEmitter<Record<string, any[]>> {
  /**
   * Makes a new project and bootstraps it
   */
  public static bootstrap(config: Record<string, any> = {}) {
    const project = new Project(config);
    return project.bootstrap();
  }

  //config
  public readonly config: ReadonlyNest;
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
  public constructor(config: Record<string, any> = {}) {
    super();
    this.config = new ReadonlyNest(config);
    this.loader = new PluginLoader({
      cwd: config.cwd || process.cwd(),
      plugins: config.plugins || []
    });
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
  public plugin<T = Record<string, any> | undefined>(name: string) {
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