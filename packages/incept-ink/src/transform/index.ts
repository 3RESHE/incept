//modules
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
//stackpress
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
import Registry from '@stackpress/incept/dist/schema/Registry';
//local
import generateView from './view';
import generateForm from './form';
import generateFilters from './filters';
import generateTable from './table';


/**
 * @stackpress/.incept (file structure)
 * - profile/
 * | - components/
 * | | - filter.ink
 * | | - form.ink
 * | | - table.ink
 * | | - view.ink
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
  // - profile/components/view.ink
  generateView(directory, registry);
  // - profile/components/form.ink
  generateForm(directory, registry);
  // - profile/components/filters.ink
  generateFilters(directory, registry);
  // - profile/components/table.ink
  generateTable(directory, registry);

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