const path = require('path');
const environment = process.env.SERVER_ENV || 'development';
module.exports = {
  plugins: [
    //transformers
    '@stackpress/incept-types',
    '@stackpress/incept-assert',
    '@stackpress/incept-drizzle',
    '@stackpress/incept-ink',
    '@stackpress/incept-admin',
    '@stackpress/incept-client',
    //plugins
    '@stackpress/incept-i18n', 
    '@stackpress/incept-session'
  ],
  access: {
    ADMIN: [
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
    ]
  },
  server: {
    minify: false
  },
  template: {
    engine: 'ink',
    config: {
      brand: '',
      minify: environment !== 'development',
      buildPath: path.join(process.cwd(), 'build'),
      cwd: environment === 'development' 
        ? path.join(process.cwd(), 'src')
        : path.join(process.cwd(), 'dist'),
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
        name: 'Auths',
        icon: 'lock',
        path: '/admin/auth/search'
      },
      {
        name: 'Profiles',
        icon: 'user',
        path: '/admin/profile/search'
      },
      {
        name: 'Connections',
        icon: 'users',
        path: '/admin/connection/search'
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