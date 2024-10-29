
import type { InkCompiler } from '@stackpress/ink/dist/types';
import type RefreshServer from '@stackpress/ink-dev/dist/RefreshServer';

export type AllRouter = { all: (route: string, entry: string) => void };

export type InkDevRouteConfig = {
  buildRoute?: string,
  socketRoute?: string,
  entryPath: string,
  router: AllRouter
};

export type InkDevEntryConfig = {
  buildRoute?: string,
  socketRoute?: string,
  compiler: InkCompiler, 
  refresh: RefreshServer
};

export type RouteConfig = {
  routePath: string,
  entryPath: string,
  router: AllRouter
};