import type { IM, SR } from '@stackpress/ingest/dist/http';
import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';

import { entry } from '@stackpress/incept-ingest/dist/inkdev';
import client from '@stackpress/incept/client';

export default async function Develop(req: Request<IM>, res: Response<SR>) {
  //bootstrap plugins
  const project = await client.project.bootstrap();
  //get the project config
  const config = client.project.config.get('dev') as {
    buildRoute: string,
    socketRoute: string
  };
  //get ink config
  const { compiler, refresh } = project.get<InkPlugin>('ink');
  //get the route
  const route = entry({
    buildRoute: config.buildRoute,
    socketRoute: config.socketRoute,
    compiler, 
    refresh
  });

  await route(req, res);
};