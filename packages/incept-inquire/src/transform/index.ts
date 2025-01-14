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
 * | - actions/
 * | | - batch.ts
 * | | - create.ts
 * | | - detail.ts
 * | | - get.ts
 * | | - index.ts
 * | | - remove.ts
 * | | - restore.ts
 * | | - search.ts
 * | | - update.ts
 * | | - upsert.ts
 * | - events/
 * | | - batch.ts
 * | | - create.ts
 * | | - detail.ts
 * | | - get.ts
 * | | - index.ts
 * | | - remove.ts
 * | | - restore.ts
 * | | - search.ts
 * | | - update.ts
 * | | - upsert.ts
 * | - index.ts
 * | - schema.ts
 */

/**
 * This is the The params comes form the cli
 */
export default async function generate(props: PluginWithProject) {
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
      moduleSpecifier: './actions',
      defaultImport: 'actions'
    });
    //import events from './events';
    source.addImportDeclaration({
      moduleSpecifier: './events',
      defaultImport: 'events'
    });
    //import schema from './schema';
    source.addImportDeclaration({
      moduleSpecifier: './schema',
      defaultImport: 'schema'
    });
    //export { actions, schema, events };
    source.addExportDeclaration({ 
      namedExports: [ 'actions', 'schema', 'events' ] 
    });
  }
};