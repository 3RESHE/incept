import type Context from '@stackpress/ingest/dist/Context';
import type Response from '@stackpress/ingest/dist/Response';
import type Session from '@stackpress/incept-user/dist/Session';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import client from '@stackpress/incept/client';

export default async function ProfileCreate(req: Context, res: Response) {  
  //bootstrap plugins
  const project = await client.project.bootstrap();
  //get the project config
  //const config = project.config.get<Record<string, any>>();
  //get the session
  const session = project.plugin<Session>('session');
  //get the renderer
  const { render } = project.plugin<InkPlugin>('template');
  //get authorization
  const authorization = session.authorize(req.request, res, [ 'general' ]);
  //if not authorized
  if (!authorization) return;
  //general settings
  const settings = { session: authorization };
  //show form
  res.setHTML(await render('@/templates/home', { settings }));
};