//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
//common
import type { SessionConfig, SessionPlugin } from '../types';

type AuthConfig = SessionConfig['session']['auth'];
const template = '@stackpress/incept-user/dist/templates/signup';

export default async function SignupPage(req: ServerRequest, res: Response) {
  //extract project and model from client
  const server = req.context;
  const redirect = req.data<string>('redirect') || '/auth/signin';
  //get the auth config
  const config = server.config<AuthConfig>('auth');
  //get the session
  const session = server.plugin<SessionPlugin>('session');
  //get the renderer
  const { render } = server.plugin<TemplatePlugin>('template');
  //get authorization
  const token = session.token(req);
  const me = session.get(token || '');
  if (req.method === 'POST') {
    const response = await server.call('auth-signup', req);
    if (response.code !== 200) {
      return res.setHTML(await render(template, { 
        ...response, 
        input: req.data(), 
        config 
      }));
    }
    return res.redirect(redirect);
  } else if (me) {
    return res.redirect(redirect);
  }

  return res.setHTML(await render(template, { config }));
};
