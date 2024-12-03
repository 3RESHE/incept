import type { PluginLoaderOptions } from '@stackpress/ingest/dist/types';
import type { UnknownNest } from '@stackpress/ingest/dist/buildtime/types';

import Factory from '@stackpress/ingest/dist/Factory';

export async function bootstrap<C extends UnknownNest = UnknownNest>(
  options: PluginLoaderOptions = {}
) {
  //bootstrap a new client
  const client = make<C>(options);
  //bootstrap
  await client.bootstrap();
  //load the plugin routes
  await client.emit('request', client.request(), client.response());
  return client;
};

export function make<C extends UnknownNest = UnknownNest>(
  options: PluginLoaderOptions = {}
) {
  return new Factory<C>({
    plugins: [
      '/incept.client.js', 
      '/incept.client.json'
    ],
    ...options
  })
};