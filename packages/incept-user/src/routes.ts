import type { MethodRouter } from '@stackpress/incept/dist/types';

import path from 'path';

export default function routes(router: MethodRouter) {
  router.all('/auth/signin', path.join(__dirname, 'pages/signin'));
  router.all('/auth/signin/email', path.join(__dirname, 'pages/signin'));
  router.all('/auth/signin/phone', path.join(__dirname, 'pages/signin'));
  router.all('/auth/signin/username', path.join(__dirname, 'pages/signin'));
  router.all('/auth/signup', path.join(__dirname, 'pages/signup'));
  router.all('/auth/signout', path.join(__dirname, 'pages/signout'));
};