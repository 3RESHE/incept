//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
import type Engine from '@stackpress/inquire/dist/Engine';

export default async function query(req: ServerRequest, res: Response) {
  const server = req.context;
  const engine = server.plugin<Engine>('database');
  const query = process.argv.slice(2).pop();
  if (query) {
    console.log(await engine.query(query.replace(/\\/g, "'")));
  }
};