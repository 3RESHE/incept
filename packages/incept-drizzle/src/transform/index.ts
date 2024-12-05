//modules
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
//stackpress
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
import Registry from '@stackpress/incept/dist/schema/Registry';
import { enval } from '@stackpress/incept/dist/schema/helpers';
//local
import generateStore from './store';
import generateSchema from './schema';
import generateActions from './actions';
import generateEvents from './events';

/**
 * @stackpress/.incept (file structure)
 * - profile/
 * | - actions.ts
 * | - events.ts
 * | - index.ts
 * | - schema.ts
 * - index.ts
 * - events.ts
 * - schema.ts
 * - store.ts
 */

/**
 * This is the The params comes form the cli
 */
export default function generate({ config, schema, cli }: PluginWithCLIProps) {
  //-----------------------------//
  // 1. Config
  const client = path.resolve(
    cli.transformer.loader.modules(), 
    '@stackpress/.incept'
  );

  const lang = config.lang || 'js';
  //determine url
  const url = enval<string>(config.url || 'env(DATABASE_URL)');
  //determine engine
  const engine = enval<string>(config.engine || 'pglite');

  //-----------------------------//
  // 2. Registry
  const registry = new Registry(schema);

  //-----------------------------//
  // 3. Project
  //set up the ts-morph project
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      outDir: client,
      // Generates corresponding '.d.ts' file.
      declaration: true, 
      // Generates a sourcemap for each corresponding '.d.ts' file.
      declarationMap: true, 
      // Generates corresponding '.map' file.
      sourceMap: true, 
    },
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces
    }
  });
  //create the asserts directory if not exists
  const directory = project.createDirectory(client);

  //-----------------------------//
  // 4. Generators
  // - store.ts
  generateStore(directory, registry, { url, engine });
  // - profile/schema.ts
  generateSchema(directory, registry, { url, engine });
  // - profile/actions.ts
  generateActions(directory, registry, { url, engine });
  // - profile/events.ts
  generateEvents(directory, registry, { url, engine });

  //-----------------------------//
  // 5. profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = directory.getSourceFile(filepath) 
      || directory.createSourceFile(filepath, '', { overwrite: true });
    //import * as action from './actions';
    source.addImportDeclaration({
      moduleSpecifier: `./actions`,
      defaultImport: '* as action'
    });
    //import events from './events';
    source.addImportDeclaration({
      moduleSpecifier: `./events`,
      defaultImport: 'events'
    });
    //import schema from './schema';
    source.addImportDeclaration({
      moduleSpecifier: `./schema`,
      defaultImport: 'schema'
    });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
    //export { action, schema, event };
    source.addExportDeclaration({ 
      namedExports: [ 'action', 'schema', 'events' ] 
    });
  }

  //-----------------------------//
  // 6. index.ts
  //load index.ts if it exists, if not create it
  const source = directory.getSourceFile('index.ts') 
    || directory.createSourceFile('index.ts', '', { overwrite: true });
  //import * as schema from './schema';
  source.addImportDeclaration({ 
    moduleSpecifier: './schema', 
    defaultImport: '* as schema' 
  });
  //import * as store from './store';
  source.addImportDeclaration({ 
    moduleSpecifier: './store', 
    defaultImport: 'store' 
  });
  //export { schema, registry };
  source.addExportDeclaration({ 
    namedExports: [ 'schema', 'store' ] 
  });

  //-----------------------------//
  // 7. Save
  //if you want ts, tsx files
  if (lang === 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
};