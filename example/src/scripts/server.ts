import bootstrap from '../build';

async function main() {
  //load the plugins
  const build = await bootstrap();
  //start the server
  build.create().listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('------------------------------');
    console.log(build.router.listeners);
  });
}

main().catch(console.error);