const path = require('path');
const environment = process.env.SERVER_ENV || 'development';
module.exports = {
  plugins: [
    '@stackpress/incept-i18n/dist', 
    '@stackpress/incept-session/dist', 
    '@stackpress/incept-ink/dist'
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
  dev: {
    buildRoute: '/build/client',
    socketRoute: '/__ink_dev__'
  },
  server: {
    minify: false
  },
  template: {
    engine: 'ink',
    config: {
      brand: '',
      minify: false,
      cwd: environment === 'development' 
        ? path.join(process.cwd(), 'src')
        : path.join(process.cwd(), 'dist')
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