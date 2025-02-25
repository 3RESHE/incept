//modules
import path from 'node:path';
//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//local
import { config } from '../../config';
import file from './pages/file';

export default function plugin(server: Server) {
  server.config.set(config);
  const pages = path.join(__dirname, 'pages');
  server.on('listen', async req => {
    const server = req.context;
    server.on('error', path.join(pages, 'error'));
    server.on('request', async (req, res) => {  
      if (!res.body && (!res.code || res.code === 404)) {
        await file(req, res);
      }
    });
    server.on('response', async (req, res) => {  
      const server = req.context;
      if (res.error) {
        await server.emit('error', req, res);
      }
    });
  });
  server.on('route', async req => {
    const server = req.context;
    server.get('/', path.join(pages, 'home'));
  });
};