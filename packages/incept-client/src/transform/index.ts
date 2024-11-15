//types
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
//project
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import Registry from '@stackpress/incept/dist/config/Registry';
//generators
import generateConfig from './config';
import generateModule from './module';
import generateRegistry from './registry';
import generateClient from './client';
import generateRoutes from './routes';

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
  generateConfig(directory, schema);
  generateModule(directory, registry);
  generateRegistry(directory, registry);
  generateClient(directory, registry);
  generateRoutes(directory, registry);
  
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
  //import config from './config.json';
  source.addImportDeclaration({ 
    moduleSpecifier: './config.json', 
    defaultImport: 'config' 
  });
  //import * as store from './store';
  source.addImportDeclaration({ 
    moduleSpecifier: './store', 
    defaultImport: 'store' 
  });
  //import schema from './schema';
  source.addImportDeclaration({ 
    moduleSpecifier: './schema', 
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
    namedExports: [ 'store', 'schema', 'registry' ] 
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