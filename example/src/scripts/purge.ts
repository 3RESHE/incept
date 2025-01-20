//stackpress
import { scripts } from '@stackpress/incept-inquire';
//common
import make from '../server';

async function purge() {
  const database = process.env.NODE_ENV === 'production' 
    ? await import('../databases/production') 
    : process.env.NODE_ENV === 'integration'
    ? await import('../databases/integration')
    : await import('../databases/development');
  await scripts.purge(await make(), await database.default());
};

purge()
  .then(() => process.exit(0))
  .catch(console.error);