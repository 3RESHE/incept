import type { Factory } from '@stackpress/incept';

import path from 'path';
import ink, { cache } from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';
import RefreshServer from '@stackpress/ink-dev/dist/RefreshServer';

type ProjectConfig = { 
  server: { mode: string },
  template: {
    engine: string,
    config: {
      brand: string,
      minify: boolean,
      buildPath: string,
      cwd: string,
      dev: { 
        buildRoute: string,
        socketRoute: string
      }
    }
  },
};

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(client: Factory<ProjectConfig>) {
  client.on('request', () => {
    //get the project config
    const config = client.config.get();
    const environment = config.server.mode;
    const { cwd, minify, buildPath, brand = '' } = config.template.config;

    const refresh = new RefreshServer({ cwd });

    //create ink compiler
    const compiler = ink({ brand, cwd, minify });
    //use ink css
    compiler.use(css());
    //use build cache
    compiler.use(cache({ environment, buildPath }));

    const render = function(
      filePath: string, 
      props: Record<string, unknown> = {}
    ) {
      if (!path.extname(filePath)) {
        filePath = `${filePath}.ink`;
      }
      if (environment === 'development') {
        refresh.sync(compiler.fromSource(filePath));
      }
      return compiler.render(filePath, props);
    };

    //add ink as a project plugin
    client.register('ink', { compiler, refresh, render });
    //add renderer to the project
    client.register('template', { render });
  });
};