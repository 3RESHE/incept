//stackpress
import { scripts } from '@stackpress/incept';
//common
import make from '../server';

async function serve() {
  scripts.serve(await make());
};

serve().catch(console.error);