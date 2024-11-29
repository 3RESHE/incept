import type Context from '@stackpress/ingest/dist/Context';
import type Response from '@stackpress/ingest/dist/Response';

import fs from 'fs';
import path from 'path';

export default async function Assets(req: Context, res: Response) {
  if (res.code || res.status || res.body) return;
  const resource = req.url.pathname.substring(1).replace(/\/\//, '/'); 
  const file = path.resolve(__dirname, '../../public', resource); 
  if (fs.existsSync(file)) {
    res.setBody('image/png', fs.createReadStream(file));
  }
};