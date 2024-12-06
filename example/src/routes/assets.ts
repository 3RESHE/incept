import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';

import fs from 'fs';
import path from 'path';

const mime: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

export default async function Assets(req: ServerRequest, res: Response) {
  if (res.code || res.status || res.body) return;
  const resource = req.url.pathname.substring(1).replace(/\/\//, '/'); 
  const file = path.resolve(__dirname, '../../public', resource); 
  if (fs.existsSync(file)) {
    const ext = path.extname(file);
    const type = mime[ext] || 'application/octet-stream';
    res.setBody(type, fs.createReadStream(file));
  }
};