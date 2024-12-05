//modules
import type { Directory } from 'ts-morph';
//stackpress
import type Registry from '@stackpress/incept/dist/schema/Registry';
//common
import type { Config } from '../types';
//local
import generateCreate from './create';
import generateDetail from './detail';
import generateRemove from './remove';
import generateRestore from './restore';
import generateSearch from './search';
import generateUpdate from './update';


//map from column types to sql types and helpers
export const typemap: Record<string, string> = {
  String: 'toSqlString',
  Text: 'toSqlString',
  Number: 'toSqlFloat',
  Integer: 'toSqlInteger',
  Float: 'toSqlFloat',
  Boolean: 'toSqlBoolean',
  Date: 'toSqlDate',
  Time: 'toSqlDate',
  Datetime: 'toSqlDate',
  Json: 'toSqlString',
  Object: 'toSqlString',
  Hash: 'toSqlString'
};

export default function generate(
  directory: Directory, 
  registry: Registry,
  config: Config
) {
  //loop through models
  for (const model of registry.model.values()) {
    const source = directory.createSourceFile(
      `${model.name}/actions.ts`,
      '', 
      { overwrite: true }
    );
    //import type { SQL } from 'drizzle-orm';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: 'drizzle-orm',
      namedImports: [ 'SQL' ]
    });
    //import type { SearchParams } from '@stackpress/incept-drizzle/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-drizzle/dist/types',
      namedImports: [ 'SearchParams' ]
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
    //import { sql, eq } from 'drizzle-orm';
    source.addImportDeclaration({
      moduleSpecifier: 'drizzle-orm',
      namedImports: [ 'count', 'and' ].concat(
        model.ids.length > 1 ? [ 'sql' ] : [ 'eq' ]
      ).concat(
        model.ids.length > 1 && model.relations.length > 0 ? [ 'eq' ]: []
      ).concat(
        model.spans.length > 0 ? [ 'lte', 'gte' ]: []
      ).concat([ 'asc', 'desc' ]).concat(
        model.searchables.length > 0 ? [ 'or', 'ilike' ]: []
      )
    });
    //import Exception from '@stackpress/incept/dist/Exception';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/incept/dist/Exception',
      defaultImport: 'Exception'
    });
    //import { toResponse, toErrorResponse } from '@stackpress/incept-drizzle/dist/helpers';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/incept-drizzle/dist/helpers',
      namedImports: [ 
        'toResponse', 
        'toErrorResponse',
        ...[
          ...model.filters, 
          ...model.spans
        ].filter(
          column => !!typemap[column.type]
        ).map(
          column => typemap[column.type]
        ).filter(
          (value, index, self) => self.indexOf(value) === index
        )
      ]
    });

    //import { db, schema } from '../store';
    source.addImportDeclaration({
      moduleSpecifier: '../store',
      namedImports: [ 'db', 'schema', 'core' ]
    });

    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });

    generateCreate(source, model, config);
    generateDetail(source, model);
    generateRemove(source, model);
    generateRestore(source, model);
    generateSearch(source, model);
    generateUpdate(source, model, config);
  }
}