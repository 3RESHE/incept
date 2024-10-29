import type { ProfileInput } from '@stackpress/incept/client';

import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import client from '@stackpress/incept/client';
import { config, render, session } from '../../boot';

export default async function ProfileCreate(req: Request, res: Response) {
  //if not authorized
  if (!session.authorize(req, res, [ 'profile-create' ])) {
    return;
  }
  //if form submitted
  if (req.method === 'POST') {
    //get form body
    const input = req.post.get() as ProfileInput;
    const response = await client.profile.action.create(input);
    if (response.code !== 200) {
      res.code = response.code as number;
      res.status = response.status as string;
      if (response.errors) {
        res.errors.set(response.errors);
      }
      res.mimetype = 'text/html';
      res.body = await render(
        '@/templates/create.ink', 
        { ...response, settings: config.admin, input }
      );
    } else {
      res.code = 302;
      res.status = 'Found';
      res.headers.set('Location', `/admin/profile/detail/${response.results?.id}`);
    }
    return;
  }
  //show form
  res.mimetype = 'text/html';
  res.body = await render('@/templates/create.ink', { settings: config.admin });
};