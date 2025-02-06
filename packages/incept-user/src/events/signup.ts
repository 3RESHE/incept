//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//incept
import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
//common
import { signup } from '../actions';

export default async function AuthSignup(req: ServerRequest, res: Response) {
  //get the roles from the config
  const roles = req.context.config<string[]>('session', 'auth', 'roles') || [];
  //get the database engine
  const store = req.context.plugin<DatabasePlugin>('database');
  //get input
  const input = { ...req.data(), roles };
  const response = await signup(input, store);
  //if good
  if (response.code === 200) {
    //get server
    const server = req.context;
    if (input.email) {
      server.call('email-email-send', { 
        email: input.email, 
        ...response.results 
      });
    }
    if (input.phone) {
      server.call('auth-phone-verify', { 
        phone: input.phone, 
        ...response.results 
      });
    }
  }
  res.fromStatusResponse(response);
}