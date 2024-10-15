import type { ProfileInput } from '@stackpress/incept/client';

import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import client from '@stackpress/incept/client';
import { render } from '../../template';

const error = '@stackpress/incept/components/theme/error.ink';

export default async function ProfileUpdate(req: Request, res: Response) {
  const { params } = req.ctxFromRoute('/admin/profile/update/:id');
  const id = params.get('id');
  if (id) {
    if (req.method === 'POST') {
      //get form body
      const input = req.post.get() as Partial<ProfileInput>;
      const response = await client.profile.action.update(id, input);
      if (response.code !== 200) {
        res.code = response.code as number;
        res.status = response.status as string;
        res.mimetype = 'text/html';
        if (response.errors) {
          res.errors.set(response.errors);
        }
        res.body = await render('@/templates/update.ink', response);
      } else {
        res.headers.set('Location', `/admin/profile/detail/${id}`);
      }
      return;
    }
    const response = await client.profile.action.detail(id);
    if (response.code === 200) {
      res.mimetype = 'text/html';
      res.body = await render('@/templates/update.ink', response);
      return;
    }
    res.mimetype = 'text/html';
    res.body = await render(error, response);
    return;
  }
  res.mimetype = 'text/html';
  res.body = await render(error, { code: 404, status: 'Not Found' });
};