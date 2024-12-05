//stackpress
import { EventTerminal } from '@stackpress/types';
//common
import make from '../server';

async function emit() {
  //from the cli
  const terminal = new EventTerminal(process.argv.slice(2));
  //server emit
  const server = await make();
  await server.call(terminal.command, terminal.params);
};

emit().catch(console.error);