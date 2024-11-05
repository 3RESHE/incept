//types
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
import type Fieldset from '@stackpress/incept/dist/config/Fieldset';
//project
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import Registry from '@stackpress/incept/dist/config/Registry';
//generators
import generateCreate from './create';
import generateUpdate from './update';

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
  //loop through models
  for (const model of registry.model.values()) {
    //get the final path (.incept/Profile/assert.ts)
    const file = `${model.name}/assert.ts`;
    //determine the source file
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //import { assert } from '@stackpress/incept-assert';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/incept-assert/dist/assert',
      defaultImport: 'assert'
    });
    //import { ProfileInput } from './types';
    source.addImportDeclaration({
      moduleSpecifier: './types',
      namedImports: [ `${model.title}Input` ]
    });
    //import * as address from '../address/assert';
    model.fieldsets.forEach(column => {
      const fieldset = column.fieldset as Fieldset;
      source.addImportDeclaration({
        moduleSpecifier: `../${fieldset.name}/assert`,
        defaultImport: `* as ${fieldset.camel}`
      });
    })
    //generate the model
    generateCreate(source, model);
    generateUpdate(source, model);
  }
  //loop through fieldsets
  for (const fieldset of registry.fieldset.values()) {
    //get the final path (.incept/Profile/assert.ts)
    const file = `${fieldset.name}/assert.ts`;
    //determine the source file
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //import { assert } from '@stackpress/incept/dist/assert';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/incept-assert/dist/assert',
      defaultImport: 'assert'
    });
    //import { ProfileInput } from '../profile/types';
    source.addImportDeclaration({
      moduleSpecifier: './types',
      namedImports: [ `${fieldset.title}Input` ]
    });
    //import * as address from '../Address/assert';
    fieldset.fieldsets.forEach(column => {
      const fieldset = column.fieldset as Fieldset;
      source.addImportDeclaration({
        moduleSpecifier: `../${fieldset.name}/assert`,
        defaultImport: `* as ${fieldset.camel}`
      });
    })
    //generate the fieldset
    generateCreate(source, fieldset);
    generateUpdate(source, fieldset);
  }

  //-----------------------------//
  // 5. Save
  //if you want ts, tsx files
  if (lang === 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
};