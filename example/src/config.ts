import type { ServerConfig } from '@stackpress/incept/dist/types';
import type { LanguageConfig } from '@stackpress/incept-i18n/dist/types';
import type { AuthConfig } from '@stackpress/incept-user/dist/types';
import type { TemplateConfig } from '@stackpress/incept-ink/dist/types';
import type { AdminConfig } from '@stackpress/incept-admin/dist/types';

import path from 'path';

const cwd = process.cwd();
const environment = process.env.SERVER_ENV || 'development';

export type Config = ServerConfig 
  & LanguageConfig 
  & TemplateConfig 
  & AuthConfig 
  & AdminConfig;

export const config: Config = {
  server: {
    cwd: cwd,
    routes: environment === 'development' 
      ? path.join(cwd, 'src/routes')
      : path.join(cwd, 'dist/routes'),
    mode: environment,
    bodySize: 0
  },
  cookie: { 
    path: '/' 
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
  },
  access: {
    ADMIN: [
      'general',
      'profile-create',
      'profile-detail',
      'profile-search',
      'profile-remove',
      'profile-restore',
      'profile-update',
  
      'auth-create',
      'auth-detail',
      'auth-search',
      'auth-remove',
      'auth-restore',
      'auth-update',

      'connection-create',
      'connection-detail',
      'connection-search',
      'connection-remove',
      'connection-restore',
      'connection-update'
    ],
    USER: [
      'general',
      'profile-create',
      'profile-detail',
      'profile-search',
      'profile-remove',
      'profile-restore',
      'profile-update',
  
      'auth-create',
      'auth-detail',
      'auth-search',
      'auth-remove',
      'auth-restore',
      'auth-update',

      'connection-create',
      'connection-detail',
      'connection-search',
      'connection-remove',
      'connection-restore',
      'connection-update'
    ],
    GUEST: [
      'general',
      'profile-create',
      'profile-detail',
      'profile-search',
      'profile-remove',
      'profile-restore',
      'profile-update',
  
      'auth-create',
      'auth-detail',
      'auth-search',
      'auth-remove',
      'auth-restore',
      'auth-update',
  
      'address-create',
      'address-detail',
      'address-search',
      'address-remove',
      'address-restore',
      'address-update',
  
      'file-create',
      'file-detail',
      'file-search',
      'file-remove',
      'file-restore',
      'file-update',

      'connection-create',
      'connection-detail',
      'connection-search',
      'connection-remove',
      'connection-restore',
      'connection-update'
    ]
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