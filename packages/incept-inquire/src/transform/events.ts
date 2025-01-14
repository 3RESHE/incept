//modules
import type { Directory } from 'ts-morph';
//stackpress
import type Model from '@stackpress/incept/dist/schema/Model';
import type Registry from '@stackpress/incept/dist/schema/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    // - profile/events/batch.ts
    event('batch', model, directory);
    // - profile/events/create.ts
    event('create', model, directory);
    // - profile/events/detail.ts
    event('detail', model, directory);
    // - profile/events/get.ts
    event('get', model, directory);
    // - profile/events/remove.ts
    event('remove', model, directory);
    // - profile/events/restore.ts
    event('restore', model, directory);
    // - profile/events/search.ts
    event('search', model, directory);
    // - profile/events/update.ts
    event('update', model, directory);
    // - profile/events/upsert.ts
    event('upsert', model, directory);
    // - profile/events/index.ts
    const source = directory.createSourceFile(
      `${model.name}/events/index.ts`,
      '', 
      { overwrite: true }
    );
    //import path from 'path';
    source.addImportDeclaration({
      moduleSpecifier: 'path',
      defaultImport: 'path'
    });
    //import { ServerRouter } from '@stackpress/ingest/dist/Router';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/ingest/dist/Router',
      namedImports: [ 'ServerRouter' ]
    });
    //const emitter = new ServerRouter();
    source.addStatements(`
      const emitter = new ServerRouter();

      emitter.on('${model.dash}-batch', path.resolve(__dirname, 'batch'));
      emitter.on('${model.dash}-create', path.resolve(__dirname, 'create'));
      emitter.on('${model.dash}-detail', path.resolve(__dirname, 'detail'));
      emitter.on('${model.dash}-get', path.resolve(__dirname, 'get'));
      emitter.on('${model.dash}-remove', path.resolve(__dirname, 'remove'));
      emitter.on('${model.dash}-restore', path.resolve(__dirname, 'restore'));
      emitter.on('${model.dash}-search', path.resolve(__dirname, 'search'));
      emitter.on('${model.dash}-update', path.resolve(__dirname, 'update'));
      emitter.on('${model.dash}-upsert', path.resolve(__dirname, 'upsert'));

      export default emitter;
    `);
    //export { create, detail, ... }
    source.addExportDeclaration({
      namedExports: [
        'batch',
        'create',
        'detail',
        'get',
        'remove',
        'restore',
        'search',
        'update',
        'upsert'
      ]
    });
  }
};

export function event(action: string, model: Model, directory: Directory) {
  const lower = action.toLowerCase();
  const title = action.charAt(0).toUpperCase() + action.slice(1);
  const source = directory.createSourceFile(
    `${model.name}/events/${lower}.ts`,
    '', 
    { overwrite: true }
  );
  //import create from '@stackpress/incept-inquire/dist/events/create';
  source.addImportDeclaration({
    moduleSpecifier: `@stackpress/incept-inquire/dist/events/${lower}`,
    defaultImport: lower
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: `../config`,
    defaultImport: 'config'
  });
  //export default function ProfileCreateEvent(req: ServerRequest, res: Response)
  source.addFunction({
    name: `${model.title}${title}Event`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'ServerRequest' },
      { name: 'res', type: 'Response' }
    ],
    statements: (`return ${lower}(config)(req, res);`)
  });
};