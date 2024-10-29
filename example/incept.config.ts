export const access = {
  ADMIN: [
    'profile-create',
    'profile-detail',
    'profile-search',
    'profile-remove',
    'profile-restore',
    'profile-update',

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

    'profile-network-create',
    'profile-network-detail',
    'profile-network-search',
    'profile-network-remove',
    'profile-network-restore',
    'profile-network-update',

    'account-detail',
    'account-update',

    'account-address-create',
    'account-address-detail',
    'account-address-search',
    'account-address-remove',
    'account-address-restore',
    'account-address-update',

    'account-file-create',
    'account-file-detail',
    'account-file-search',
    'account-file-remove',
    'account-file-restore',
    'account-file-update',

    'account-network-create',
    'account-network-detail',
    'account-network-search',
    'account-network-remove',
    'account-network-restore',
    'account-network-update'
  ],
  USER: [
    'account-detail',
    'account-update',

    'account-address-create',
    'account-address-detail',
    'account-address-search',
    'account-address-remove',
    'account-address-restore',
    'account-address-update',

    'account-file-create',
    'account-file-detail',
    'account-file-search',
    'account-file-remove',
    'account-file-restore',
    'account-file-update',

    'account-network-create',
    'account-network-detail',
    'account-network-search',
    'account-network-remove',
    'account-network-restore',
    'account-network-update'
  ],
  GUEST: [
    'profile-create',
    'profile-detail',
    'profile-search',
    'profile-remove',
    'profile-restore',
    'profile-update',

    'profile-connections-create',
    'profile-connections-search',
    'profile-memberships-create',
    'profile-memberships-search',
    'profile-files-create',
    'profile-files-search',
    'profile-addresses-create',
    'profile-addresses-search',

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
};

export const dev = {
  buildRoute: '/build/client',
  socketRoute: '/__ink_dev__'
}

export const admin = {
  root: '/admin',
  menu: [
    {
      name: 'Auths',
      icon: 'lock',
      path: '/admin/auth'
    },
    {
      name: 'Profiles',
      icon: 'user',
      path: '/admin/profile'
    },
    {
      name: 'Connections',
      icon: 'users',
      path: '/admin/connection'
    },
    {
      name: 'Files',
      icon: 'file',
      path: '/admin/file'
    },
    {
      name: 'Addresses',
      icon: 'map-marker-alt',
      path: '/admin/address'
    }
  ]
};

export const languages = {
  'en_US': {
    label: 'EN',
    translations: {
      'Sign In': 'Signin'
    }
  },
  'th_TH': {
    label: 'TH',
    translations: {
      'Sign In': 'Signin'
    }
  }
};