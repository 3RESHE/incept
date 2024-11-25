import type Request from '@stackpress/ingest/dist/Request';
import type Response from '@stackpress/ingest/dist/Response';

export default async function SignIn(req: Request, res: Response) {
  //set session
  res.session.delete('session');
  //redirect
  res.redirect(req.query.get('redirect') || '/');
};