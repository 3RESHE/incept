//modules
import fs from 'node:fs';
import path from 'node:path';
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
  //get config
  const config = server.config.withPath;
  const cwd = config.get<string>('server.cwd');
  const build = config.get<string>('server.build');
  //make server, client and styles
  await cache(server);
  //copy ink files to build
  copyInkFiles(cwd, build);
  //make a package.json
  buildPackageJSON(cwd, build);
};

function copyInkFiles(cwd: string, build: string, current = 'plugins') {
  const source = path.join(cwd, current);
  const destination = path.join(build, current);
  //find all the .ink files from source
  const files = fs.readdirSync(source);
  for (const file of files) {
    //ignore . and ..
    if (file === '.' || file === '..') continue;
    //make an absolute source path
    const absolute = path.join(source, file);
    //if this is an ink file,
    if (file.endsWith('.ink')) {
      //if the parent directory does not exist,
      if (!fs.existsSync(destination)) {
        //make sure the parent directory exists
        fs.mkdirSync(destination, { recursive: true });
      }
      //now we can copy the file
      fs.copyFileSync(absolute, path.join(destination, file));
      continue;
    } 
    //if file is a directory, recurse
    if (fs.statSync(absolute).isDirectory()) {
      copyInkFiles(cwd, build, path.join(current, file));
    }
  }
}

export function buildPackageJSON(cwd: string, build: string) {
  const source = path.join(cwd, 'package.json');
  const destination = path.join(build, 'package.json');
  const contents = fs.readFileSync(source, 'utf8');
  const settings = JSON.parse(contents);
  delete settings.scripts;
  delete settings.devDependencies;
  fs.writeFileSync(destination, JSON.stringify(settings, null, 2));
}

build()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });