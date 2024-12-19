//modules
import type { Directory } from 'ts-morph';
//stackpress
import type Registry from '@stackpress/incept/dist/schema/Registry';

//map from column types to sql types and helpers
export const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'string',
  Time: 'string',
  Datetime: 'string',
  Json: 'string',
  Object: 'string',
  Hash: 'string'
};

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const source = directory.createSourceFile(
      `${model.name}/actions.ts`,
      '', 
      { overwrite: true }
    );
    //import type { SearchParams } from '@stackpress/incept-inquire/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-inquire/dist/types',
      namedImports: [ 'SearchParams']
    });
    //import type { ProfileModel, ProfileExtended, ProfileInput } from './types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: './types',
      namedImports: [ 
        model.title,
        `${model.title}Extended`, 
        `${model.title}Input`
      ]
    });
    //import Engine from '@stackpress/inquire/dist/Engine';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/inquire/dist/Engine',
      defaultImport: 'Engine'
    });
    //import { Actions } from '@stackpress/incept-inquire/dist/actions';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/incept-inquire/dist/actions',
      defaultImport: 'Actions'
    });
    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });
    //export default function actions(engine: Engine) {}
    source.addFunction({
      isDefaultExport: true,
      name: 'actions',
      parameters: [ { name: 'engine', type: 'Engine' } ],
      statements: `return new Actions<${model.title}Extended>(config, engine);`
    });
  }
};