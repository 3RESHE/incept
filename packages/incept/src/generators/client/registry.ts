//types
import type { Directory } from 'ts-morph';
import type Registry from '../../configuration/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(project: Directory, registry: Registry) {
  const source = project.createSourceFile('registry.ts', '', { overwrite: true });
  //import type { SchemaConfig } from '@stackpress/idea-parser';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/idea-parser',
    namedImports: [ 'SchemaConfig' ]
  });
  //import Registry from '@stackpress/incept/dist/configuration/Registry';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/incept/dist/configuration/Registry',
    defaultImport: 'Registry'
  });
  //import schema from './schema.json';
  source.addImportDeclaration({
    moduleSpecifier: './schema.json',
    defaultImport: 'schema'
  });
  //export default new Registry(schema);
  source.addStatements(`export default new Registry(schema as unknown as SchemaConfig);`);
}