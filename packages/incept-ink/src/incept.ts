//types
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Project from '@stackpress/incept/dist/Project';

import path from 'path';
import ink, { cache } from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';
import RefreshServer from '@stackpress/ink-dev/dist/RefreshServer';

type ProjectConfig = { 
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

const environment = process.env.SERVER_ENV as string || 'development';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(project: Project) {
  //get the project config
  const config = project.config.get<ProjectConfig>();
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
  project.register('ink', { compiler, refresh, render });
  //add renderer to the project
  project.register('template', { render });
  //generate some code in the client folder
  project.on('idea', (transformer: Transformer<CLIProps>) => {
    //if no plugin object exists, create one
    if (!transformer.schema.plugin) {
      transformer.schema.plugin = {};
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    transformer.schema.plugin['@stackpress/incept-ink/dist/transform'] = {};
  });
};

