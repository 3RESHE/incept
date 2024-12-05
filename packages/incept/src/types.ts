//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
import type { CookieOptions } from '@stackpress/ingest/dist/types';
//local
import type Registry from './schema/Registry';

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