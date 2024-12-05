//modules
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
//stackpress
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
import Registry from '@stackpress/incept/dist/schema/Registry';
//local
import generatePages from './pages';
import generateTemplates from './templates';
import generateRoutes from './routes';

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
 * - admin.ts
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
  // - profile/admin/create.ts
  // - profile/admin/detail.ts
  // - profile/admin/remove.ts
  // - profile/admin/restore.ts
  // - profile/admin/search.ts
  // - profile/admin/update.ts
  generatePages(directory, registry);
  // - profile/admin/create.ink
  // - profile/admin/detail.ink
  // - profile/admin/remove.ink
  // - profile/admin/restore.ink
  // - profile/admin/search.ink
  // - profile/admin/update.ink
  generateTemplates(directory, registry);
  // - profile/admin/routes.ts
  generateRoutes(directory, registry);

  //-----------------------------//
  // 5. profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = directory.getSourceFile(filepath) 
      || directory.createSourceFile(filepath, '', { overwrite: true });
    //import admin from './admin/routes';
    source.addImportDeclaration({
      moduleSpecifier: `./admin/routes`,
      defaultImport: 'admin'
    });
    //export { admin };
    source.addExportDeclaration({ namedExports: [ 'admin' ] });
  }

  //-----------------------------//
  // 6. Save
  //if you want ts, tsx files
  if (lang === 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
};