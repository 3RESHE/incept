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
        server.all(\`\${root}/${model.dash}/search\`, path.resolve(__dirname, 'pages/search'));
        server.all(\`\${root}/${model.dash}/create\`, path.resolve(__dirname, 'pages/create'));
        server.all(\`\${root}/${model.dash}/detail/${ids}\`, path.resolve(__dirname, 'pages/detail'));
        server.all(\`\${root}/${model.dash}/export\`, path.resolve(__dirname, 'pages/export'));
        server.all(\`\${root}/${model.dash}/import\`, path.resolve(__dirname, 'pages/import'));
        server.all(\`\${root}/${model.dash}/update/${ids}\`, path.resolve(__dirname, 'pages/update'));
        server.all(\`\${root}/${model.dash}/remove/${ids}\`, path.resolve(__dirname, 'pages/remove'));
        server.all(\`\${root}/${model.dash}/restore/${ids}\`, path.resolve(__dirname, 'pages/restore'));
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