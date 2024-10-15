import type { IM, SR } from '@stackpress/ingest/dist/http';
import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import fs from 'fs';
import path from 'path';

export default async function Assets(req: Request<IM>, res: Response<SR>) {
  if (res.code || res.status || res.body) return;
  const resource = req.url.pathname.substring(1).replace(/\/\//, '/'); 
  const file = path.resolve(__dirname, '../../public',resource); 
  if (fs.existsSync(file)) {
    res.code = 200;
    res.status = 'OK';
    fs.createReadStream(file).pipe(res.resource as SR);
    return;
  }
};