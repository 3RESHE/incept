//types
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
//project
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import { Loader } from '@stackpress/idea-transformer';
import Registry from '@stackpress/incept-spec/dist/Registry';
import { enval } from '@stackpress/incept-spec/dist/helpers';
//generators
import generateConfig from './config';
import generateTypes from '@stackpress/incept-types/idea';
import generateAssert from '@stackpress/incept-assert/idea';
import generateDrizzle from '@stackpress/incept-drizzle/idea';
import generateInk from '@stackpress/incept-ink/idea';
import generateModule from './module';
import generateRegistry from './registry';
import generateClient from './client';

/**
 * This is the The params comes form the cli
 */
export default function generate({ config, schema, cli }: PluginWithCLIProps) {
  //-----------------------------//
  // 1. Config
  const client = Loader.absolute('@stackpress/.incept', cli.cwd);
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
  generateConfig(directory, schema);
  generateTypes(directory, registry);
  generateAssert(directory, registry);
  generateDrizzle(directory, registry, { url, engine });
  generateInk(directory, registry);
  generateModule(directory, registry);
  generateRegistry(directory);
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