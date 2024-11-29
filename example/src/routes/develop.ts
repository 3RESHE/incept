import type Context from '@stackpress/ingest/dist/Context';
import type Response from '@stackpress/ingest/dist/Response';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import { entry } from '@stackpress/incept-ink/dist/develop';
import client from '@stackpress/incept/client';

export default async function Develop(req: Context, res: Response) {
  //bootstrap plugins
  const project = await client.project.bootstrap();
  //get the project config
  const { buildRoute, socketRoute } = client.project.config<{
    buildRoute: string,
    socketRoute: string
  }>('template', 'config', 'dev');
  //get ink config
  const { compiler, refresh } = project.plugin<InkPlugin>('ink');
  //get the route
  const route = entry({
    buildRoute: buildRoute,
    socketRoute: socketRoute,
    compiler, 
    refresh
  });

  await route(req.request, res);
};