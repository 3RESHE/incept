//types
import type { SchemaConfig } from '@stackpress/idea-parser';
//project
import fs from 'fs';
import path from 'path';

/**
 * This is the The params comes form the cli
 */
export default function generate(pwd: string, schema: SchemaConfig) {
  if (!fs.existsSync(pwd)) {
    fs.mkdirSync(pwd, { recursive: true });
  }
  fs.writeFileSync(
    path.join(pwd, 'schema.json'), 
    JSON.stringify(schema, null, 2)
  );
};