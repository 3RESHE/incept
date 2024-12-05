//modules
import type { Directory } from 'ts-morph';
import fs from 'fs';
import path from 'path';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, schema: SchemaConfig) {
  const pwd = directory.getPath();
  if (!fs.existsSync(pwd)) {
    fs.mkdirSync(pwd, { recursive: true });
  }
  fs.writeFileSync(
    path.join(pwd, 'config.json'), 
    JSON.stringify(schema, null, 2)
  );
};