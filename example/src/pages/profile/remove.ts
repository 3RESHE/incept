import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type Session from '@stackpress/incept-session/dist/Session';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import { Project } from '@stackpress/incept';
import client from '@stackpress/incept/client';

const error = '@stackpress/incept-admin/theme/error';

export default async function ProfileRemove(req: Request, res: Response) {
  //bootstrap plugins
  const project = await Project.bootstrap();
  //get the project config
  const config = project.get<Record<string, any>>('project');
  //get the session
  const session = project.get<Session>('session');
  //get the renderer
  const { render } = project.get<InkPlugin>('ink');
  //get authorization
  const authorization = session.authorize(req, res, [ 'profile-remove' ]);
  //if not authorized
  if (!authorization) return;
  //general settings
  const settings = { ...config.admin, session: authorization };
  //get url params
  const { params } = req.ctxFromRoute(
    `${config.admin.root}/profile/remove/:id`
  );
  //get id from url params
  const id = params.get('id');
  //if there is an id
  if (id) {
    //if confirmed
    if (req.query.get<string>('confirmed')) {
      //remove the row with the id
      const response = await client.profile.action.remove(id);
      //if successfully removed
      if (response.code === 200) {
        //redirect
        res.code = 302;
        res.status = 'Found';
        res.headers.set(
          'Location', 
          `${config.admin.root}/profile/search`
        );
        return;
      }
      //not removed, render error page
      res.mimetype = 'text/html';
      res.body = await render(error, { ...response, settings });
      return;
    }
    //not confirmed, fetch the data using the id
    const response = await client.profile.action.detail(id);
    //if successfully fetched
    if (response.code === 200) {
      //render the remove page
      const results: Record<string, any> = response.results || {};
      results.suggestion = client.profile.config.suggest(results);
      res.mimetype = 'text/html';
      res.body = await render(
        '@/templates/remove', 
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