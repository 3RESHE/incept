import path from 'path';
import vercel from '@stackpress/ingest-vercel';
import clientRoutes from '@stackpress/incept/routes';
import client from '@stackpress/incept/client';
import { route as devRoutes } from '@stackpress/incept-ink/dist/develop';
import authRoutes from '@stackpress/incept-user/dist/routes';

const server = vercel({ minify: false });
const config = client.project.config.get<Record<string, any>>() || {};
//plugin routes
authRoutes(server);
clientRoutes(config.admin.root, server);
//front end routes
server.all('/', path.resolve(__dirname, 'routes/home'));
//dev routes
if (process.env.SERVER_ENV === 'development') {
  devRoutes({
    buildRoute: config.template.config.dev.buildRoute || '/build/client',
    socketRoute: config.template.config.dev.socketRoute || '/__ink_dev__',
    entryPath: path.resolve(__dirname, 'routes/develop'),
    router: server
  });
  server.all('**', path.resolve(__dirname, 'routes/assets'));
}

export default server;