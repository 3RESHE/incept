//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept-spec/dist/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(project: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    const source = project.createSourceFile(filepath, '', { overwrite: true });
    //import type Model from '@stackpress/incept-spec/dist/Model';
    source.addImportDeclaration({ 
      isTypeOnly: true,
      moduleSpecifier: `@stackpress/incept-spec/dist/Model`, 
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
    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });
    //export { config, schema, assert, action };
    source.addExportDeclaration({ 
      namedExports: [ 'config', 'schema', 'assert', 'action' ] 
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
    //import * as assert from './assert';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `./assert`,
      defaultImport: '* as assert'
    });
    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });
    //export { config, assert };
    source.addExportDeclaration({ namedExports: [ 'config', 'assert' ] });
  }
}