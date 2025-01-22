//stackpress
import { scripts } from '@stackpress/incept-inquire';
//common
import database from '../src/stores/development';
import server from '../src/server';

async function migrate() {
  await scripts.migrate(await server(), await database());
};

migrate()
  .then(() => process.exit(0))
  .catch(console.error);