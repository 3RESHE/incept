//types
import type { Directory } from 'ts-morph';
import type Model from '@stackpress/incept/dist/config/Model';
import type Column from '@stackpress/incept/dist/config/Column';
import type Registry from '@stackpress/incept/dist/config/Registry';
import type { Config, Relations } from '../types';
//helpers
import { camelize, formatCode } from '@stackpress/incept/dist/config/helpers';
import getColumn from './column';

export default function generate(
  directory: Directory, 
  registry: Registry,
  config: Config
) {
  const engine = config.engine.type === 'env' 
    ? `process.env.${config.engine.value}` 
    : config.engine.value;
  //loop through models
  for (const model of registry.model.values()) {
    const source = directory.createSourceFile(
      `${model.name}/schema.ts`, 
      '', 
      { overwrite: true }
    );

    const relations: Relations = Object.fromEntries(
      model.relations.map(column => {
        const foreignTable = camelize(column.type);
        const foreignId = column.relation?.parent.key.name;
        const localTable = model.name;
        const localId = column.relation?.child.key.name;
        return [ 
          localId, 
          { localTable, localId, foreignTable, foreignId }
        ];
      }).filter(relation => relation[0])
    );

    const columns = Array.from(model.columns.values());
  
    const definitions = columns.map(column => ({
      column, 
      type: getColumn(column, engine, relations)
    }));
  
    const methods = definitions
      .map(definition => definition.type[0])
      .map(method => method?.name)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
  
    const schema = definitions
      .map(definition => [
        definition.column, 
        definition.type
      ] as [ Column, { name: string, args: string[] }[] ])
      .filter(column => column[1].length > 0)
      .map(column => [
        column[0], 
        column[1].map(
          column => `${column.name}(${column.args.join(', ')})`
        )
      ] as [Column, string[]])
      .map(column => `${column[0].name}: ${column[1].join('.')}`) as string[];
    
    const indexes = Array.from(model.columns.values()).map(column => {
      if (column.unique) {
        if (!methods.includes('uniqueIndex')) methods.push('uniqueIndex');
        return `${
          column.name
        }Index: uniqueIndex('${
          model.lower
        }_${
          column.name
        }_idx').on(${
          model.camel
        }.${column.name})`;
      } else if (column.indexable) {
        if (!methods.includes('index')) methods.push('index');
        return `${
          column.name
        }Index: index('${
          model.lower
        }_${
          column.name
        }_idx').on(${
          model.camel
        }.${column.name})`;
      }
      return false;
    }).filter(Boolean) as string[];
  
    if (model.ids.length > 0) {
      methods.push('primaryKey');
      const keyName = model.ids.length > 1 
        ? `${model.camel}PrimaryKeys`
        : `${model.camel}PrimaryKey` 
      indexes.unshift(`${keyName}: primaryKey({ columns: [${
        model.ids.map(column => `${model.camel}.${column.name}`).join(', ')
      }] })`);
    }

    //import { sql } from 'drizzle-orm/sql';
    if (columns.some(column => column.default === 'now()')) {
      source.addImportDeclaration({
        moduleSpecifier: 'drizzle-orm/sql',
        namedImports: [ 'sql' ]
      });
    }

    //import { pgTable as table, integer, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
    //...or...
    //import { mysqlTable as table, int as integer, mysqlEnum, uniqueIndex, varchar, serial } from 'drizzle-orm/mysql-core';
    //...or...
    //import { sqliteTable as table, integer, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
    if (['neon', 'xata', 'postgres', 'pg', 'pglite', 'vercel'].includes(engine)) {
      source.addImportDeclaration({
        moduleSpecifier: 'drizzle-orm/pg-core',
        namedImports: ['pgTable as table', ...methods]
      });
    } else if (['planetscale', 'mysql'].includes(engine)) {
      source.addImportDeclaration({
        moduleSpecifier: 'drizzle-orm/mysql-core',
        namedImports: ['mysqlTable as table', ...methods]
      });
    } else if (['sqlite'].includes(engine)) {
      source.addImportDeclaration({
        moduleSpecifier: 'drizzle-orm/sqlite-core',
        namedImports: ['sqliteTable as table', ...methods]
      });
    }
    //import { createId as cuid } from '@paralleldrive/cuid2';
    if (columns.some(column => column.default === 'cuid()')) {
      source.addImportDeclaration({
        moduleSpecifier: '@paralleldrive/cuid2',
        namedImports: ['createId as cuid']
      });
    }
    //import { nanoid } from 'nanoid'
    const nanoids = columns.filter(
      column => typeof column.default === 'string' 
        && /^nanoid\(\d*\)$/.test(column.default)
    );
    if (nanoids.length > 0) {
      source.addImportDeclaration({
        moduleSpecifier: 'nanoid',
        namedImports: ['nanoid']
      });
    }

    Object.values(Object.fromEntries(model.relations.map(
        column => [column.type, column.model as Model]
    ))).forEach(foreign => {
      //import profile from '[paths.schema]'
      source.addImportDeclaration({
        moduleSpecifier: `../${foreign.name}/schema`,
        defaultImport: foreign.camel
      });
    });

    //export default table('Auth', {});
    source.addExportAssignment({
      isExportEquals: false,
      expression: formatCode(`
        table('${model.title}', {
        ${schema.join(',\n        ')}
        }, ${model.camel} => ({
          ${indexes.join(',\n        ')}
        }))
      `)
    });
  }
}