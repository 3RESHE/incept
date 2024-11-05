import path from 'path';
import vercel from '@stackpress/ingest-vercel';
import routes from '@stackpress/incept/routes';
import client from '@stackpress/incept/client';
import { route } from '@stackpress/incept-ink/dist/develop';

const server = vercel({ minify: false });
const config = client.project.config.get<Record<string, any>>() || {};

if (process.env.SERVER_ENV === 'development') {
  route({
    buildRoute: config.template.config.dev.buildRoute || '/build/client',
    socketRoute: config.template.config.dev.socketRoute || '/__ink_dev__',
    entryPath: path.resolve(__dirname, 'routes/develop'),
    router: server
  });
  server.all('**', path.resolve(__dirname, 'routes/assets'));
}

routes(config.admin.root, server);

export default server;