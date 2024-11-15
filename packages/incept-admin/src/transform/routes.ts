//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept/dist/config/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const ids = model.ids.map(column => `:${column.name}`).join('/')
    const file = `${model.name}/admin/routes.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //import type { MethodRouter } from '@stackpress/incept/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept/dist/types',
      namedImports: [ 'MethodRouter' ]
    });
    //import path from 'path';
    source.addImportDeclaration({
      moduleSpecifier: 'path',
      defaultImport: 'path'
    });
    //export default function route(root: string, router: MethodRouter) {}
    source.addFunction({
      isDefaultExport: true,
      name: 'route',
      parameters: [
        { name: 'root', type: 'string' },
        { name: 'router', type: 'MethodRouter' }
      ],
      statements: `
        router.all(\`\${root}/${model.dash}/search\`, path.resolve(__dirname, 'search'));
        router.all(\`\${root}/${model.dash}/create\`, path.resolve(__dirname, 'create'));
        router.all(\`\${root}/${model.dash}/detail/${ids}\`, path.resolve(__dirname, 'detail'));
        router.all(\`\${root}/${model.dash}/update/${ids}\`, path.resolve(__dirname, 'update'));
        router.all(\`\${root}/${model.dash}/remove/${ids}\`, path.resolve(__dirname, 'remove'));
        router.all(\`\${root}/${model.dash}/restore/${ids}\`, path.resolve(__dirname, 'restore'));
      `.trim()
    });
  }
};