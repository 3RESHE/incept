//stackpress
import { scripts } from '@stackpress/incept';
//common
import make from '../server';

async function emit() {
  await scripts.emit(await make());
};

emit()
  .then(() => process.exit(0))
  .catch(console.error);