//modules
import type { SourceFile } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import { formatCode } from '@stackpress/incept/dist/schema/helpers';
//common
import type { Config } from '../types';

export default function generate(source: SourceFile, config: Config) {
  //import { PGlite } from '@electric-sql/pglite';
  source.addImportDeclaration({
    moduleSpecifier: '@electric-sql/pglite',
    namedImports: [ 'PGlite' ]
  });
  //import * as core from 'drizzle-orm/pg-core';
  source.addImportDeclaration({
    moduleSpecifier: 'drizzle-orm/pg-core',
    defaultImport: '* as core'
  });
  //import * as orm from 'drizzle-orm/pglite';
  source.addImportDeclaration({
    moduleSpecifier: 'drizzle-orm/pglite',
    defaultImport: '* as orm'
  });
  //const resourceGlobal = global as unknown as PGlite;
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'resourceGlobal',
      initializer: 'global as unknown as { resource: PGlite }'
    }]
  });
  //const resource = resourceGlobal.resource || new PGlite();
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'resource',
      initializer: formatCode(`resourceGlobal.resource || new PGlite(${
        config.url.type === 'env' 
        ? `process.env.${config.url.value} as string`
        : `'${config.url.value}'`
      })`)
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
  //if (process.env.NODE_ENV !== 'production') {
  //  resourceGlobal.resource = resource
  //}
  source.addStatements(`if (process.env.NODE_ENV !== 'production') {`);
  source.addStatements(`  resourceGlobal.resource = resource`);
  source.addStatements(`}`);
  //export { core, orm, resource, db };
  source.addExportDeclaration({
    namedExports: [ 'core', 'orm', 'resource', 'schema', 'db' ]
  });
};