//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept/dist/config/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(project: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    const source = project.createSourceFile(filepath, '', { overwrite: true });
    //import type Model from '@stackpress/incept/dist/config/Model';
    source.addImportDeclaration({ 
      isTypeOnly: true,
      moduleSpecifier: `@stackpress/incept/dist/config/Model`, 
      defaultImport: 'Model'
    });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
    //import * as action from './actions';
    source.addImportDeclaration({
      moduleSpecifier: `./actions`,
      defaultImport: '* as action'
    });
    //import schema from './schema';
    source.addImportDeclaration({
      moduleSpecifier: `./schema`,
      defaultImport: 'schema'
    });
    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });
    //export { config, schema, action };
    source.addExportDeclaration({ 
      namedExports: [ 'config', 'schema', 'action' ] 
    });
  }
  
  for (const fieldset of registry.fieldset.values()) {
    const filepath = `${fieldset.name}/index.ts`;
    const source = project.createSourceFile(filepath, '', { overwrite: true });
    //import type Fieldset from '@stackpress/incept/dist/spec/Fieldset';
    source.addImportDeclaration({ 
      isTypeOnly: true,
      moduleSpecifier: `@stackpress/incept/dist/spec/Fieldset`, 
      defaultImport: 'Fieldset'
    });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });
    //export { config };
    source.addExportDeclaration({ namedExports: [ 'config' ] });
  }
}