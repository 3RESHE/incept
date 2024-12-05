//modules
import type { Project } from 'ts-morph';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
import type { PluginProps } from '@stackpress/idea-transformer';
import type { CookieOptions } from '@stackpress/ingest/dist/types';
//schema
import type Registry from './schema/Registry';
//local
import type InceptTerminal from './Terminal';

export type ProjectProps = {
  cli: InceptTerminal,
  project: Project
};

export type PluginWithProject = PluginProps<ProjectProps>;

export type ServerConfig = {
  server: { 
    cwd: string, 
    mode: string, 
    routes: string, 
    bodySize: number 
  },
  cookie: CookieOptions
};

export type ClientPlugin = {
  config: SchemaConfig,
  registry: Registry
};