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
      ? await import('./stores/production') 
      : config.server.mode === 'integration'
      ? await import('./stores/integration')
      : await import('./stores/development');
    server.register('database', await database.default());
  });
  //on listen, register the app routes
  server.on('listen', req => {
    const server = req.context;
    server.get('/', path.join(__dirname, 'routes/home'));
    server.get('/**.*', path.join(__dirname, 'routes/assets'));
    server.on('error', path.join(__dirname, 'events/error'));
    server.on('install', path.join(__dirname, 'events/install'));
    server.on('populate', path.join(__dirname, 'events/populate'));
    server.on('purge', path.join(__dirname, 'events/purge'));
    server.on('push', path.join(__dirname, 'events/push'));
    server.on('query', path.join(__dirname, 'events/query'));
  });

  server.on('response', async (req, res) => {
    if (res.error) {
      await server.emit('error', req, res);
    }
  });
};