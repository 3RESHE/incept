//stackpress
import type { PluginWithProject } from '@stackpress/incept/dist/types';
import Registry from '@stackpress/incept/dist/schema/Registry';
import { enval } from '@stackpress/incept/dist/schema/helpers';
//local
import generateStore from './store';
import generateSchema from './schema';
import generateActions from './actions';
import generateEvents from './events';

/**
 * @stackpress/.incept (file structure)
 * - profile/
 * | - actions.ts
 * | - events.ts
 * | - index.ts
 * | - schema.ts
 * - index.ts
 * - events.ts
 * - schema.ts
 * - store.ts
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(props: PluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { config, schema, project } = props;
  const registry = new Registry(schema);
  //determine url
  const url = enval<string>(config.url || 'env(DATABASE_URL)');
  //determine engine
  const engine = enval<string>(config.engine || 'pglite');

  //-----------------------------//
  // 2. Generators
  // - store.ts
  generateStore(project, registry, { url, engine });
  // - profile/schema.ts
  generateSchema(project, registry, { url, engine });
  // - profile/actions.ts
  generateActions(project, registry, { url, engine });
  // - profile/events.ts
  generateEvents(project, registry, { url, engine });

  //-----------------------------//
  // 3. profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //import * as action from './actions';
    source.addImportDeclaration({
      moduleSpecifier: `./actions`,
      defaultImport: '* as action'
    });
    //import events from './events';
    source.addImportDeclaration({
      moduleSpecifier: `./events`,
      defaultImport: 'events'
    });
    //import schema from './schema';
    source.addImportDeclaration({
      moduleSpecifier: `./schema`,
      defaultImport: 'schema'
    });
    //export { action, schema, event };
    source.addExportDeclaration({ 
      namedExports: [ 'action', 'schema', 'events' ] 
    });
  }

  //-----------------------------//
  // 4. index.ts
  //load index.ts if it exists, if not create it
  const source = project.getSourceFile('index.ts') 
    || project.createSourceFile('index.ts', '', { overwrite: true });
  //import * as schema from './schema';
  source.addImportDeclaration({ 
    moduleSpecifier: './schema', 
    defaultImport: '* as schema' 
  });
  //import * as store from './store';
  source.addImportDeclaration({ 
    moduleSpecifier: './store', 
    defaultImport: 'store' 
  });
  //export { schema, registry };
  source.addExportDeclaration({ 
    namedExports: [ 'schema', 'store' ] 
  });
};