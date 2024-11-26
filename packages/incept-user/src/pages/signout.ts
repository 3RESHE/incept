import type Context from '@stackpress/ingest/dist/Context';
import type Response from '@stackpress/ingest/dist/Response';

export default async function SignIn(req: Context, res: Response) {
  //set session
  res.session.delete('session');
  //redirect
  res.redirect(req.data('redirect') || '/');
};