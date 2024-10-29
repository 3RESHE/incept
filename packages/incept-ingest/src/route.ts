import type { RouteConfig } from './types';

import path from 'path';

export default function route(config: RouteConfig) {
  const { routePath, entryPath, router } = config;
  router.all(`${routePath}/search`, path.resolve(entryPath, 'search'));
  router.all(`${routePath}/create`, path.resolve(entryPath, 'create'));
  router.all(`${routePath}/detail/:id`, path.resolve(entryPath, 'detail'));
  router.all(`${routePath}/update/:id`, path.resolve(entryPath, 'update'));
  router.all(`${routePath}/remove/:id`, path.resolve(entryPath, 'remove'));
  router.all(`${routePath}/restore/:id`, path.resolve(entryPath, 'restore'));
}