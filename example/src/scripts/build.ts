import bootstrap from '../build';

async function main() {
  //load the plugins
  const build = await bootstrap();
  //build manifest
  build.build().then(({ build }) => {
    console.log('done.', build);
  });
}

main().catch(console.error);