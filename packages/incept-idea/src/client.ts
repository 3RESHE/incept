//types
import type { Directory } from 'ts-morph';
import Registry from '@stackpress/incept-spec/dist/Registry';

import { formatCode } from '@stackpress/incept-spec/dist/helpers';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  const source = directory.createSourceFile('client.ts', '', { overwrite: true });
  //import * as profile from './module/profile';
  for (const model of registry.model.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}`,
      defaultImport: `* as ${model.camel}`
    });
  }
  //import * as profile from './module/profile';
  for (const fieldset of registry.fieldset.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${fieldset.name}`,
      defaultImport: `* as ${fieldset.camel}`
    });
  }
  //export default client;
  source.addStatements(formatCode(`
    const client = {
      ${Array.from(registry.model.values()).map(model => model.camel).join(',\n  ')},
      ${Array.from(registry.fieldset.values()).map(fieldset => fieldset.camel).join(',\n  ')},
    };
    export default client;
  `));
}