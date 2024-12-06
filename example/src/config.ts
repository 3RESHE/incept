import type { ServerConfig } from '@stackpress/incept/dist/types';
import type { LanguageConfig } from '@stackpress/incept-i18n/dist/types';
import type { SessionConfig } from '@stackpress/incept-user/dist/types';
import type { TemplateConfig } from '@stackpress/incept-ink/dist/types';
import type { DatabaseConfig } from '@stackpress/incept-drizzle/dist/types';
import type { AdminConfig } from '@stackpress/incept-admin/dist/types';

import path from 'path';

const cwd = process.cwd();
const seed = process.env.SESSION_SEED || 'abc123';
const environment = process.env.SERVER_ENV || 'development';
const dburl = process.env.DATABASE_URL || '';

export type Config = ServerConfig 
  & DatabaseConfig
  & LanguageConfig 
  & TemplateConfig 
  & SessionConfig 
  & AdminConfig;

export const config: Config = {
  idea: { lang: 'js' },
  server: {
    cwd: cwd,
    mode: environment,
    bodySize: 0
  },
  database: {
    engine: 'pglite',
    url: dburl
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
      user: [
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' },
        { method: 'ALL', route: '/admin/**' }
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