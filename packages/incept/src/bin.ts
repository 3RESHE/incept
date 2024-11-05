#!/usr/bin/env node
import ConfigLoader from './loader/Config';
import Terminal from './Terminal';

async function main() {
  const cwd = process.cwd();
  const loader = new ConfigLoader({ cwd });
  const terminal = new Terminal(
    process.argv.slice(2), 
    loader
  );
  await terminal.bootstrap();
  await terminal.run();
}

main().catch(console.error);
