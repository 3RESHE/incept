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
    '@stackpress/incept-user'
  ],
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