import Server from '@stackpress/ingest/dist/Server';
import Terminal from '@stackpress/incept/dist/Terminal';

async function main() {
  const args = process.argv.slice(2);
  const server = new Server();
  const terminal = new Terminal(args, server);
  await terminal.bootstrap();
  await terminal.run();
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });