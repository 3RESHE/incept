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
      templates.add('@stackpress/incept-user/dist/templates/signup.ink');
      templates.add('@stackpress/incept-user/dist/templates/signin.ink');
    }
  }, -10);
  //on listen, add user events
  server.on('listen', req => {
    const router = req.context.withImports;
    router.on('auth-search', () => import('./events/search'), -10000);
    router.on('auth-detail', () => import('./events/detail'), -10000);
    router.on('auth-get', () => import('./events/detail'), -10000);
    router.on('auth-signup', () => import('./events/signup'));
    router.on('auth-signin', () => import('./events/signin'));
    router.on('auth-signout', () => import('./events/signout'));
    router.on('authorize', () => import('./events/authorize'));
    router.on('me', () => import('./events/session'));
    router.on('request', () => import('./pages/authorize'));
  });
  //on route, add user routes
  server.on('route', req => {
    const router = req.context.withImports;
    router.all('/auth/signin', () => import('./pages/signin'));
    router.all('/auth/signin/:type', () => import('./pages/signin'));
    router.all('/auth/signup', () => import('./pages/signup'));
    router.all('/auth/signout', () => import('./pages/signout'));
  });
};