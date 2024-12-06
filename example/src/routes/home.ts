import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';

export default async function HomePage(req: ServerRequest, res: Response) {  
  //get the server
  const server = req.context;
  //get authorization
  const authorized = await server.call('authorize', req, res);
  //if not authorized
  if (authorized.code !== 200) {
    return;
  }
  //get the renderer
  const { render } = server.plugin<TemplatePlugin>('template');
  //general settings
  const settings = { session: authorized.results };
  //show form
  res.setHTML(await render('@/templates/home', { settings }));
};