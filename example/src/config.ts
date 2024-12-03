import type { CookieOptions } from '@stackpress/incept';
import path from 'path';

const cwd = process.cwd();
const environment = process.env.SERVER_ENV || 'development';

export type Config = {
  plugins: string[],
  server: { 
    cwd: string, 
    mode: string, 
    routes: string, 
    bodySize: number 
  },
  access: Record<string, string[]>,
  cookie: CookieOptions,
  auth: {
    name: string,
    logo: string,
    '2fa': {},
    captcha: {},
    username: boolean,
    email: boolean,
    phone: boolean,
    password: {
      min: number,
      max: number,
      upper: boolean,
      lower: boolean,
      number: boolean,
      special: boolean
    }
  },
  template: {
    engine: string,
    config: {
      brand: string,
      minify: boolean,
      buildPath: string,
      cwd: string,
      dev: { 
        buildRoute: string,
        socketRoute: string
      }
    }
  },
  admin: {
    root: string,
    menu: {
      name: string,
      icon: string,
      path: string,
      match: string
    }[]
  },
  languages: Record<string, {
    label: string,
    translations: Record<string, string>
  }>
};

export const config: Config = {
  plugins: [ 
    //transformers
    '@stackpress/incept-types',
    '@stackpress/incept-drizzle',
    '@stackpress/incept-ink',
    '@stackpress/incept-admin',
    '@stackpress/incept-client',
    //plugins
    '@stackpress/incept-i18n', 
    '@stackpress/incept-user'
  ],
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