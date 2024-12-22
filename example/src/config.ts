import type { ServerConfig } from '@stackpress/incept/dist/types';
import type { LanguageConfig } from '@stackpress/incept-i18n/dist/types';
import type { DatabaseConfig } from '@stackpress/incept-inquire/dist/types';
import type { SessionConfig } from '@stackpress/incept-user/dist/types';
import type { TemplateConfig } from '@stackpress/incept-ink/dist/types';
import type { AdminConfig } from '@stackpress/incept-admin/dist/types';
import type { APIConfig } from '@stackpress/incept-api/dist/types';

import path from 'path';

const cwd = process.cwd();
const seed = process.env.SESSION_SEED || 'abc123';
const environment = process.env.SERVER_ENV || 'development';

export type Config = ServerConfig 
  & DatabaseConfig
  & LanguageConfig 
  & TemplateConfig 
  & SessionConfig 
  & AdminConfig
  & APIConfig;

export const config: Config = {
  idea: { 
    lang: 'js',
    revisions: path.join(cwd, 'revisions')
  },
  server: {
    cwd: cwd,
    mode: environment,
    bodySize: 0
  },
  database: {
    migrations: path.join(cwd, 'migrations'),
    schema: {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    }
  },
  template: {
    engine: 'ink',
    config: {
      brand: '',
      minify: environment !== 'development',
      buildPath: path.join(cwd, 'build'),
      cwd: environment === 'development' 
        ? path.join(cwd, 'src')
        : path.join(cwd, 'dist'),
      dev: { 
        buildRoute: '/build/client',
        socketRoute: '/__ink_dev__'
      }
    }
  },
  session: {
    name: 'session',
    seed: seed,
    access: {
      ADMIN: [
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' },
        { method: 'ALL', route: '/admin/**' }
      ],
      USER: [
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' }
      ],
      GUEST: [
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' }
      ]
    },
    auth: {
      name: 'Incept',
      logo: '/images/incept-logo-long.png',
      '2fa': {},
      captcha: {},
      roles: [ 'USER' ],
      username: true,
      email: true,
      phone: true,
      password: {
        min: 8,
        max: 32,
        upper: true,
        lower: true,
        number: true,
        special: true
      }
    }
  },
  cookie: { path: '/' },
  admin: {
    root: '/admin',
    menu: [
      {
        name: 'Profiles',
        icon: 'user',
        path: '/admin/profile/search',
        match: '/admin/profile'
      },
      {
        name: 'Files',
        icon: 'file',
        path: '/admin/file/search',
        match: '/admin/file'
      },
      {
        name: 'Addresses',
        icon: 'map-marker',
        path: '/admin/address/search',
        match: '/admin/address'
      },
      {
        name: 'Auths',
        icon: 'lock',
        path: '/admin/auth/search',
        match: '/admin/auth'
      },
      {
        name: 'Connections',
        icon: 'users',
        path: '/admin/connection/search',
        match: '/admin/connection'
      },
      {
        name: 'Apps',
        icon: 'laptop',
        path: '/admin/application/search',
        match: '/admin/application'
      },
      {
        name: 'Sessions',
        icon: 'coffee',
        path: '/admin/session/search',
        match: '/admin/session'
      }
    ]
  },
  api: {
    scopes: {
      'profile-read': { 
        name: 'Read Profile',
        description: 'Read from Profile' 
      },
      'profile-write': { 
        name: 'Write Profile',
        description: 'Write to Profile' 
      },
    },
    endpoints: [
      {
        method: 'GET',
        route: '/api/profile',
        type: 'public',
        event: 'profile-search',
        data: {}
      },
      {
        method: 'POST',
        route: '/api/profile/create',
        type: 'app',
        scopes: [ 'profile-write' ],
        event: 'profile-create',
        data: {}
      },
      {
        method: 'GET',
        route: '/api/auth/:profileId',
        type: 'session',
        scopes: [ 'auth-read' ],
        event: 'auth-search',
        data: {}
      }
    ]
  },
  languages: {
    en_US: {
      label: 'EN',
      translations: {
        'Sign In': 'Signin'
      }
    },
    th_TH: {
      label: 'TH',
      translations: {
        'Sign In': 'Signin'
      }
    }
  }
};