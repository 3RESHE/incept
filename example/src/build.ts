import type { Config } from './config';

import path from 'path';
import vercel from '@stackpress/ingest-vercel';
import { build } from '@stackpress/incept';
import { config } from './config';

export default async function bootstrap() {
  //make a new build
  return await build<Config>(vercel, {
    cookie: config.cookie,
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    plugins: config.plugins
  });
};