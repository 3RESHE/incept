//modules
import path from 'path';
//stackpress
import type { HTTPServer } from '@stackpress/ingest';
//local
import type { Config } from './config';
import { config } from './config';

export default function plugin(server: HTTPServer<Config>) {
  server.config.set(config);
  //on listen, register the app routes
  server.on('listen', req => {
    const server = req.context;
    server.get('/', path.join(__dirname, 'routes/home'));
    server.get('/**', path.join(__dirname, 'routes/assets'));
  });
};