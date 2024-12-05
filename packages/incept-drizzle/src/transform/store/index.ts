//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import type Registry from '@stackpress/incept/dist/schema/Registry';
//common
import type { Config } from '../types';
//local
import generateMysql from './mysql';
import generateSqlite from './sqlite';
import generatePostgres from './postgres';
import generatePG from './pg';
import generatePGLite from './pglite';
import generateVercel from './vercel';
import generatePlanetScale from './planetscale';
import generateNeon from './neon';
import generateXata from './xata';

export default function generate(
  directory: Directory, 
  registry: Registry,
  config: Config
) {
  const source = directory.createSourceFile('store.ts', '', {
    overwrite: true
  });

  const models = Array.from(registry.model.values());

  //collect schemas
  models.map(model => {
    //import profile from '[paths.schema]
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/schema`,
      defaultImport: model.camel
    });
  });
  //const schema = { auth, profile, connection };
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'schema',
      initializer: `{ ${models.map(model => model.camel).join(', ')} }`
    }]
  });

  const engine = config.engine.type === 'env' 
    ? process.env[config.engine.value] 
    : config.engine.value;

  switch (engine) {
    case 'neon':
      generateNeon(source, config);
      break;
    case 'xata':
      generateXata(source);
      break;
    case 'postgres':
      generatePostgres(source, config);
      break;
    case 'pg':
      generatePG(source, config);
      break;
    case 'pglite':
      generatePGLite(source, config);
      break;
    case 'vercel':
      generateVercel(source);
      break;
    case 'planetscale':
      generatePlanetScale(source, config);
      break;
    case 'mysql':
      generateMysql(source, config);
      break;
    case 'sqlite':
      generateSqlite(source, config);
      break;
  }
};