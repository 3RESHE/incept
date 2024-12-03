//types
import type { Directory } from 'ts-morph';
import Registry from '@stackpress/incept/dist/config/Registry';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  const source = directory.createSourceFile('incept.build.ts', '', { overwrite: true });
  //import type Builder from '@stackpress/ingest/dist/buildtime/Builder';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest/dist/buildtime/Builder',
    defaultImport: 'Builder'
  });
  //import path from 'path';
  source.addImportDeclaration({
    moduleSpecifier: 'path',
    defaultImport: 'path'
  });
  for (const model of registry.model.values()) {
    //import ProfileRoutes from './Profile/admin/routes';
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/admin/routes`,
      defaultImport: `${model.camel}Routes`
    });
  }
  //export function plugin(builder: Builder) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'plugin',
    parameters: [
      { name: 'builder', type: 'Builder' }
    ],
    statements: `
      //generate some code in the client folder
      builder.on('route', req => {
        const root = builder.config<string>('admin', 'root');
        ${Array.from(registry.model.values()).map(
          model => `${model.camel}Routes(root, builder.router);`
        ).join('\n  ')}
      });
    `.trim()
  });
};