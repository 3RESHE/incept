//types
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
//project
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import { Loader } from '@stackpress/idea-transformer';
import Registry from '../configuration/Registry';
import { enval } from '../helpers';
//generators
import generateTypes from './types';
import generateAssert from './assert';
import generateDrizzle from './drizzle';
import generateConfig from './client/config';
import generateModule from './client/module';
import generateClient from './client/client';
import generateRegistry from './client/registry';

/**
 * This is the The params comes form the cli
 */
export default function generate({ config, schema, cli, cwd }: PluginWithCLIProps) {
  //-----------------------------//
  // 1. Config
  const client = Loader.absolute('@stackpress/.incept', cli.cwd);

  const lang = config.lang || 'js';
  //const admin = config.admin || '/admin/';

  //determine url
  const url = enval<string>(config.url || 'env(DATABASE_URL)');
  //determine engine
  const engine = enval<string>(config.engine || 'pg');
  
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
  generateConfig(client, schema);
  generateTypes(directory, registry);
  generateAssert(directory, registry);
  generateDrizzle(directory, registry, { url, engine });
  generateRegistry(directory, registry);
  generateModule(directory, registry);
  generateClient(directory, registry);
  
  //-----------------------------//
  // 5. index.ts
  const source = directory.createSourceFile('index.ts', '', { overwrite: true });
  //export type * from './types';
  source.addExportDeclaration({ 
    isTypeOnly: true,
    moduleSpecifier: './types'
  });
  //export * from './enums';
  source.addExportDeclaration({ 
    moduleSpecifier: './enums' 
  });
  //import schema from './schema.json';
  source.addImportDeclaration({ 
    moduleSpecifier: './schema.json', 
    defaultImport: 'schema' 
  });
  //import registry from './registry';
  source.addImportDeclaration({ 
    moduleSpecifier: './registry', 
    defaultImport: 'registry' 
  });
  //import client from './client';
  source.addImportDeclaration({ 
    moduleSpecifier: './client', 
    defaultImport: 'client' 
  });
  //export { schema, registry };
  source.addExportDeclaration({ 
    namedExports: ['schema', 'registry'] 
  });
  //export default client;
  source.addStatements(`export default client;`);
  
  //-----------------------------//
  // 6. Save
  //if you want ts, tsx files
  if (lang === 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
}