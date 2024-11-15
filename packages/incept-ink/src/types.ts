import type { InkCompiler } from '@stackpress/ink/dist/types';
import type { MethodRouter } from '@stackpress/incept/dist/types';
import type RefreshServer from '@stackpress/ink-dev/dist/RefreshServer';
export type Renderer = (filePath: string, props?: Record<string, unknown>) => Promise<string>;

export type InkPlugin = {
  compiler: InkCompiler,
  refresh: RefreshServer,
  render: Renderer
};

export type InkDevRouteConfig = {
  buildRoute?: string,
  socketRoute?: string,
  entryPath: string,
  router: MethodRouter
};

export type InkDevEntryConfig = {
  buildRoute?: string,
  socketRoute?: string,
  compiler: InkCompiler, 
  refresh: RefreshServer
};