import type { ProfileInput } from '@stackpress/incept/client';

import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import client from '@stackpress/incept/client';
import compiler from '../../template';

export default async function ProfileCreate(req: Request, res: Response) {
  if (req.method === 'POST') {
    //get form body
    const input = req.post.get() as ProfileInput;
    const response = await client.profile.action.create(input);
    if (response.code !== 200) {
      res.code = response.code as number;
      res.status = response.status as string;
      res.mimetype = 'text/html';
      if (response.errors) {
        res.errors.set(response.errors);
      }
      res.body = await compiler.render('@/templates/create.ink', response);
    } else {
      res.headers.set('Location', `/admin/profile/detail/${response.results?.id}`);
    }
    return;
  }
  res.mimetype = 'text/html';
  res.body = await compiler.render('@/templates/create.ink', {});
};