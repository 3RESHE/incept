//modules
import path from 'path';
//stackpress
import { Transformer } from '@stackpress/idea-transformer';
//common
import make from '../server';

async function transform() {
  const server = await make();
  const transformer = new Transformer(
    path.join(server.loader.cwd, 'schema.idea')
  );
  await server.call('idea', { transformer });
  transformer.transform({
    cli: { transformer, cwd: server.loader.cwd }
  });
};

transform().catch(console.error);