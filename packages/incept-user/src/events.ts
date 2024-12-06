//stackpress
import { ServerRouter } from '@stackpress/ingest/dist/Router';
//local
import type { AuthConfig } from './types';
import { signup, signin } from './actions';

const emitter = new ServerRouter<AuthConfig>();

emitter.on('auth-signup', async function AuthSignup(req, res) {
  const response = await signup(req.data());
  res.fromStatusResponse(response);
});

emitter.on('auth-signin', async function AuthSignup(req, res) {
  const type = req.data('type') || 'username';
  const response = await signin(type, req.data());
  res.fromStatusResponse(response);
});

emitter.on('auth-signout', async function AuthSignup(req, res) {
  //remove session
  res.session.delete('session');
  res.setStatus(200);
});

export default emitter;