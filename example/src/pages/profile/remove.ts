import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import client from '@stackpress/incept/client';
import { render } from '../../template';

const error = '@stackpress/incept/components/theme/error.ink';

export default async function ProfileRemove(req: Request, res: Response) {
  //get form body
  const { params } = req.ctxFromRoute('/admin/profile/remove/:id');
  const id = params.get('id');
  if (id) {
    if (req.query.get<string>('confirmed')) {
      const response = await client.profile.action.remove(id);
      if (response.code === 200) {
        res.headers.set('Location', '/admin/profile/search');
        return;
      }
      res.mimetype = 'text/html';
      res.body = await render(error, response);
      return;
    }
    const response = await client.profile.action.detail(id);
    if (response.code === 200) {
      res.mimetype = 'text/html';
      res.body = await render('@/templates/remove.ink', response);
      return;
    }
    res.mimetype = 'text/html';
    res.body = await render(error, response);
    return;
  }
  
  res.mimetype = 'text/html';
  res.body = await render(error, { code: 404, status: 'Not Found' });
  return;
};