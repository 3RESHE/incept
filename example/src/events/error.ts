//modules
import fs from 'node:fs';
import path from 'node:path';
//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';

export default async function ErrorPage(req: ServerRequest, res: Response) {
  //if there is already a body
  if (res.body) return;
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
  //render the template
  const html = await render('@/templates/500', { 
    ...response, 
    url: req.url.pathname 
  });
  if (req.url.pathname.endsWith('.js')) {
    res.setBody('text/javascript', `document.write(${
      JSON.stringify(html
        .replaceAll('\\\\n', '\n')
        .replaceAll('\\\\\\', '')
      )
    });`, res.code, res.status);
    return;
  } else if (req.url.pathname.endsWith('.css')) {
    res.setBody('text/css', `/* ${response.error} */`, res.code, res.status);
    return;
  }
  res.setHTML(html, res.code, res.status);
};