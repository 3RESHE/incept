//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import { scripts } from '@stackpress/incept-inquire';

export default async function install(req: ServerRequest, res: Response) {
  const server = req.context;
  const engine = server.plugin<Engine>('database');
  await scripts.install(server, engine);
  res.setStatus(200);
};