//modules
import path from 'node:path';
//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//incept
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
//local
import { config } from '../config';
import dmz from './pages/public';

export default function plugin(server: Server) {
  server.config.set(config);
  const pages = path.join(__dirname, 'pages');
  //on config (low priority), add app templates
  server.on('config', req => {
    const server = req.context;
    const { templates } = server.plugin<TemplatePlugin>('template');
    if (templates) {
      templates.add('@/plugins/app/templates/home.ink');
      templates.add('@/plugins/app/templates/500.ink');
      templates.add('@/plugins/app/templates/404.ink');
    }
  }, -10);
  server.on('listen', async req => {
    const server = req.context;
    server.on('error', path.join(pages, 'error'));
    server.on('request', async (req, res) => {  
      if (!res.body && (!res.code || res.code === 404)) {
        await dmz(req, res);
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