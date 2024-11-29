import type { PluginLoaderOptions } from '@stackpress/ingest/dist/types';
import type { UnknownNest } from '@stackpress/ingest/dist/buildtime/types';

import Factory from '@stackpress/ingest/dist/Factory';

export default async function bootstrap<
  C extends UnknownNest = UnknownNest
>(options: PluginLoaderOptions = {}) {
  //bootstrap a new client
  const client = await Factory.bootstrap<C>({
    filenames: [
      '/incept.client.js', 
      '/incept.client.json'
    ],
    ...options
  });
  //load the plugin routes
  await client.emit('request', client.request(), client.response());
  return client;
};