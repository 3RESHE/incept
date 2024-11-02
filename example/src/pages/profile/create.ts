import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type Session from '@stackpress/incept-session/dist/Session';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';
import type { ProfileInput } from '@stackpress/incept/client';

import { Project } from '@stackpress/incept';
import client from '@stackpress/incept/client';

export default async function ProfileCreate(req: Request, res: Response) {  
  //bootstrap plugins
  const project = await Project.bootstrap();
  //get the project config
  const config = project.get<Record<string, any>>('project');
  //get the session
  const session = project.get<Session>('session');
  //get the renderer
  const { render } = project.get<InkPlugin>('template');
  //get authorization
  const authorization = session.authorize(req, res, [ 'profile-create' ]);
  //if not authorized
  if (!authorization) return;
  //general settings
  const settings = { ...config.admin, session: authorization };
  //if form submitted
  if (req.method === 'POST') {
    //get form body
    const input = req.post.get() as ProfileInput;
    const response = await client.profile.action.create(input);
    //if successfully created
    if (response.code === 200) {
      //redirect
      res.code = 302;
      res.status = 'Found';
      res.headers.set(
        'Location', 
        `${config.admin.root}/profile/detail/${response.results?.id}`
      );
      return;
    }
    //it did not create...
    //set the errors
    if (response.errors) {
      res.errors.set(response.errors);
    }
    //recall the create form
    res.code = response.code as number;
    res.status = response.status as string;
    res.mimetype = 'text/html';
    res.body = await render(
      '@/templates/create', 
      { ...response, input, settings }
    );
    return;
  }
  //show form
  res.mimetype = 'text/html';
  res.body = await render('@/templates/create', { settings });
};