//stackpress
import { server } from '@stackpress/ingest/http';
import { scripts } from '@stackpress/incept-inquire';
//common
import database from '../connect';
import type { Config } from '../../../config';
import { config } from '../../../config';

async function migrate() {
  const app = server<Config>({ 
    cache: config.server.mode === 'production' 
  });
  //load the plugins
  await app.bootstrap();
  await app.call('config');
  await app.call('listen');
  await scripts.migrate(app, await database());
};

migrate()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });