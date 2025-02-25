//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import { scripts } from '@stackpress/incept-inquire';

export default async function push(req: ServerRequest, res: Response) {
  const server = req.context;
  const engine = server.plugin<Engine>('database');
  await scripts.push(server, engine);
  res.setStatus(200);
};