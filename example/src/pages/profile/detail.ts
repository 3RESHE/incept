import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import client from '@stackpress/incept/client';
import compiler from '../../template';

const error = '@stackpress/incept/components/theme/error.ink';

export default async function ProfileDetail(req: Request, res: Response) {
  //get form body
  const { params } = req.ctxFromRoute('/admin/profile/detail/:id');
  const id = params.get('id');
  if (id) {
    const response = await client.profile.action.detail(id);
    if (response.code === 200) {
      res.mimetype = 'text/html';
      res.body = await compiler.render('@/templates/detail.ink', response);
      return;
    }
    res.mimetype = 'text/html';
    res.body = await compiler.render(error, response);
    return;
  }
  
  res.mimetype = 'text/html';
  res.body = await compiler.render(error, { code: 404, status: 'Not Found' });
};