//modules
import path from 'node:path';
//stackpress
import type Server from '@stackpress/ingest/dist/Server';
import { serialize } from '@stackpress/ink/dist/helpers';
import ink from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';
//ink
import type { TemplatePlugin } from '../types';

export default async function build(server: Server<any, any, any>) {
  //get the compiler options
  const config = server.config.withPath;
  const cwd = config.get<string>('template.config.cwd') || process.cwd();
  const brand = config.get<string>('template.config.brand') || '';
  const clientPath = config.get<string>('template.config.clientPath');
  const serverPath = config.get<string>('template.config.serverPath');
  const manifestPath = config.get<string>('template.config.manifestPath');
  //get paths
  const paths = {
    client: clientPath,
    server: serverPath,
    manifest: manifestPath,
  };
  //get the template plugin
  const { templates } = server.plugin<TemplatePlugin>('template');
  //create ink compiler (to create the client, server and style builds)
  const compiler = ink({ brand, cwd, minify: true });
  //use ink css
  compiler.use(css());
  //get the file system (to save the build files)
  const fs = server.loader.fs;
  //make server and client directories
  if (typeof paths.server === 'string' && !fs.existsSync(paths.server)) {
    fs.mkdirSync(paths.server, { recursive: true });
  }
  if (typeof paths.client === 'string' && !fs.existsSync(paths.client)) {
    fs.mkdirSync(paths.client, { recursive: true });
  }
  //loop through the templates
  for (const template of templates) {
    //get the builder
    const builder = compiler.fromSource(template);
    //update the manifest
    compiler.manifest.set(
      serialize(builder.document.source), 
      builder.document.source
    );
    //if there's a server path
    if (typeof paths.server === 'string') {
      //save the server build
      fs.writeFileSync(
        path.join(paths.server, `${builder.document.id}.js`),
        await builder.server()
      );
    }
    //if there's a client path
    if (typeof paths.client === 'string') {
      //save the client build
      fs.writeFileSync(
        path.join(paths.client, `${builder.document.id}.js`),
        await builder.client()
      );
      //save the styles
      fs.writeFileSync(
        path.join(paths.client, `${builder.document.id}.css`),
        await builder.styles()
      );
    }
  }
  //if there's a manifest path
  if (typeof paths.manifest === 'string') {
    //save the manifest
    fs.writeFileSync(paths.manifest, compiler.manifest.toJson());
  }
};