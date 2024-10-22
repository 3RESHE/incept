import type { IM, SR } from '@stackpress/ingest/dist/http';
import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import { compiler, refresh } from '../boot';

export default async function InkDevelop(req: Request<IM>, res: Response<SR>) {
  if (req.url.pathname.startsWith('/build/client/')) {
    //get filename ie. abc123.js
    const { params } = req.ctxFromRoute('/build/client/:build');
    const filename = params.get('build') as string;
    //get asset
    const { type, content } = await compiler.asset(filename);
    //send response
    res.mimetype = type;
    res.body = content;
  } else if (req.url.pathname === '/dev.js') {
    res.code = 200;
    res.mimetype = 'text/javascript';
    const script = compiler.fs.readFileSync(
      require.resolve('@stackpress/ink-dev/client.js'),
      'utf-8'
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