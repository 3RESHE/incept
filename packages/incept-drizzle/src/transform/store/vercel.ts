//modules
import type { SourceFile } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';

export default function generate(source: SourceFile) {
  //import { sql } from '@vercel/postgres';
  source.addImportDeclaration({
    moduleSpecifier: '@vercel/postgres',
    namedImports: [ 'sql' ]
  });
  //import * as core from 'drizzle-orm/pg-core';
  source.addImportDeclaration({
    moduleSpecifier: 'drizzle-orm/pg-core',
    defaultImport: '* as core'
  });
  //import * as orm from 'drizzle-orm/vercel-postgres';
  source.addImportDeclaration({
    moduleSpecifier: 'drizzle-orm/vercel-postgres',
    defaultImport: '* as orm'
  });
  //const resource = sql;
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'resource',
      initializer: 'sql'
    }]
  });
  //const db = orm.drizzle(resource, { schema });
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'db',
      initializer: 'orm.drizzle(resource, { schema })'
    }]
  });
  //export { core, orm, resource, db };
  source.addExportDeclaration({
    namedExports: [ 'core', 'orm', 'resource', 'schema', 'db' ]
  });
};