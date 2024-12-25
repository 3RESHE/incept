//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress
import type Registry from '@stackpress/incept/dist/schema/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/admin/restore.ts`;
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
    //const error = '@stackpress/incept-admin/dist/components/error';
    //const template = '@stackpress/.incept/${model.name}/admin/restore';
    source.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: 'error',
          initializer: `'@stackpress/incept-admin/dist/components/error'`
        },
        {
          name: 'template',
          initializer: `'@stackpress/.incept/${model.name}/admin/restore'`
        }
      ]
    });
    // export default async function ProfileRestore(req: ServerRequest, res: Response) {
    source.addFunction({
      name: `Admin${model.title}Restore`,
      isAsync: true,
      isDefaultExport: true,
      parameters: [
        { name: 'req', type: 'ServerRequest' }, 
        { name: 'res', type: 'Response' }
      ],
      statements: `
        //if there is a response body or there is an error code
        if (res.body || (res.code && res.code !== 200)) {
          //let the response pass through
          return;
        }
        //get the server
        const server = req.context;
        //get session
        const session = await server.call('me', req);
        //get the admin config
        const admin = server.config<AdminConfig['admin']>('admin') || {};
        const root = admin.root || '/admin';
        //get the renderer
        const { render } = server.plugin<TemplatePlugin>('template');
        //get id from url params
        ${model.ids.map(
          (column, i) => `const id${i + 1} = req.data('${column.name}');`
        ).join('\n        ')}
        //if there is an id
        if (${model.ids.map((_, i) => `id${i + 1}`).join(' && ')}) {
          //if confirmed
          if (req.query('confirmed')) {
            //emit restore event
            const response = await server.call('${model.dash}-restore', req);
            //if they want json (success or fail)
            if (req.data.has('json')) {
              return res.setJSON(response);
            }
            //if successfully restored
            if (response.code === 200) {
              //redirect
              return res.redirect(
                \`\${root}/${model.dash}/detail/${
                  model.ids.map((_, i) => `\${id${i + 1}}`).join('/')
                }\`
              );
            }
            //not restored, render error page
            return res.setHTML(await render(error, { 
              ...response, 
              settings: admin,
              session: session.results 
            }));
          }
          const response = await server.call('${model.dash}-detail', req);
          //if they want json (success or fail)
          if (req.data.has('json')) {
            return res.setJSON(response);
          }
          //if successfully fetched
          if (response.code === 200) {
            //render the restore page
            return res.setHTML(await render(template, { 
              ...response, 
              settings: admin, 
              session: session.results 
            }));
          }
          //it did not fetch, render error page
          return res.setHTML(await render(error, { 
            ...response, 
            settings: admin,
            session: session.results
          }));
        }
        //if they want json (success or fail)
        if (req.data.has('json')) {
          return res.setJSON({ code: 404, status: 'Not Found' });
        }
        //no id was found, render error page (404)
        res.setHTML(await render(error, { 
          code: 404, 
          status: 'Not Found',
          settings: admin,
          session: session.results 
        }));
      `
    });
  }
};