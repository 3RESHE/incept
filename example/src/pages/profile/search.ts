import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type Session from '@stackpress/incept-session/dist/Session';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import { Project } from '@stackpress/incept';
import client from '@stackpress/incept/client';

const error = '@stackpress/incept-admin/theme/error';

export default async function ProfileSearch(req: Request, res: Response) {
  //bootstrap plugins
  const project = await Project.bootstrap();
  //get the project config
  const config = project.get<Record<string, any>>('project');
  //get the session
  const session = project.get<Session>('session');
  //get the renderer
  const { render } = project.get<InkPlugin>('ink');
  //get authorization
  const authorization = session.authorize(req, res, [ 'profile-search' ]);
  //if not authorized
  if (!authorization) return;
  //general settings
  const settings = { ...config.admin, session: authorization };
  //extract filters from url query
  let { q, filter, span, sort, skip, take } = req.query.get() as Record<string, unknown> & {
    q?: string,
    filter?: Record<string, string|number|boolean>,
    span?: Record<string, (string|number|null|undefined)[]>,
    sort?: Record<string, any>,
    skip?: number,
    take?: number
  };

  if (skip && !isNaN(Number(skip))) {
    skip = Number(skip);
  }

  if (take && !isNaN(Number(take))) {
    take = Number(take);
  }
  //search using the filters
  const response = await client.profile.action.search(
    { q, filter, span, sort, skip, take }
  );
  //if successfully searched
  if (response.code === 200) {
    //render the search page
    const ids = client.profile.config.ids.map(
      column => `{{data.${column.name}}}`
    ).join('/');
    res.mimetype = 'text/html';
    res.body = await render('@/templates/search', { 
      q,
      filter, 
      span, 
      sort, 
      skip, 
      take, 
      settings,
      ...response,
      results: (response.results || []).map(data => ({
        ...data,
        _view: client.profile.config.render(
          `${config.admin.root}/profile/detail/${ids}`, 
          data
        )
      }))
    });
    return;
  }
  //it did not search, render error page
  res.mimetype = 'text/html';
  res.body = await render(error, { ...response, settings});
};