import type { InkCompiler } from '@stackpress/ink/dist/types';
import type RefreshServer from '@stackpress/ink-dev/dist/RefreshServer';

export type Renderer = (filePath: string, props?: Record<string, unknown>) => Promise<string>;

export type InkPlugin = {
  compiler: InkCompiler,
  refresh: RefreshServer,
  render: Renderer
};