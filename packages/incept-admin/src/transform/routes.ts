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
        const router = server.withImports;
        router.all(\`\${root}/${model.dash}/search\`, () => import('./pages/search'));
        router.all(\`\${root}/${model.dash}/create\`, () => import('./pages/create'));
        router.all(\`\${root}/${model.dash}/detail/${ids}\`, () => import('./pages/detail'));
        router.all(\`\${root}/${model.dash}/export\`, () => import('./pages/export'));
        router.all(\`\${root}/${model.dash}/import\`, () => import('./pages/import'));
        router.all(\`\${root}/${model.dash}/update/${ids}\`, () => import('./pages/update'));
        router.all(\`\${root}/${model.dash}/remove/${ids}\`, () => import('./pages/remove'));
        router.all(\`\${root}/${model.dash}/restore/${ids}\`, () => import('./pages/restore'));
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