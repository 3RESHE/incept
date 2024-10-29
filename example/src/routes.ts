import path from 'path';
import http from '@stackpress/ingest/http';
import route from '@stackpress/incept-ingest/dist/route';
import { route as dev } from '@stackpress/incept-ingest/dist/inkdev';
import * as config from '../incept.config';

const server = http({ minify: false });

if (process.env.SERVER_ENV === 'development') {
  dev({
    buildRoute: config.dev.buildRoute,
    socketRoute: config.dev.socketRoute,
    entryPath: path.resolve(__dirname, 'pages/dev'),
    router: server
  });
  server.all('**', path.resolve(__dirname, 'pages/assets'));
}
route({
  routePath: `${config.admin.root}/profile`,
  entryPath: path.resolve(__dirname, 'pages/profile'),
  router: server
});

export default server;