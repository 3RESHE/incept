//stackpress
import { scripts } from '@stackpress/incept-inquire';
//common
import make from '../server';
import database from '../databases/development';

async function migrate() {
  await scripts.migrate(await make(), await database());
};

migrate()
  .then(() => process.exit(0))
  .catch(console.error);