import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type Session from '@stackpress/incept-user/dist/Session';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import client from '@stackpress/incept/client';

export default async function ProfileCreate(req: Request, res: Response) {  
  //extract project and model from client
  const { project } = client;
  //bootstrap plugins
  await project.bootstrap();
  //get the project config
  //const config = project.config.get<Record<string, any>>();
  //get the session
  const session = project.get<Session>('session');
  //get the renderer
  const { render } = project.get<InkPlugin>('template');
  //get authorization
  const authorization = session.authorize(req, res, [ 'general' ]);
  //if not authorized
  if (!authorization) return;
  //general settings
  const settings = { session: authorization };
  //show form
  res.mimetype = 'text/html';
  res.body = await render('@/templates/home', { settings });
};