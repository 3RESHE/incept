//types
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
//project
import path from 'path';
import { 
  Project, 
  IndentationText, 
  VariableDeclarationKind 
} from 'ts-morph';
import Registry from '../schema/Registry';
//generators
import generateConfig from './config';
import generateRegistry from './registry';

/**
 * @stackpress/.incept (file structure)
 * - profile/
 * | - admin/
 * | | - create.ts
 * | | - detail.ts
 * | | - remove.ts
 * | | - restore.ts
 * | | - search.ts
 * | | - update.ts
 * | | - create.ink
 * | | - detail.ink
 * | | - remove.ink
 * | | - restore.ink
 * | | - search.ink
 * | | - update.ink
 * | | - routes.ts
 * | - components/
 * | | - filter.ink
 * | | - form.ink
 * | | - table.ink
 * | | - view.ink
 * | - actions.ts
 * | - config.ts
 * | - events.ts
 * | - index.ts
 * | - schema.ts
 * | - types.ts
 * - address/
 * | - config.ts
 * | - index.ts
 * | - types.ts
 * - admin.ts
 * - config.json
 * - enums.ts
 * - events.ts
 * - index.ts
 * - registry.ts
 * - schema.ts
 * - store.ts
 * - types.ts
 */

/**
 * @stackpress/.incept (file structure)
 * - profile/
 * | - config.ts
 * | - index.ts
 * - address/
 * | - config.ts
 * | - index.ts
 * - config.json
 * - index.ts
 * - registry.ts
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
  // - profile/config.ts
  // - address/config.ts
  // - registry.json
  // - config.json
  generateConfig(directory, schema);
  generateRegistry(directory, registry);

  //-----------------------------//
  // 5. profile/index.ts
  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });
    //export { config };
    source.addExportDeclaration({ namedExports: [ 'config' ] });
  }
  
  //-----------------------------//
  // 6. address/index.ts
  for (const fieldset of registry.fieldset.values()) {
    const filepath = `${fieldset.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });
    //export { config };
    source.addExportDeclaration({ namedExports: [ 'config' ] });
  }
  
  //-----------------------------//
  // 7. index.ts
  //load index.ts if it exists, if not create it
  const source = directory.getSourceFile('index.ts') 
    || directory.createSourceFile('index.ts', '', { overwrite: true });
  //import config from './config.json';
  source.addImportDeclaration({ 
    moduleSpecifier: './config.json', 
    defaultImport: 'config' 
  });
  //import registry from './registry';
  source.addImportDeclaration({ 
    moduleSpecifier: './registry', 
    defaultImport: 'registry' 
  });
  //import * as modelProfile from './profile';
  for (const model of registry.model.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}`,
      defaultImport: `* as model${model.title}`
    });
  }
  //import * as fieldsetAddress from './profile';
  for (const fieldset of registry.fieldset.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${fieldset.name}`,
      defaultImport: `* as fieldset${fieldset.title}`
    });
  }
  //export { config, registry };
  source.addExportDeclaration({ 
    namedExports: [ 'config', 'registry' ] 
  });
  //export const model = {}
  //export const fieldset = {}
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'model',
      initializer: `{
        ${Array.from(registry.model.values()).map(
          model => `${model.camel}: model${model.title}`
        ).join(',\n')}
      }`
    }, {
      name: 'fieldset',
      initializer: `{
        ${Array.from(registry.fieldset.values()).map(
          fieldset => `${fieldset.camel}: fieldset${fieldset.title}`
        ).join(',\n')}
      }`
    }]
  });
  
  //-----------------------------//
  // 8. Save
  //if you want ts, tsx files
  if (lang === 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
}