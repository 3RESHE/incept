//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//util
import connect from './connect';

export default function plugin(server: Server) {
  //on config, register the store
  server.on('config', async req => {
    const server = req.context;
    server.register('database', await connect());
  });
  //on listen, add dev routes
  server.on('listen', req => {
    const router = req.context.withImports;
    router.on('install', () => import('./events/install'));
    router.on('populate', () => import('./events/populate'));
    router.on('purge', () => import('./events/purge'));
    router.on('push', () => import('./events/push'));
    router.on('query', () => import('./events/query'));
  });
};