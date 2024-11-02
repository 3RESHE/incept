import type { ProfileInput } from '@stackpress/incept/client';

import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type Session from '@stackpress/incept-session/dist/Session';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import { Project } from '@stackpress/incept';
import client from '@stackpress/incept/client';

const error = '@stackpress/incept-admin/theme/error';

export default async function ProfileUpdate(req: Request, res: Response) {
  //bootstrap plugins
  const project = await Project.bootstrap();
  //get the project config
  const config = project.get<Record<string, any>>('project');
  //get the session
  const session = project.get<Session>('session');
  //get the renderer
  const { render } = project.get<InkPlugin>('ink');
  //get authorization
  const authorization = session.authorize(req, res, [ 'profile-update' ]);
  //if not authorized
  if (!authorization) return;
  //general settings
  const settings = { ...config.admin, session: authorization };
  //get url params
  const { params } = req.ctxFromRoute(
    `${config.admin.root}/profile/update/:id`
  );
  //get id from url params
  const id = params.get('id');
  //if there is an id
  if (id) {
    //if form submitted
    if (req.method === 'POST') {
      //get form body
      const input = req.post.get() as Partial<ProfileInput>;
      //update the row using the id and the submitted input
      const response = await client.profile.action.update(id, input);
      //if successfully updated
      if (response.code === 200) {
        //redirect
        res.code = 302;
        res.status = 'Found';
        res.headers.set(
          'Location', 
          `${config.admin.root}/profile/detail/${id}`
        );
      }
      //it did not update...
      //set the errors
      if (response.errors) {
        res.errors.set(response.errors);
      }
      //recall the update form
      res.code = response.code as number;
      res.status = response.status as string;
      res.mimetype = 'text/html';
      res.body = await render(
        '@/templates/update', 
        { ...response, settings, input }
      );
      return;
    }
    //not submitted, fetch the data using the id
    const response = await client.profile.action.detail(id);
    //if successfully fetched
    if (response.code === 200) {
      //render the update page
      const input: Record<string, any> = { ...(response.results || {}) };
      const results: Record<string, any> = response.results || {};
      results.suggestion = client.profile.config.suggest(results);
      res.mimetype = 'text/html';
      res.body = await render(
        '@/templates/update', 
        { ...response, settings, results, input }
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