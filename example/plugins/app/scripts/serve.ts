//stackpress
import { server } from '@stackpress/ingest/http';
//common
import type { Config } from '../../config';
import { config } from '../../config';

async function serve() {
  const port = config.server.port;
  const app = server<Config>({ 
    cache: config.server.mode === 'production' 
  });
  //load the plugins
  await app.bootstrap();
  await app.call('config');
  await app.call('listen');
  await app.call('route');

  //start the server
  app.create().listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('------------------------------');
  });
};

serve().catch(e => {
  console.error(e);
  process.exit(1);
});