import type { Config } from './config';

import path from 'path';
import vercel from '@stackpress/ingest-vercel';
import { buildtime } from '@stackpress/incept';
import { config } from './config';

export type { Config };
export { config };

export default async function bootstrap() {
  //make a new builder
  const builder = buildtime.make<Config>(vercel, {
    cookie: config.cookie,
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    plugins: config.plugins
  });
  //add the config
  builder.config.set(config);
  //load the plugins
  await builder.bootstrap();
  //add routes from plugins
  await builder.emit('route', builder.request(), builder.response());
  //add front end routes
  builder.all('/', path.resolve(config.server.routes, 'home'));
  return builder;
};