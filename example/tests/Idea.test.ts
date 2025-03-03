import { describe, before } from 'mocha';
//stackpress
import type Engine from '@stackpress/inquire/dist/Engine';
import { server as http } from '@stackpress/ingest/http';
//incept
import drop from '@stackpress/incept-inquire/dist/scripts/drop';
import install from '@stackpress/incept-inquire/dist/scripts/install';
import tests from '@stackpress/.incept/tests';
//src
import type { Config } from '../plugins/config';

describe('Idea Tests', async () => {
  //make a new http server
  const server = http<Config>();
  //load the plugins
  await server.bootstrap();
  //set the server mode to testing
  server.config.set('server', 'mode', 'integration');
  //configure server
  await server.call('config');
  //add events
  await server.call('listen');
  //add routes
  await server.call('route');
  //before all tests...
  before(async () => {  
    //get database
    const database = server.plugin<Engine>('database');
    //drop and install database
    await drop(server, database);
    await install(server, database);
  });

  //@ts-ignore
  tests(server);
});