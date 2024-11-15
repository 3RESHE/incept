import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';

import type { InkPlugin } from '@stackpress/incept-ink/dist/types';
import type  { SigninType, SigninInput } from '../actions/signin';
import type Session from '../Session';

import client, { AuthExtended } from '@stackpress/incept/client';
import signin from '../actions/signin';

export default async function SignInPage(req: Request, res: Response) {
  //extract project and model from client
  const { project } = client;
  const { params } = req.ctxFromRoute('/auth/signin/:type');
  const type = (params.get('type') || 'username') as SigninType;
  const redirect = req.query.get('redirect') || '/';
  //bootstrap plugins
  await project.bootstrap();
  //get the session
  const session = project.get<Session>('session');
  //get the renderer
  const { render } = project.get<InkPlugin>('template');
  //get authorization
  const token = session.token(req);
  const me = session.get(token || '');
  if (req.method === 'POST') {
    const input = req.post.get() as SigninInput;
    const response = await signin(type, input);
    if (response.code !== 200) {
      return res.setHTML(await render(
        '@stackpress/incept-user/dist/templates/signin', 
        { ...response, type, input }
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
    { type }
  ));
};