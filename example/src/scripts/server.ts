//stackpress
import { server } from '@stackpress/ingest/http';
//local
import type { Config } from '../config';
import { config } from '../config';

async function main() {
  const app = server<Config>({
    cache: config.server.mode === 'production'
  })
  //load the plugins
  await app.bootstrap();
  //start the server
  app.create().listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('------------------------------');
  });
}

main().catch(console.error);