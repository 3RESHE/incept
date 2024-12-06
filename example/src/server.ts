//stackpress
import { server } from '@stackpress/ingest/http';
//local
import type { Config } from './config';
import { config } from './config';

export default async function make() {
  const app = server<Config>({ 
    cache: config.server.mode === 'production' 
  });
  //load the plugins
  await app.bootstrap();
  await app.call('config');
  await app.call('listen');
  return app;
}