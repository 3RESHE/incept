//stackpress
import type Response from '@stackpress/ingest/dist/Response';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
//incept
import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
//common
import type { SessionConfig, SessionPlugin, AuthExtended } from '../types';
import { signin } from '../actions';

export default async function AuthSignin(req: ServerRequest, res: Response) {
  //get the type of signin username, email, phone
  const type = req.data('type') || 'username';
  //get the server
  const server = req.context;
  //get the database engine 
  const store = server.plugin<DatabasePlugin>('database');
  //get the session seed
  const { seed = 'abc123' } = server.config<SessionConfig['session']>('session');
  //get the user from the database
  const response = await signin(type, req.data(), store, seed);
  //if there are results
  if (response.results) {
    //remove sensitive data
    const results = response.results as Partial<AuthExtended>;
    delete results.secret;
  }
  //sync the response object with the response
  res.fromStatusResponse(response);
  //if error
  if (response.code !== 200) {
    //do nothing else
    return;
  }
  //get the session
  const session = req.context.plugin<SessionPlugin>('session');
  //get the results from the response object
  const results = response.results as AuthExtended;
  //set the cookie session in the response
  res.session.set(session.name, session.create({
    id: results.profile.id, 
    name: results.profile.name,
    image: results.profile.image,
    roles: results.profile.roles
  }));
}