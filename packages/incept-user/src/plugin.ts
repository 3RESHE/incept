//modules
import path from 'path';
//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//incept
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
//user
import type { PermissionList } from './types';
import Session from './Session';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register session plugin
  server.on('config', req => {
    const server = req.context;
    const config = server.config.withPath;
    const name = config.get<string>('session.name') || 'session';
    const seed = config.get<string>('session.seed') || 'abc123';
    const access = config.get<PermissionList>('session.access') || {};
    //make a new session
    const session = new Session(name, seed, access);
    //add session as a project plugin
    server.register('session', session);
  });
  //on config (low priority), add user templates
  server.on('config', req => {
    const server = req.context;
    const { templates } = server.plugin<TemplatePlugin>('template');
    if (templates) {
      templates.add('@stackpress/incept-user/dist/templates/signup');
      templates.add('@stackpress/incept-user/dist/templates/signin');
      templates.add('@stackpress/incept-user/dist/templates/signout');
    }
  }, -10);
  //on listen, add user events
  server.on('listen', req => {
    const server = req.context;
    server.on('auth-search', path.join(__dirname, 'events/search'), -10000);
    server.on('auth-detail', path.join(__dirname, 'events/detail'), -10000);
    server.on('auth-get', path.join(__dirname, 'events/detail'), -10000);
    server.on('auth-signup', path.join(__dirname, 'events/signup'));
    server.on('auth-signin', path.join(__dirname, 'events/signin'));
    server.on('auth-signout', path.join(__dirname, 'events/signout'));
    server.on('authorize', path.join(__dirname, 'events/authorize'));
    server.on('me', path.join(__dirname, 'events/session'));
    server.on('request', path.join(__dirname, 'pages/authorize'));
  });
  //on route, add user routes
  server.on('route', req => {
    const server = req.context;
    server.all('/auth/signin', path.join(__dirname, 'pages/signin'));
    server.all('/auth/signin/:type', path.join(__dirname, 'pages/signin'));
    server.all('/auth/signup', path.join(__dirname, 'pages/signup'));
    server.all('/auth/signout', path.join(__dirname, 'pages/signout'));
  });
};