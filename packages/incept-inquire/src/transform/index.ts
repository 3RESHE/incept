//stackpress
import type { PluginWithProject } from '@stackpress/incept/dist/types';
import Registry from '@stackpress/incept/dist/schema/Registry';
//local
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
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(props: PluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { schema, project } = props;
  const registry = new Registry(schema);

  //-----------------------------//
  // 2. Generators
  // - profile/actions.ts
  generateActions(project, registry);
  // - profile/events.ts
  // - events.ts
  generateEvents(project, registry);
  // - profile/schema.ts
  generateSchema(project, registry);

  //-----------------------------//
  // 3. profile/index.ts

  for (const model of registry.model.values()) {
    const filepath = `${model.name}/index.ts`;
    //load profile/index.ts if it exists, if not create it
    const source = project.getSourceFile(filepath) 
      || project.createSourceFile(filepath, '', { overwrite: true });
    //import action from './actions';
    source.addImportDeclaration({
      moduleSpecifier: `./actions`,
      defaultImport: 'actions'
    });
    //import events from './events';
    source.addImportDeclaration({
      moduleSpecifier: `./events`,
      defaultImport: 'events'
    });
    //import * as schema from './schema';
    source.addImportDeclaration({
      moduleSpecifier: `./schema`,
      defaultImport: '* as schema'
    });
    //export { actions, schema, event };
    source.addExportDeclaration({ 
      namedExports: [ 'actions', 'schema', 'events' ] 
    });
  }

  //-----------------------------//
  // 5. index.ts
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
    defaultImport: '* as store' 
  });
  //export { schema, registry };
  source.addExportDeclaration({ 
    namedExports: [ 'schema', 'store' ] 
  });
};