//modules
import path from 'node:path';
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
    const server = req.context;
    const events = path.join(__dirname, 'events');
    server.on('install', path.join(events, 'install'));
    server.on('populate', path.join(events, 'populate'));
    server.on('purge', path.join(events, 'purge'));
    server.on('push', path.join(events, 'push'));
    server.on('query', path.join(events, 'query'));
  });
};