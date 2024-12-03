import type { 
  BuilderOptions, 
  UnknownNest 
} from '@stackpress/ingest/dist/buildtime/types';
import type Builder from '@stackpress/ingest/dist/buildtime/Builder';

import path from 'path';

export async function bootstrap<C extends UnknownNest = UnknownNest>(
  factory: (options?: BuilderOptions) => Builder<C>, 
  options: BuilderOptions = {}
) {
  const build = make<C>(factory, options);
  //bootstrap
  await build.bootstrap();
  //load the plugin routes
  await build.emit('route', build.request(), build.response());
  return build;
};

export function make<C extends UnknownNest = UnknownNest>(
  builder: (options?: BuilderOptions) => Builder<C>, 
  options: BuilderOptions = {}
) {
  return builder({
    tsconfig: path.resolve(
      __dirname, 
      '../tsconfig.json'
    ),
    plugins: [
      '/incept.build.js', 
      '/incept.build.json', 
    ],
    ...options
  })
};