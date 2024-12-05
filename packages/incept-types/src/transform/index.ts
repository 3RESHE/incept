//modules
import path from 'node:path';
import { Project, IndentationText } from 'ts-morph';
//stackpress
import type { PluginWithProject } from '@stackpress/incept/dist/types';
import Registry from '@stackpress/incept/dist/schema/Registry';
//local
import enumGenerator from './enums';
import typeGenerator from './types';


/**
 * @stackpress/.incept (file structure)
 * - profile/
 * | - index.ts
 * | - types.ts
 * - address/
 * | - index.ts
 * | - types.ts
 * - enums.ts
 * - index.ts
 * - types.ts
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(props: PluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { config, schema, cli } = props;
  //get client directory
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
  //if no project in the props
  if (!props.project) {
    //set up the ts-morph project
    props.project = new Project({
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
  }
  //create the asserts directory if not exists
  const directory = props.project.createDirectory(client);

  //-----------------------------//
  // 4. Generators
  //generate enums
  enumGenerator(directory, registry);
  //generate typescript
  typeGenerator(directory, registry);

  //-----------------------------//
  // 5. profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = directory.getSourceFile(filepath) 
      || directory.createSourceFile(filepath, '', { overwrite: true });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
  }

  //-----------------------------//
  // 6. address/index.ts

  for (const fieldset of registry.fieldset.values()) {
    const filepath = `${fieldset.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = directory.getSourceFile(filepath) 
      || directory.createSourceFile(filepath, '', { overwrite: true });
    //export type * from './module/[name]/types';
    source.addExportDeclaration({ moduleSpecifier: `./types` });
  }

  //-----------------------------//
  // 7. index.ts
  //load index.ts if it exists, if not create it
  const source = directory.getSourceFile('index.ts') 
    || directory.createSourceFile('index.ts', '', { overwrite: true });
  //export type * from './types';
  source.addExportDeclaration({ 
    isTypeOnly: true,
    moduleSpecifier: './types'
  });

  //-----------------------------//
  // 6. Save
  //if you want ts, tsx files
  if (lang === 'ts') {
    props.project.saveSync();
  //if you want js, d.ts files
  } else {
    props.project.emit();
  }
};