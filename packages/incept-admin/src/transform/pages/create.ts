//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import type Registry from '@stackpress/incept/dist/schema/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/admin/create.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
  
    // import type { ServerRequest } from '@stackpress/ingest/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/types',
      namedImports: [ 'ServerRequest' ]
    });
    // import type Response from '@stackpress/ingest/dist/Response';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/Response',
      defaultImport: 'Response'
    });
    // import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-ink/dist/types',
      namedImports: [ 'TemplatePlugin' ]
    });
    // import type { AdminConfig } from '@stackpress/incept-admin/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-admin/dist/types',
      namedImports: [ 'AdminConfig' ]
    });
    // import type { ProfileInput } from '../types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '../types',
      namedImports: [ `${model.title}Input` ]
    });
    //const template = '@stackpress/.incept/${model.name}/admin/create';
    source.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: 'template',
          initializer: `'@stackpress/.incept/${model.name}/admin/create'`
        }
      ]
    });
    // export default async function ProfileCreate(req: ServerRequest, res: Response) {  
    source.addFunction({
      name: `Admin${model.title}Create`,
      isAsync: true,
      isDefaultExport: true,
      parameters: [
        { name: 'req', type: 'ServerRequest' }, 
        { name: 'res', type: 'Response' }
      ],
      statements: `
        //get the server
        const server = req.context;
        //get authorization
        const authorized = await server.call('authorize', req, res);
        //if not authorized
        if (authorized.code !== 200) {
          return;
        }
        //get the admin config
        const admin = server.config<AdminConfig['admin']>('admin') || {};
        const root = admin.root || '/admin';
        //general settings
        const settings = { ...admin, session: authorized.results };
        //get the renderer
        const { render } = server.plugin<TemplatePlugin>('template');
        //if form submitted
        if (req.method === 'POST') {
          //emit the create event
          const response = await server.call('${model.dash}-create', req);
          //if they want json (success or fail)
          if (req.data.has('json')) {
            return res.setJSON(response);
          }
          //if successfully created
          if (response.code === 200) {
            //redirect
            return res.redirect(
              \`\${root}/${model.dash}/detail/\${response.results?.id}\`
            );
          }
          //it did not create...
          //recall the create form
          return res.setHTML(await render(template, { 
            ...response, 
            input: req.data(),
            settings
          }), response.code || 400);
        }
        //show form
        return res.setHTML(await render(template, { settings }));
      `
    });
  }
};