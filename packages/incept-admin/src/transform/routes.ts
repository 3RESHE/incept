//modules
import type { Directory } from 'ts-morph';
//stackpress
import type Registry from '@stackpress/incept/dist/schema/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const ids = model.ids.map(column => `:${column.name}`).join('/')
    const file = `${model.name}/admin/routes.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
    // import type { AdminConfig } from '@stackpress/incept-admin/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-admin/dist/types',
      namedImports: [ 'AdminConfig' ]
    });
    //import type Server from '@stackpress/ingest/dist/Server';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/Server',
      defaultImport: 'Server'
    });
    //import path from 'path';
    source.addImportDeclaration({
      moduleSpecifier: 'path',
      defaultImport: 'path'
    });
    //export default function route(server: Server) {}
    source.addFunction({
      isDefaultExport: true,
      name: 'routes',
      parameters: [
        { name: 'server', type: 'Server' }
      ],
      statements: `
        //get the admin config
        const admin = server.config<AdminConfig['admin']>('admin') || {};
        const root = admin.root || '/admin';
        server.all(\`\${root}/${model.dash}/search\`, path.resolve(__dirname, 'search'));
        server.all(\`\${root}/${model.dash}/create\`, path.resolve(__dirname, 'create'));
        server.all(\`\${root}/${model.dash}/detail/${ids}\`, path.resolve(__dirname, 'detail'));
        server.all(\`\${root}/${model.dash}/update/${ids}\`, path.resolve(__dirname, 'update'));
        server.all(\`\${root}/${model.dash}/remove/${ids}\`, path.resolve(__dirname, 'remove'));
        server.all(\`\${root}/${model.dash}/restore/${ids}\`, path.resolve(__dirname, 'restore'));
      `.trim()
    });
  }

  const source = directory.createSourceFile('admin.ts', '', { 
    overwrite: true 
  });
  //import profileRoutes from './profile/admin/routes';
  for (const model of registry.model.values()) {
    source.addImportDeclaration({
      moduleSpecifier: `./${model.name}/admin/routes`,
      defaultImport: `${model.camel}Routes`
    });
  }

  //export default function route(router: MethodRouter) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'admin',
    parameters: [
      { name: 'server', type: 'Server' }
    ],
    statements: `
      ${Array.from(registry.model.values()).map(
        model => `${model.camel}Routes(server);`
      ).join('\n')}
    `.trim()
  });
};