//modules
import type { Directory } from 'ts-morph';
//stackpress
import type Model from '@stackpress/incept/dist/schema/Model';
import type Registry from '@stackpress/incept/dist/schema/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    // - profile/events/create.ts
    create(model, directory);
    // - profile/events/detail.ts
    detail(model, directory);
    // - profile/events/remove.ts
    remove(model, directory);
    // - profile/events/restore.ts
    restore(model, directory);
    // - profile/events/search.ts
    search(model, directory);
    // - profile/events/update.ts
    update(model, directory);
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

      emitter.on('${model.dash}-create', path.resolve(__dirname, 'create'));
      emitter.on('${model.dash}-detail', path.resolve(__dirname, 'detail'));
      emitter.on('${model.dash}-remove', path.resolve(__dirname, 'remove'));
      emitter.on('${model.dash}-restore', path.resolve(__dirname, 'restore'));
      emitter.on('${model.dash}-search', path.resolve(__dirname, 'search'));
      emitter.on('${model.dash}-update', path.resolve(__dirname, 'update'));

      export default emitter;
    `);
  }
};

export function create(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/events/create.ts`,
    '', 
    { overwrite: true }
  );

  //import type { ServerRequest } from '@stackpress/ingest/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/types',
    namedImports: [ 'ServerRequest' ]
  });
  //import type Response from '@stackpress/ingest/dist/Response';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/Response',
    defaultImport: 'Response'
  });
  //import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/incept-inquire/dist/types',
    namedImports: [ 'DatabasePlugin' ]
  });
  //import config from '../config';
  source.addImportDeclaration({
    moduleSpecifier: '../config',
    defaultImport: 'config'
  });
  //import actions from '../actions';
  source.addImportDeclaration({
    moduleSpecifier: '../actions',
    defaultImport: 'actions'
  });

  source.addFunction({
    name: `${model.title}Create`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'ServerRequest' },
      { name: 'res', type: 'Response' }
    ],
    statements: (`
      const store = req.context.plugin<DatabasePlugin>('database');
      if (!store) return;
      const input = config.input(req.data());
      const response = await actions(store).create(input);
      res.fromStatusResponse(response);
    `)
  })
};

export function detail(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/events/detail.ts`,
    '', 
    { overwrite: true }
  );

  //import type { ServerRequest } from '@stackpress/ingest/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/types',
    namedImports: [ 'ServerRequest' ]
  });
  //import type Response from '@stackpress/ingest/dist/Response';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/Response',
    defaultImport: 'Response'
  });
  //import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/incept-inquire/dist/types',
    namedImports: [ 'DatabasePlugin' ]
  });
  //import actions from '../actions';
  source.addImportDeclaration({
    moduleSpecifier: '../actions',
    defaultImport: 'actions'
  });

  source.addFunction({
    name: `${model.title}Detail`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'ServerRequest' },
      { name: 'res', type: 'Response' }
    ],
    statements: (`
      const store = req.context.plugin<DatabasePlugin>('database');
      if (!store) return;
      ${model.ids.map(
        (column, i) => `const id${i + 1} = req.data('${column.name}');`
      ).join('\n')}
      const response = await actions(store).detail(${model.ids.map(
        (_, i) => `id${i + 1}`
      ).join(', ')});
      if (response.code === 200 && !response.results) {
        response.code = 404;
        response.status = 'Not Found';
      }
      res.fromStatusResponse(response);
    `)
  })
};

export function remove(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/events/remove.ts`,
    '', 
    { overwrite: true }
  );

  //import type { ServerRequest } from '@stackpress/ingest/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/types',
    namedImports: [ 'ServerRequest' ]
  });
  //import type Response from '@stackpress/ingest/dist/Response';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/Response',
    defaultImport: 'Response'
  });
  //import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/incept-inquire/dist/types',
    namedImports: [ 'DatabasePlugin' ]
  });
  //import actions from '../actions';
  source.addImportDeclaration({
    moduleSpecifier: '../actions',
    defaultImport: 'actions'
  });

  source.addFunction({
    name: `${model.title}Remove`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'ServerRequest' },
      { name: 'res', type: 'Response' }
    ],
    statements: (`
      const store = req.context.plugin<DatabasePlugin>('database');
      if (!store) return;
      ${model.ids.map(
        (column, i) => `const id${i + 1} = req.data('${column.name}');`
      ).join('\n')}
      const response = await actions(store).remove(${model.ids.map(
        (_, i) => `id${i + 1}`
      ).join(', ')});
      res.fromStatusResponse(response);
    `)
  });
};

export function restore(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/events/restore.ts`,
    '', 
    { overwrite: true }
  );

  //import type { ServerRequest } from '@stackpress/ingest/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/types',
    namedImports: [ 'ServerRequest' ]
  });
  //import type Response from '@stackpress/ingest/dist/Response';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/Response',
    defaultImport: 'Response'
  });
  //import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/incept-inquire/dist/types',
    namedImports: [ 'DatabasePlugin' ]
  });
  //import actions from '../actions';
  source.addImportDeclaration({
    moduleSpecifier: '../actions',
    defaultImport: 'actions'
  });

  source.addFunction({
    name: `${model.title}Restore`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'ServerRequest' },
      { name: 'res', type: 'Response' }
    ],
    statements: (`
      const store = req.context.plugin<DatabasePlugin>('database');
      if (!store) return;
      ${model.ids.map(
        (column, i) => `const id${i + 1} = req.data('${column.name}');`
      ).join('\n')}
      const response = await actions(store).restore(${model.ids.map(
        (_, i) => `id${i + 1}`
      ).join(', ')});
      res.fromStatusResponse(response);
    `)
  });
};

export function search(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/events/search.ts`,
    '', 
    { overwrite: true }
  );

  //import type { ServerRequest } from '@stackpress/ingest/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/types',
    namedImports: [ 'ServerRequest' ]
  });
  //import type Response from '@stackpress/ingest/dist/Response';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/Response',
    defaultImport: 'Response'
  });
  //import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/incept-inquire/dist/types',
    namedImports: [ 'DatabasePlugin' ]
  });
  //import actions from '../actions';
  source.addImportDeclaration({
    moduleSpecifier: '../actions',
    defaultImport: 'actions'
  });

  source.addFunction({
    name: `${model.title}Search`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'ServerRequest' },
      { name: 'res', type: 'Response' }
    ],
    statements: (`
      const store = req.context.plugin<DatabasePlugin>('database');
      if (!store) return;
      const response = await actions(store).search(req.data());
      res.fromStatusResponse(response);
    `)
  });
};

export function update(model: Model, directory: Directory) {
  const source = directory.createSourceFile(
    `${model.name}/events/update.ts`,
    '', 
    { overwrite: true }
  );

  //import type { ServerRequest } from '@stackpress/ingest/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/types',
    namedImports: [ 'ServerRequest' ]
  });
  //import type Response from '@stackpress/ingest/dist/Response';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/Response',
    defaultImport: 'Response'
  });
  //import type { DatabasePlugin } from '@stackpress/incept-inquire/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/incept-inquire/dist/types',
    namedImports: [ 'DatabasePlugin' ]
  });
  //import actions from '../actions';
  source.addImportDeclaration({
    moduleSpecifier: '../actions',
    defaultImport: 'actions'
  });

  source.addFunction({
    name: `${model.title}Update`,
    isAsync: true,
    isDefaultExport: true,
    parameters: [
      { name: 'req', type: 'ServerRequest' },
      { name: 'res', type: 'Response' }
    ],
    statements: (`
      const store = req.context.plugin<DatabasePlugin>('database');
      if (!store) return;
      ${model.ids.map(
        (column, i) => `const id${i + 1} = req.data('${column.name}');`
      ).join('\n')}
      const input = config.input(req.data());
      const response = await actions(store).update(${model.ids.map(
        (_, i) => `id${i + 1}`
      ).join(', ')}, input);
      res.fromStatusResponse(response);
    `)
  });
};