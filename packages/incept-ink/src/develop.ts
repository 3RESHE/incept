import type { IM, SR } from '@stackpress/ingest/dist/types';
import type Request from '@stackpress/ingest/dist/Request';
import type Response from '@stackpress/ingest/dist/Response';
import type { InkDevEntryConfig, InkDevRouteConfig } from './types';

export function route(config: InkDevRouteConfig) {
  const { 
    buildRoute = '/build/client', 
    socketRoute = '/__ink_dev__', 
    entryPath,
    router
  } = config;

  router.all('/dev.js', entryPath);
  router.all(socketRoute, entryPath);
  router.all(`${buildRoute}/:build`, entryPath);
}

export function entry(config: InkDevEntryConfig) {
  const { 
    buildRoute = '/build/client', 
    socketRoute = '/__ink_dev__', 
    compiler, 
    refresh
  } = config;

  return async function InkDevelop(req: Request<IM>, res: Response<SR>) {
    if (req.url.pathname.startsWith(`${buildRoute}/`)) {
      //get filename ie. abc123.js
      const { params } = req.fromRoute(`${buildRoute}/:build`);
      const filename = params.get('build') as string;
      //get asset
      const { type, content } = await compiler.asset(filename);
      //send response
      return res.setBody(type, content);
    } else if (req.url.pathname === '/dev.js') {
      const script = compiler.fs.readFileSync(
        require.resolve('@stackpress/ink-dev/client.js'),
        'utf-8'
      );
      const id = 'InkAPI.BUILD_ID';
      const start = `;ink_dev.default(${id}, {path: '${socketRoute}'});`;
      return res.setBody('text/javascript', script + start);
    } else if (req.url.pathname === socketRoute) {
      res.stop();
      const response = res.resource as SR;
      response.statusCode = 200;
      response.statusMessage = 'OK';
      refresh.wait(req.resource as IM, response);
    }
  }
}