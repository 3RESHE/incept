//types
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
//project
import path from 'path';
import { Project, IndentationText, VariableDeclarationKind } from 'ts-morph';
import { Loader } from '@stackpress/idea-transformer';
import { Model, Fieldset } from '@stackpress/incept-spec';
import tsGenerator from '@stackpress/incept-ts/dist/generate';
import assertGenerator from '@stackpress/incept-assert/dist/generate';
import { formatCode } from './helpers';

/**
 * This is the The params comes form the cli
 */
export default function generate({ config, schema, cli, cwd }: PluginWithCLIProps) {
  const lang = config.lang || 'js';
  const client = Loader.absolute('@stackpress/.incept', cli.cwd);
  const tsConfig = {
    lang: lang,
    enums: `${client}${path.sep}enums`,
    types: `${client}${path.sep}[name]${path.sep}types`
  };
  const assertConfig = {
    asserts: '@stackpress/.incept/[name]/assert'
  };
  if (!schema.plugin) schema.plugin = {};
  schema.plugin['@stackpress/incept-ts'] = tsConfig;
  schema.plugin['@stackpress/incept-assert'] = assertConfig;
  tsGenerator({ config: tsConfig, schema, cli, cwd });
  assertGenerator({ config: assertConfig, schema, cli, cwd });

  //set up the ts-morph project
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
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
  const source = project.createDirectory(client);
  const file = source.createSourceFile('index.ts', '', { overwrite: true });
  //loop through models
  for (const name in Model.configs) {
    const model = new Model(name);
    //export type * from './[name]/types'
    file.addExportDeclaration({
      isTypeOnly: true,
      namedExports: [ 
        model.title,
        `${model.title}Extended`,
        `${model.title}CreateInput`,
        `${model.title}UpdateInput` 
      ],
      moduleSpecifier: `./${model.lower}/types`
    });
    //import { create as [name]AssertCreate, update as [name]AssertUpdate } from './[name]/assert'
    file.addImportDeclaration({
      namedImports: [ 
        `create as ${model.camel}AssertCreate`, 
        `update as ${model.camel}AssertUpdate` 
      ],
      moduleSpecifier: `./${model.lower}/assert`
    });
    //export const [name] = { assert: { create: [name]AssertCreate, update: [name]AssertUpdate } }
    file.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [{
        name: model.camel,
        initializer: formatCode(`{
          assert: {
            create: ${model.camel}AssertCreate,
            update: ${model.camel}AssertUpdate
          }
        }`)
      }]
    });
  }
  //loop through fieldsets
  for (const name in Fieldset.configs) {
    const fieldset = new Fieldset(name);
    //export type * from './[name]/types'
    file.addExportDeclaration({
      isTypeOnly: true,
      namedExports: [ 
        fieldset.title,
        `${fieldset.title}Extended`,
        `${fieldset.title}CreateInput`,
        `${fieldset.title}UpdateInput` 
      ],
      moduleSpecifier: `./${fieldset.lower}/types`
    });
    //import { create as [name]AssertCreate, update as [name]AssertUpdate } from './[name]/assert'
    file.addImportDeclaration({
      namedImports: [ 
        `create as ${fieldset.camel}AssertCreate`, 
        `update as ${fieldset.camel}AssertUpdate` 
      ],
      moduleSpecifier: `./${fieldset.lower}/assert`
    });
    //export const [name] = { assert: { create: [name]AssertCreate, update: [name]AssertUpdate } }
    file.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [{
        name: fieldset.camel,
        initializer: formatCode(`{
          assert: {
            create: ${fieldset.camel}AssertCreate,
            update: ${fieldset.camel}AssertUpdate
          }
        }`)
      }]
    });
  }
  //if you want ts, tsx files
  if (lang === 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
}