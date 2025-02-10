//stackpress
import { server } from '@stackpress/ingest/fetch';
//src
import type { Config } from '../../config';
import { config } from '../../config';

export default async function handle(request: Request) {
  //make a new server
  const app = server<Config>({ 
    cache: config.server.mode === 'production' 
  });
  //load the plugins
  await app.bootstrap();
  await app.call('config');
  await app.call('listen');
  //now we can handle the request
  return app.handle(request, undefined);
}