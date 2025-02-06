import Server from '@stackpress/ingest/dist/Server';
import Terminal from '@stackpress/incept/dist/Terminal';

async function main() {
  const server = new Server();
  const terminal = new Terminal([ 'transform' ], server);
  await terminal.bootstrap();
  await terminal.run();
}

main()
  .then(() => process.exit(0))
  .catch(console.error);