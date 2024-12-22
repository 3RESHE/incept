//stackpress
import { scripts } from '@stackpress/incept-inquire';
//common
import database from '../database';
import make from '../server';

async function install() {
  await scripts.install(await make(), await database());
};

install()
  .then(() => process.exit(0))
  .catch(console.error);