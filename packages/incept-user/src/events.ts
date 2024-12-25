//stackpress
import { ServerRouter } from '@stackpress/ingest/dist/Router';
//incept
import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
import { toResponse } from '@stackpress/incept-inquire/dist/helpers';
//local
import type { SessionConfig, SessionPlugin, AuthExtended } from './types';
import { signup, signin } from './actions';

const emitter = new ServerRouter<SessionConfig>();

emitter.on('auth-signup', async function AuthSignup(req, res) {
  //get the roles from the config
  const roles = req.context.config<string[]>('session', 'auth', 'roles') || [];
  //get the database engine
  const store = req.context.plugin<DatabasePlugin>('database');
  const response = await signup({ ...req.data(), roles }, store);
  res.fromStatusResponse(response);
});

emitter.on('auth-signin', async function AuthSignup(req, res) {
  //get the type of signin username, email, phone
  const type = req.data('type') || 'username';
  //get the database engine
  const store = req.context.plugin<DatabasePlugin>('database');
  //get the user from the database
  const response = await signin(type, req.data(), store);
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
});

emitter.on('auth-signout', async function AuthSignup(req, res) {
  //remove session
  res.session.delete('session');
  res.setStatus(200);
});

emitter.on('authorize', async function Authorize(req, res) {
  const server = req.context;
  const session = server.plugin<SessionPlugin>('session');
  session.authorize(req, res);
});

emitter.on('me', async function Me(req, res) {
  const server = req.context;
  const session = server.plugin<SessionPlugin>('session');
  const token = session.token(req);
  const me = session.get(token || '');
  if (!me) {
    res.setError({
      code: 404,
      status: 'Not Found',
      error: 'No session found.'
    });
    return;
  }
  res.fromStatusResponse(toResponse(me));
});

export default emitter;