//stackpress
import Terminal from '@stackpress/incept/dist/Terminal';
//common
import make from '../server';

async function transform() {
  const server = await make();
  const terminal = new Terminal([ 'transform' ], server);
  await terminal.run();
};

transform().catch(console.error);