//types
import type Server from '@stackpress/ingest/dist/Server';
import path from 'path';
import type { AuthConfig } from './types';
import Session from './Session';

const seed = process.env.SESSION_SEED as string || 'default';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server<AuthConfig>) {
  //get the project config
  const config = server.config.get();
  //make a new session
  const session = new Session(seed, config.access || {});
  //add session as a project plugin
  server.register('session', session);
  //route the auth pages
  server.all('/auth/signin', path.join(__dirname, 'pages/signin'));
  server.all('/auth/signin/email', path.join(__dirname, 'pages/signin'));
  server.all('/auth/signin/phone', path.join(__dirname, 'pages/signin'));
  server.all('/auth/signin/username', path.join(__dirname, 'pages/signin'));
  server.all('/auth/signup', path.join(__dirname, 'pages/signup'));
  server.all('/auth/signout', path.join(__dirname, 'pages/signout'));
};