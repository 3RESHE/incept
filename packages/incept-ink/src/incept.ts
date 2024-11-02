import type Project from '@stackpress/incept/dist/Project';

import path from 'path';
import ink, { cache } from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';
import { dev } from '@stackpress/ink-dev';

type ProjectConfig = { 
  src: string,
  template: { brand?: string },
} | undefined;

const environment = process.env.SERVER_ENV as string || 'development';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(project: Project) {
  //get the project config
  const config = project.get<ProjectConfig>('project');
  if (!config) {
    throw new Error('Project config not found');
  }

  const { refresh } = dev({ cwd: config.src });
  const buildPath = path.join(project.cwd, 'build');

  //create ink compiler
  const compiler = ink({ 
    brand: config.template.brand || '', 
    cwd: config.src, 
    minify: environment !== 'development' 
  });
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
};