import type { InkCompiler } from '@stackpress/ink/dist/types';
import type HttpServer from '@stackpress/ink-dev/dist/HttpServer';
import type WhatwgServer from '@stackpress/ink-dev/dist/WhatwgServer';

export type TemplateServers = {
  http: HttpServer,
  whatwg: WhatwgServer
};

export type Renderer = (
  filePath: string, 
  props?: Record<string, unknown>
) => Promise<string>;

export type InkPlugin = {
  compiler: InkCompiler,
  render: Renderer,
  servers: TemplateServers
};

export type TemplatePlugin = {
  render: Renderer,
  servers: TemplateServers
};

export type TemplateDevConfig = {
  mode: 'http' | 'whatwg',
  buildRoute: string,
  socketRoute: string
};

export type TemplateEngineConfig = {
  brand: string,
  minify: boolean,
  clientPath?: string,
  serverPath?: string,
  manifestPath?: string,
  cwd: string,
  notemplate: string,
  dev: TemplateDevConfig
};

export type TemplateConfig = { 
  template: {
    engine: string,
    config: TemplateEngineConfig
  }
};