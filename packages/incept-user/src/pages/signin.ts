//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
//actions
import type  { SigninType } from '../types';
//common
import type { AuthConfig, SessionPlugin } from '../types';

const template = '@stackpress/incept-user/dist/templates/signin';

export default async function SignInPage(req: ServerRequest, res: Response) {
  //extract project and model from client
  const server = req.context;
  // /auth/signin/:type
  const { 
    type = 'username', 
    redirect = '/' 
  } = req.data<{ type: SigninType, redirect: string }>();
  //get the auth config
  const config = server.config<AuthConfig['auth']>('auth');
  //get the session
  const session = server.plugin<SessionPlugin>('session');
  //get the renderer
  const { render } = server.plugin<TemplatePlugin>('template');
  //get authorization
  const token = session.token(req);
  const me = session.get(token || '');
  if (req.method === 'POST') {
    const response = await server.call('auth-signin', req);
    if (response.code !== 200) {
      return res.setHTML(await render(template, { 
        ...response, 
        input: req.data(),
        type, 
        config 
      }));
    }
    const results = response.results as {
      id: string,
      profile: {
        name: string,
        image: string,
        roles: string[]
      }
    };
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

  return res.setHTML(await render(template, { type, config }));
};