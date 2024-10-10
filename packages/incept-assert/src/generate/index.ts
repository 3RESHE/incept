//types
import type { PluginWithCLIProps } from '@stackpress/idea-transformer';
//project
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import { Model, Fieldset, ensolute } from '@stackpress/incept-spec';
//generators
import generateSplit from './split';
import generateMain from './main';

// Sample idea config
//
// plugin "@stackpress/incept-assert" {
//   lang "ts"
//   asserts "./modules/[name]/assert"
// }
//
// or 
//
// plugin "@stackpress/incept-assert" {
//   lang "ts"
//   asserts "./modules/assert"
// }

/**
 * This is the The params comes form the cli
 */
export default function generate({ config, schema, cli }: PluginWithCLIProps) {
  //we need @stackpress/incept-ts
  if (!schema.plugin?.['@stackpress/incept-ts']) {
    return cli.terminal.error('@stackpress/incept-ts plugin is required');
  //we need an asserts path
  } else if (typeof config.asserts !== 'string') {
    return cli.terminal.error('Output path is required');
  }
  //short name for @stackpress/incept-ts
  const tsConfig = schema.plugin['@stackpress/incept-ts'];
  //get absolute types
  const types = typeof tsConfig.types === 'string' 
    ? ensolute(tsConfig.types, cli.cwd) as string
    : tsConfig.types as unknown as string;
  //recheck types
  if (!types) {
    return cli.terminal.error('Types path is invalid');
  }
  //populate model cache
  for (const name in schema.model) {
    Model.add(schema.model[name]);
  }
  //populate fieldset cache
  for (const name in schema.type) {
    Fieldset.add(schema.type[name]);
  }

  //asserts "modules/assert"
  //asserts "modules/[name]/assert"
  //asserts "./modules/assert"
  //asserts "./modules/[name]/validators"
  //asserts "../modules/validators"
  //asserts "../modules/[name]/validators"
  //asserts "env(OUTPUT)"
  const asserts = ensolute(config.asserts, cli.cwd);
  if (typeof asserts !== 'string') {
    return cli.terminal.error('Output path is invalid');
  }
  
  // /FULL_PATH/modules
  const dirname = asserts.includes(`${path.sep}[name]`) 
    ? asserts.split(`${path.sep}[name]`)[0]
    : asserts.includes('[name]') 
    ? asserts.split('[name]')[0]
    : path.dirname(asserts);
  //determine outfile
  const filename = path.extname(asserts) === '.ts'
    ? (
      asserts.split(dirname)[1].startsWith('/')
        //cannot have leading slash (will error)
        ? asserts.split(dirname)[1].substring(1)
        : asserts.split(dirname)[1]
    ): (
      asserts.split(dirname)[1].startsWith('/')
        //cannot have leading slash (will error)
        ? asserts.split(dirname)[1].substring(1) + '.ts'
        : asserts.split(dirname)[1] + '.ts'
    );
  //set up the ts-morph project
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      outDir: dirname,
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
  const source = project.createDirectory(dirname);
  //check if we need to split types by files 
  //or put it into one singular file
  if (asserts.includes('[name]')) {
    generateSplit(source, filename, asserts, types);
  } else {
    generateMain(source, filename, asserts, types);
  }
  //if you want ts, tsx files
  if ((config.lang || tsConfig.lang || 'ts') == 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
};