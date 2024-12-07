//modules
import fs from 'node:fs';
import path from 'node:path';
//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';

export default async function Errorage(req: ServerRequest, res: Response) {  
  //get the server
  const server = req.context;
  //get the renderer
  const { render } = server.plugin<TemplatePlugin>('template');
  //general settings
  const response = res.toStatusResponse();
  response.stack = res.stack || [];
  response.stack = response.stack.slice(1).map(trace => {
    const { file } = trace;
    if (!file.startsWith(path.sep) || !fs.existsSync(file)) {
      return trace;
    }

    return { ...trace, source: fs.readFileSync(file, 'utf8') };
  });
  //show form
  res.setHTML(await render('@/templates/500', { 
    ...response, 
    url: req.url.pathname 
  }));
};