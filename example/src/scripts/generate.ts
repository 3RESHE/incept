//stackpress
import { scripts } from '@stackpress/incept';
//common
import make from '../server';

async function transform() {
  await scripts.generate(await make());
};

transform()
  .then(() => process.exit(0))
  .catch(console.error);