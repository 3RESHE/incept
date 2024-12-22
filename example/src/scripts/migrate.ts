//stackpress
import { scripts } from '@stackpress/incept-inquire';
//common
import database from '../database';
import make from '../server';

async function migrate() {
  await scripts.migrate(await make(), await database());
};

migrate()
  .then(() => process.exit(0))
  .catch(console.error);