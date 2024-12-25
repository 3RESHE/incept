//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';

export default async function Authorize(req: ServerRequest, res: Response) {
  //get the server
  const server = req.context;
  //get authorization
  const authorized = await server.call('authorize', req);
  //if not authorized
  if (authorized.code !== 200) {
    return res.fromStatusResponse(authorized);
  }
}