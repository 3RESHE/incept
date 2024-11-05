//types
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
//project
import path from 'path';
import { 
  Project, 
  IndentationText, 
  VariableDeclarationKind 
} from 'ts-morph';
import Registry from '@stackpress/incept/dist/config/Registry';
//generators
import generateStore from './store';
import generateSchema from './schema';
import generateActions from './actions';
//helpers
import { enval } from '@stackpress/incept/dist/config/helpers';

/**
 * This is the The params comes form the cli
 * TODO: Enums, Unqiue
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
  //at a bare minimum generate the store
  generateStore(directory, registry, { url, engine });
  generateSchema(directory, registry, { url, engine });
  generateActions(directory, registry, { url, engine });

  const filepath = `schema.ts`;
  const source = directory.createSourceFile(filepath, '', { overwrite: true });
  for (const model of registry.model.values()) {
    //import ProfileSchema from './Profile/schema';
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/schema`,
      defaultImport: `${model.name}Schema`
    });
    //export const profile = ProfileSchema;
    source.addVariableStatement({
      isExported: true,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: model.camel,
        initializer: `${model.name}Schema`
      }]
    });
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