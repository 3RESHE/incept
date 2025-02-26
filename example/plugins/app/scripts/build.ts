//stackpress
import { server as http } from '@stackpress/ingest/http';
import cache from '@stackpress/incept-ink/dist/scripts/build';

async function build() {
  const server = http({ cache: false });
  //load the plugins
  await server.bootstrap();
  await server.call('config');
  await server.call('listen');
  await server.call('route');
  await cache(server);
};

build()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });