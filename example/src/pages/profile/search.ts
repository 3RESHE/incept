import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import client from '@stackpress/incept/client';
import { config, render } from '../../boot';

const error = '@stackpress/incept-admin/theme/error.ink';

export default async function ProfileSearch(req: Request, res: Response) {
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

  const response = await client.profile.action.search(
    { q, filter, span, sort, skip, take }
  );

  const ids = client.profile.config.ids.map(
    column => `{{data.${column.name}}}`
  ).join('/');
  
  if (response.code === 200) {
    res.mimetype = 'text/html';
    res.body = await render('@/templates/search.ink', { 
      q,
      filter, 
      span, 
      sort, 
      skip, 
      take, 
      settings: config.admin,
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

  res.mimetype = 'text/html';
  res.body = await render(error, response);
};