//plugins
import bootstrap from '../plugins/bootstrap';

async function serve() {
  const server = await bootstrap();
  const port = server.config.path<number>('server.port', 3000);
  //start the server
  server.create().listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('------------------------------');
  });
};

serve().catch(e => {
  console.error(e);
  process.exit(1);
});