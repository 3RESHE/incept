import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import compiler from '../template';

export default async function InkBuildAsset(req: Request, res: Response) {
  //get filename ie. abc123.js
  const { params } = req.ctxFromRoute('/build/client/:build');
  const filename = params.get('build') as string;
  //get asset
  const { type, content } = await compiler.asset(filename);
  //send response
  res.mimetype = type;
  res.body = content;
};