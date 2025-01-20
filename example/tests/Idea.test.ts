import { describe } from 'mocha';
//stackpress
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import drop from '@stackpress/incept-inquire/dist/scripts/drop';
import install from '@stackpress/incept-inquire/dist/scripts/install';
import tests from '@stackpress/.incept/tests';
//src
import make from '../src/server';

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