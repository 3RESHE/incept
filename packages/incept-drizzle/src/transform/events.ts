//modules
import type { Directory } from 'ts-morph';
//stackpress
import type Registry from '@stackpress/incept/dist/schema/Registry';
//common
import type { Config } from './types';

export default function generate(
  directory: Directory, 
  registry: Registry,
  config: Config
) {
  //loop through models
  for (const model of registry.model.values()) {
    const source = directory.createSourceFile(
      `${model.name}/events.ts`,
      '', 
      { overwrite: true }
    );
    //import * as actions from './actions';
    source.addImportDeclaration({
      moduleSpecifier: './actions',
      defaultImport: '* as actions'
    });
    //import { ServerRouter } from '@stackpress/ingest/dist/Router';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/ingest/dist/Router',
      namedImports: [ 'ServerRouter' ]
    });
    //import config from './config';
    source.addImportDeclaration({
      moduleSpecifier: `./config`,
      defaultImport: 'config'
    });
    //const emitter = new ServerRouter();
    source.addStatements(`
      const emitter = new ServerRouter();

      emitter.on('${model.dash}-create', function ${model.title}Create(req, res) {
        const input = config.input(req.data());
        const response = await actions.create(input);
        if (response.error) {
          res.setError(response);
        } else {
          res.setResults(response.results || {});
        }
      });

      emitter.on('${model.dash}-detail', function ${model.title}Create(req, res) {
        ${model.ids.map(
          (column, i) => `const id${i + 1} = req.data('${column.name}');`
        ).join('\n')}
        const response = await actions.detail(${model.ids.map(
          (_, i) => `id${i + 1}`
        ).join(', ')});
        if (response.error) {
          res.setError(response);
        } else {
          res.setResults(response.results || {});
        }
      });

      emitter.on('${model.dash}-remove', function ${model.title}Create(req, res) {
        ${model.ids.map(
          (column, i) => `const id${i + 1} = req.data('${column.name}');`
        ).join('\n')}
        const response = await actions.remove(${model.ids.map(
          (_, i) => `id${i + 1}`
        ).join(', ')});
        if (response.error) {
          res.setError(response);
        } else {
          res.setResults(response.results || {});
        }
      });

      emitter.on('${model.dash}-restore', function ${model.title}Create(req, res) {
        ${model.ids.map(
          (column, i) => `const id${i + 1} = req.data('${column.name}');`
        ).join('\n')}
        const response = await actions.restore(${model.ids.map(
          (_, i) => `id${i + 1}`
        ).join(', ')});
        if (response.error) {
          res.setError(response);
        } else {
          res.setResults(response.results || {});
        }
      });

      emitter.on('${model.dash}-search', function ${model.title}Create(req, res) {
        const response = await actions.search(req.data());
        if (response.error) {
          res.setError(response);
        } else {
          res.setRows(response.results || [], response.total || 0);
        }
      });

      emitter.on('${model.dash}-update', function ${model.title}Create(req, res) {
        ${model.ids.map(
          (column, i) => `const id${i + 1} = req.data('${column.name}');`
        ).join('\n')}
        const input = config.input(req.data());
        const response = await actions.detail(${model.ids.map(
          (_, i) => `id${i + 1}`
        ).join(', ')}, input);
        if (response.error) {
          res.setError(response);
        } else {
          res.setResults(response.results || {});
        }
      });

      export default emitter;
    `);
  }

  const source = directory.createSourceFile('events.ts', '', { 
    overwrite: true 
  });
  //import { ServerRouter } from '@stackpress/ingest/dist/Router';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/ingest/dist/Router',
    namedImports: [ 'ServerRouter' ]
  });
  //import profileEvents from './profile/events';
  for (const model of registry.model.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/events`,
      defaultImport: `${model.title}Events`
    });
  }
  //const emitter = new ServerRouter();
  source.addStatements(`
    const emitter = new ServerRouter();

    ${Array.from(registry.model.values()).map(
      model => `emitter.use(${model.title}Events);`
    ).join('\n')}

    export default emitter;
  `);
};