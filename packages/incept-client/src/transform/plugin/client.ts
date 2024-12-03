//types
import type { Directory } from 'ts-morph';
import Registry from '@stackpress/incept/dist/config/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  const source = directory.createSourceFile('incept.client.ts', '', { overwrite: true });
  //import type { Factory } from '@stackpress/incept';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/incept',
    namedImports: [ 'Factory' ]
  });
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
  //import schema from './schema';
  source.addImportDeclaration({ 
    moduleSpecifier: './schema', 
    defaultImport: 'schema' 
  });
  //import * as store from './store';
  source.addImportDeclaration({ 
    moduleSpecifier: './store', 
    defaultImport: 'store' 
  });
  //export default function plugin(client: Factory) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'plugin',
    parameters: [
      { name: 'client', type: 'Factory' }
    ],
    statements: `
      //add session as a project plugin
      client.register('client', {
        model: {
          ${Array.from(registry.model.values()).map(model => model.camel).join(',\n  ')}
        },
        fieldset: {
          ${Array.from(registry.fieldset.values()).map(fieldset => fieldset.camel).join(',\n  ')}
        },
        store: store,
        schema: schema
      });
    `.trim()
  });
}