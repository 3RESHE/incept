//modules
import path from 'path';
//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//local
import type { SessionConfig } from './types';
import Session from './Session';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server<SessionConfig>) {
  //on config, register session plugin
  server.on('config', req => {
    const server = req.context;
    //get the project config
    const {
      name = 'session',
      seed = 'abc123',
      access = {}
    } = server.config<SessionConfig['session']>('session');
    //make a new session
    const session = new Session(name, seed, access);
    //add session as a project plugin
    server.register('session', session);
  });
  //on listen, add user routes
  server.on('listen', req => {
    const server = req.context;
    
    server.on('auth-signup', path.join(__dirname, 'events/signup'));
    server.on('auth-signin', path.join(__dirname, 'events/signin'));
    server.on('auth-signout', path.join(__dirname, 'events/signout'));
    server.on('authorize', path.join(__dirname, 'events/authorize'));
    server.on('me', path.join(__dirname, 'events/session'));

    server.all('/**', path.join(__dirname, 'pages/authorize'), 100);
    server.all('/auth/signin', path.join(__dirname, 'pages/signin'));
    server.all('/auth/signin/:type', path.join(__dirname, 'pages/signin'));
    server.all('/auth/signup', path.join(__dirname, 'pages/signup'));
    server.all('/auth/signout', path.join(__dirname, 'pages/signout'));
  });
};