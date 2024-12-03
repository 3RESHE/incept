import type { Config } from './config';

import { runtime } from '@stackpress/incept';
import { config } from './config';

export type { Config };
export { config };

export default async function bootstrap() {
  //make a new client
  const client = runtime.make<Config>({ plugins: config.plugins });
  //add the config
  client.config.set(config);
  //load the plugins
  await client.bootstrap();
  //load the plugin routes
  await client.emit('request', client.request(), client.response());
  return client;
};