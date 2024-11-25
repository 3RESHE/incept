import type Request from '@stackpress/ingest/dist/Request';
import type Response from '@stackpress/ingest/dist/Response';
import type { InkPlugin } from '@stackpress/incept-ink/dist/types';
import type Session from '../Session';

import client from '@stackpress/incept/client';
import signup, { SignupInput } from '../actions/signup';

export default async function SignupPage(req: Request, res: Response) {
  //extract project and model from client
  const { project } = client;
  const redirect = req.query.get('redirect') || '/auth/signin';
  //bootstrap plugins
  await project.bootstrap();
  //get the project config
  const config = project.config.get<Record<string, string>>('auth');
  //get the session
  const session = project.plugin<Session>('session');
  //get the renderer
  const { render } = project.plugin<InkPlugin>('template');
  //get authorization
  const token = session.token(req);
  const me = session.get(token || '');
  if (req.method === 'POST') {
    const input = req.post.get() as SignupInput;
    const response = await signup(input);
    if (response.code !== 200) {
      return res.setHTML(await render(
        '@stackpress/incept-user/dist/templates/signup', 
        { ...response, input, config }
      ));
    }
    return res.redirect(redirect);
  } else if (me) {
    return res.redirect(redirect);
  }

  return res.setHTML(await render(
    '@stackpress/incept-user/dist/templates/signup',
    { config }
  ));
};
