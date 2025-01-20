//modules
import path from 'path';
//stackpress
import type { HTTPServer } from '@stackpress/ingest';
//local
import type { Config } from './config';
import { config } from './config';

export default function plugin(server: HTTPServer<Config>) {
  server.config.set(config);
  //on config, register the store
  server.on('config', async req => {
    const server = req.context;
    const database = config.server.mode === 'production' 
      ? await import('./databases/production') 
      : config.server.mode === 'integration'
      ? await import('./databases/integration')
      : await import('./databases/development');
    server.register('database', await database.default());
  });
  //on listen, register the app routes
  server.on('listen', req => {
    const server = req.context;
    server.get('/', path.join(__dirname, 'routes/home'));
    server.get('/**.*', path.join(__dirname, 'routes/assets'));
    server.on('error', path.join(__dirname, 'events/error'));
  });

  server.on('response', async (req, res) => {
    if (res.error) {
      await server.emit('error', req, res);
    }
  });
};