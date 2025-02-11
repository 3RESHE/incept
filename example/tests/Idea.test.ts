import { describe } from 'mocha';
//stackpress
import { server } from '@stackpress/ingest/http';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import drop from '@stackpress/incept-inquire/dist/scripts/drop';
import install from '@stackpress/incept-inquire/dist/scripts/install';
import tests from '@stackpress/.incept/tests';
//src
import type { Config } from '../src/config';

async function make() {
  const app = server<Config>();
  //load the plugins
  await app.bootstrap();
  await app.call('config');
  await app.call('listen');
  return app;
};

describe('Idea Tests', async () => {
  const server = await make();
  const database = server.plugin<Engine>('database');

  before(async () => {  
    await drop(server, database);
    await install(server, database);
  });

  //@ts-ignore
  tests(server);
});