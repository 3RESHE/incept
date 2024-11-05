import type { IM, SR } from '@stackpress/ingest/dist/http';
import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import { entry } from '@stackpress/incept-ink/dist/develop';
import client from '@stackpress/incept/client';

export default async function Develop(req: Request<IM>, res: Response<SR>) {
  //bootstrap plugins
  const project = await client.project.bootstrap();
  //get the project config
  const { buildRoute, socketRoute } = client.project.config.get<{
    buildRoute: string,
    socketRoute: string
  }>('template', 'config', 'dev');
  //get ink config
  const { compiler, refresh } = project.get<InkPlugin>('ink');
  //get the route
  const route = entry({
    buildRoute: buildRoute,
    socketRoute: socketRoute,
    compiler, 
    refresh
  });

  await route(req, res);
};