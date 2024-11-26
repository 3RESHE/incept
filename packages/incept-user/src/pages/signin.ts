import type Context from '@stackpress/ingest/dist/Context';
import type Response from '@stackpress/ingest/dist/Response';

import type { InkPlugin } from '@stackpress/incept-ink/dist/types';
import type  { SigninType, SigninInput } from '../actions/signin';
import type Session from '../Session';

import client, { AuthExtended } from '@stackpress/incept/client';
import signin from '../actions/signin';

export default async function SignInPage(req: Context, res: Response) {
  //extract project and model from client
  const { project } = client;
  // /auth/signin/:type
  const { 
    type = 'username', 
    redirect = '/' 
  } = req.data<{ type: SigninType, redirect: string }>();
  //bootstrap plugins
  await project.bootstrap();
  //get the project config
  const config = project.config<Record<string, string>>('auth');
  //get the session
  const session = project.plugin<Session>('session');
  //get the renderer
  const { render } = project.plugin<InkPlugin>('template');
  //get authorization
  const token = session.token(req.request);
  const me = session.get(token || '');
  if (req.method === 'POST') {
    const input = req.post.get() as SigninInput;
    const response = await signin(type, input);
    if (response.code !== 200) {
      return res.setHTML(await render(
        '@stackpress/incept-user/dist/templates/signin', 
        { ...response, type, input, config }
      ));
    }
    const results = response.results as AuthExtended;
    //set session
    res.session.set('session', session.create({
      id: results.id, 
      name: results.profile.name,
      image: results.profile.image,
      roles: results.profile.roles
    }));
    //redirect
    return res.redirect(redirect);
  } else if (me) {
    return res.redirect(redirect);
  }

  return res.setHTML(await render(
    '@stackpress/incept-user/dist/templates/signin',
    { type, config }
  ));
};