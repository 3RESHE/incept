#!/usr/bin/env node
import Terminal from './Terminal';

async function main() {
  const terminal = new Terminal(process.argv.slice(2));
  await terminal.bootstrap();
  await terminal.run();
}

main().catch(console.error);
