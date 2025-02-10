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
      ? await import('./modules/store') 
      : config.server.mode === 'integration'
      ? await import('./modules/store/integration')
      : await import('./modules/store/development');
    server.register('database', await database.default());
  });
  //on listen, register the app routes
  server.on('listen', req => {
    const server = req.context;
    const modules = path.join(__dirname, 'modules');
    //utils
    server.on('error', path.join(modules, 'app/pages/error'));
    server.on('install', path.join(modules, 'util/install'));
    server.on('migrate', path.join(modules, 'util/migrate'));
    server.on('populate', path.join(modules, 'util/populate'));
    server.on('purge', path.join(modules, 'util/purge'));
    server.on('push', path.join(modules, 'util/push'));
    server.on('query', path.join(modules, 'util/query'));
    //routes
    server.get('/', path.join(modules, 'app/pages/home'));
    server.get('/**.*', path.join(modules, 'app/pages/assets'));
  });

  server.on('response', async (req, res) => {
    if (res.error) {
      await server.emit('error', req, res);
    }
  });
};