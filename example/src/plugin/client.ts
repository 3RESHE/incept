import type { Factory } from '@stackpress/incept';
import type { Config } from '../config';

import { config } from '../config';

export default function plugin(app: Factory<Config>) {
  app.config.set(config);
};