import type { InkCompiler } from '@stackpress/ink/dist/types';
import type RefreshServer from '@stackpress/ink-dev/dist/RefreshServer';

export type Renderer = (
  filePath: string, 
  props?: Record<string, unknown>
) => Promise<string>;

export type InkPlugin = {
  compiler: InkCompiler,
  refresh: RefreshServer,
  render: Renderer
};

export type TemplatePlugin = {
  render: Renderer
};

export type TemplateDevConfig = {
  buildRoute: string,
  socketRoute: string
};

export type TemplateEngineConfig = {
  brand: string,
  minify: boolean,
  buildPath: string,
  cwd: string,
  dev: TemplateDevConfig
};

export type TemplateConfig = { 
  template: {
    engine: string,
    config: TemplateEngineConfig
  }
};