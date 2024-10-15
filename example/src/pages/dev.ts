import type { IM, SR } from '@stackpress/ingest/dist/http';
import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import fs from 'fs';
import { refresh } from '../template';

export default async function InkDevelop(req: Request<IM>, res: Response<SR>) {
  if (req.url.pathname === '/dev.js') {
    res.code = 200;
    res.mimetype = 'text/javascript';
    const script = fs.readFileSync(
      require.resolve('@stackpress/ink-dev/client.js')
    );
    const id = 'InkAPI.BUILD_ID';
    const start = `;ink_dev.default(${id}, {path: '/__ink_dev__'});`;
    res.body = script + start; 
  } else if (req.url.pathname === '/__ink_dev__') {
    res.code = 200;
    res.status = 'OK';
    refresh.wait(req.resource as IM, res.resource as SR);
  }
};