import type { VercelBuilder } from '@stackpress/ingest-vercel';
import type { Config } from '../config';

import path from 'path';
import { config } from '../config';

export default function plugin(app: VercelBuilder<Config>) {
  app.config.set(config);
  app.on('route', _ => {
    const { cwd, mode } = app.config.data.server;
    const root = path.join(cwd, mode === 'development' ? 'src': 'dist');

    //front end routes
    app.all('/', path.resolve(root, 'routes/home'));
  });
};