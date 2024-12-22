//stackpress
import { scripts } from '@stackpress/incept-inquire';
//common
import database from '../database';
import make from '../server';

async function push() {
  await scripts.push(await make(), await database());
};

push()
  .then(() => process.exit(0))
  .catch(console.error);