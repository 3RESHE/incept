//types
import type { Directory } from 'ts-morph';
import Registry from '@stackpress/incept/dist/config/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  const source = directory.createSourceFile('client.ts', '', { overwrite: true });
};

import { client } from '@stackpress/incept';
import { config } from './config';

export async function bootstrap() {
  //bootstrap a new client
  return await client({
    plugins: config.plugins
  });
};