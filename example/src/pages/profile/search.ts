import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import client from '@stackpress/incept/client';
import { render } from '../../template';

const error = '@stackpress/incept/components/theme/error.ink';

export default async function ProfileSearch(req: Request, res: Response) {
  let { filter, span, sort, skip, take } = req.query.get() as Record<string, unknown> & {
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
    { filter, span, sort, skip, take }
  );

  if (response.code === 200) {
    res.mimetype = 'text/html';
    res.body = await render('@/templates/search.ink', { 
      filter, 
      span, 
      sort, 
      skip, 
      take, 
      ...response 
    });
    return;
  }

  res.mimetype = 'text/html';
  res.body = await render(error, response);
};