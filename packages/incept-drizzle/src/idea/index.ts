//types
import type { Directory } from 'ts-morph';
import type { Config } from './types';
//project
import { VariableDeclarationKind } from 'ts-morph';
import Registry from '@stackpress/incept-spec/dist/Registry';
//generators
import generateStore from './store';
import generateSchema from './schema';
import generateActions from './actions';

/**
 * This is the The params comes form the cli
 * TODO: Enums, Unqiue
 */
export default function generate(
  directory: Directory, 
  registry: Registry,
  config: Config
) {
  //at a bare minimum generate the store
  generateStore(directory, registry, config);
  generateSchema(directory, registry, config);
  generateActions(directory, registry, config);

  const filepath = `schema.ts`;
  const source = directory.createSourceFile(filepath, '', { overwrite: true });
  for (const model of registry.model.values()) {
    //import ProfileSchema from './Profile/schema';
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/schema`,
      defaultImport: `${model.name}Schema`
    });
    //export const profile = ProfileSchema;
    source.addVariableStatement({
      isExported: true,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: model.camel,
        initializer: `${model.name}Schema`
      }]
    });
  }
};