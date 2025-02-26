//modules
import path from 'node:path';
import type { Directory } from 'ts-morph';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
import type Server from '@stackpress/ingest/dist/Server';
//common
import Revisions from '../Revisions';

/**
 * This is the The params comes form the cli
 */
export default function generate(
  directory: Directory, 
  schema: SchemaConfig, 
  server: Server
) {
  const config = server.config.withPath;
  //need revisions path
  const revisions = config.get<string>('client.revisions');
  //if can revision
  if (revisions) {
    //add a new revision
    Revisions.insert(revisions, server.loader, schema);
  }

  const fs = server.loader.fs;

  const pwd = directory.getPath();
  if (!fs.existsSync(pwd)) {
    fs.mkdirSync(pwd, { recursive: true });
  }
  fs.writeFileSync(
    path.join(pwd, 'config.json'), 
    JSON.stringify(schema, null, 2)
  );
};