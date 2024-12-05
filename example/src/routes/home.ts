import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
import type { SessionPlugin } from '@stackpress/incept-user/dist/types';
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';

export default async function ProfileCreate(req: ServerRequest, res: Response) {  
  const server = req.context;
  //get the session
  const session = server.plugin<SessionPlugin>('session');
  //get the renderer
  const { render } = server.plugin<TemplatePlugin>('template');
  //get authorization
  const authorization = session.authorize(req, res, [ 'general' ]);
  //if not authorized
  if (!authorization) return;
  //general settings
  const settings = { session: authorization };
  //show form
  res.setHTML(await render('@/templates/home', { settings }));
};