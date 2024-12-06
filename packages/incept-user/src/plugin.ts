//modules
import path from 'path';
//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//local
import type { AuthConfig } from './types';
import Session from './Session';
import emitter from './events';

const seed = process.env.SESSION_SEED as string || 'default';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server<AuthConfig>) {
  //on config, register session plugin
  server.on('config', req => {
    const server = req.context;
    //get the project config
    const config = server.config();
    //make a new session
    const session = new Session(seed, config.access || {});
    //add session as a project plugin
    server.register('session', session);
  });
  //on listen, add user routes
  server.on('listen', req => {
    const server = req.context;
    server.use(emitter);
    server.all('/auth/signin', path.join(__dirname, 'pages/signin'));
    server.all('/auth/signin/:type', path.join(__dirname, 'pages/signin'));
    server.all('/auth/signup', path.join(__dirname, 'pages/signup'));
    server.all('/auth/signout', path.join(__dirname, 'pages/signout'));
  });
};