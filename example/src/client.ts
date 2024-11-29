import type { Config } from './config';

import { client, Context, Response } from '@stackpress/incept';
import { config } from './config';

export default async function bootstrap(req: Context, res: Response) {
  //bootstrap a new client
  return await client<Config>({
    plugins: config.plugins
  });
};