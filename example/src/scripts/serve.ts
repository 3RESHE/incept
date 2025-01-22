//incept
import { scripts } from '@stackpress/incept';
//local
import server from '../server';

async function serve() {
  scripts.serve(await server());
};

serve().catch(console.error);