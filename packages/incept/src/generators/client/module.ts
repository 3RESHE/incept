//types
import type { Directory } from 'ts-morph';
import type Registry from '../../configuration/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(project: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    const source = project.createSourceFile(filepath, '', { overwrite: true });
    //import type { Model } from '@stackpress/incept-spec';
    source.addImportDeclaration({ 
      isTypeOnly: true,
      moduleSpecifier: `@stackpress/incept/dist/configuration/Model`, 
      defaultImport: 'Model'
    });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
    //import * as assert from './assert';
    source.addImportDeclaration({
      moduleSpecifier: `./assert`,
      defaultImport: '* as assert'
    });
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
    //import registry from '../../registry';
    source.addImportDeclaration({
      moduleSpecifier: `../registry`,
      defaultImport: 'registry'
    });
    //const config = registry.model.get('profile');
    source.addStatements(`const config = registry.model.get('${model.camel}') as Model;`);
    //export { schema, assert, action };
    source.addExportDeclaration({ 
      namedExports: [ 'config', 'schema', 'assert', 'action' ] 
    });
  }
  
  for (const fieldset of registry.fieldset.values()) {
    const filepath = `${fieldset.name}/index.ts`;
    const source = project.createSourceFile(filepath, '', { overwrite: true });
    //import type Fieldset from '@stackpress/incept/dist/configuration/Fieldset';
    source.addImportDeclaration({ 
      isTypeOnly: true,
      moduleSpecifier: `@stackpress/incept/dist/configuration/Fieldset`, 
      defaultImport: 'Fieldset'
    });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
    //import * as assert from './assert';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `./assert`,
      defaultImport: '* as assert'
    });
    //import registry from '../registry';
    source.addImportDeclaration({
      moduleSpecifier: `../registry`,
      defaultImport: 'registry'
    });
    //const config = registry.fieldset.get('profile');
    source.addStatements(`const config = registry.fieldset.get('${fieldset.camel}') as Fieldset;`);
    //export { assert };
    source.addExportDeclaration({ namedExports: [ 'config', 'assert' ] });
  }
}