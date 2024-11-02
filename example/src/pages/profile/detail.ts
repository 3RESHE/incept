import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type Session from '@stackpress/incept-session/dist/Session';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import { Project } from '@stackpress/incept';
import client from '@stackpress/incept/client';

const error = '@stackpress/incept-admin/theme/error';

export default async function ProfileDetail(req: Request, res: Response) {
  //bootstrap plugins
  const project = await Project.bootstrap();
  //get the project config
  const config = project.get<Record<string, any>>('project');
  //get the session
  const session = project.get<Session>('session');
  //get the renderer
  const { render } = project.get<InkPlugin>('ink');
  //get authorization
  const authorization = session.authorize(req, res, [ 'profile-detail' ]);
  //if not authorized
  if (!authorization) return;
  //general settings
  const settings = { ...config.admin, session: authorization };
  //get url params
  const { params } = req.ctxFromRoute(
    `${config.admin.root}/profile/detail/:id`
  );
  //get id from url params
  const id = params.get('id');
  //if there is an id
  if (id) {
    //fetch the data using the id
    const response = await client.profile.action.detail(id);
    //if successfully fetched
    if (response.code === 200) {
      //render the detail page
      const results: Record<string, any> = response.results || {};
      results.suggestion = client.profile.config.suggest(results);
      res.mimetype = 'text/html';
      res.body = await render(
        '@/templates/detail', 
        { ...response, settings, results }
      );
      return;
    }
    //it did not fetch, render error page
    res.mimetype = 'text/html';
    res.body = await render(error, { ...response, settings });
    return;
  }
  //no id was found, render error page (404)
  res.mimetype = 'text/html';
  res.body = await render(error, { 
    code: 404, 
    status: 'Not Found',
    settings
  });
};