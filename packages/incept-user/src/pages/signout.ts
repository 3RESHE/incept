//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';

export default async function SignOutPage(req: ServerRequest, res: Response) {
  //set session
  res.session.delete('session');
  //redirect
  res.redirect(req.data('redirect') || '/');
};