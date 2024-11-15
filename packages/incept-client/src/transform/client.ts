//types
import type { Directory } from 'ts-morph';
import Registry from '@stackpress/incept/dist/config/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  const source = directory.createSourceFile('client.ts', '', { overwrite: true });
  //import path from 'path';
  source.addImportDeclaration({
    moduleSpecifier: 'path',
    defaultImport: 'path'
  });
  //import Project from '@stackpress/incept/dist/Project';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/incept/dist/Project',
    defaultImport: 'Project'
  });
  //import ConfigLoader from '@stackpress/incept/dist/loader/Config';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/incept/dist/loader/Config',
    defaultImport: 'ConfigLoader'
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
  //export function make(config: Record<string, any>) {};
  source.addFunction({
    name: 'make',
    parameters: [
      { name: 'config', type: 'Record<string, any>' }
    ],
    statements: `
      return {
        model: {
          ${Array.from(registry.model.values()).map(model => model.camel).join(',\n  ')}
        },
        fieldset: {
          ${Array.from(registry.fieldset.values()).map(fieldset => fieldset.camel).join(',\n  ')}
        },
        project: new Project(config),
        store: store,
        schema: schema
      };
    `.trim()
  });
  source.addStatements(`
    const cwd = process.cwd();
    const config = new ConfigLoader({ cwd });
    export default make(
      config.require<Record<string, any>>(
        path.join(cwd, 'incept.config.js'), 
        { cwd }
      )
    );
  `.trim());
}