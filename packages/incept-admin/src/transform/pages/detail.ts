//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept/dist/config/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/admin/detail.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
  
    // import type Context from '@stackpress/ingest/dist/Context';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/Context',
      defaultImport: 'Context'
    });
    // import type Response from '@stackpress/ingest/dist/Response';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/Response',
      defaultImport: 'Response'
    });
    // import type Session from '@stackpress/incept-user/dist/Session';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-user/dist/Session',
      defaultImport: 'Session'
    });
    // import type { InkPlugin } from '@stackpress/incept-ink/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-ink/dist/types',
      namedImports: [ 'InkPlugin' ]
    });
    // import client from '../../client';
    source.addImportDeclaration({
      moduleSpecifier: '../../client',
      defaultImport: 'client'
    });
    // export default async function ProfileDetail(req: Context, res: Response) {
    source.addFunction({
      name: `Admin${model.title}Detail`,
      isAsync: true,
      isDefaultExport: true,
      parameters: [
        { name: 'req', type: 'Context' }, 
        { name: 'res', type: 'Response' }
      ],
      statements: `
        //extract project and model from client
        const { project, model } = client;
        //bootstrap plugins
        await project.bootstrap();
        //get the project config
        const config = project.config<Record<string, any>>();
        //get the session
        const session = project.plugin<Session>('session');
        //get the renderer
        const { render } = project.plugin<InkPlugin>('template');
        //prep error page
        const error = '@stackpress/incept-admin/dist/components/error';
        //get authorization
        const authorization = session.authorize(req, res, [ '${model.dash}-detail' ]);
        //if not authorized
        if (!authorization) return;
        //general settings
        const settings = { ...config.admin, session: authorization };
        //get id from url params
        ${model.ids.map(
          (column, i) => `const id${i + 1} = req.data('${column.name}');`
        ).join('\n        ')}
        //if there is an id
        if (${model.ids.map((_, i) => `id${i + 1}`).join(' && ')}) {
          //fetch the data using the id
          const response = await model.${model.camel}.action.detail(${
            model.ids.map((_, i) => `id${i + 1}`).join(', ')
          });
          //if successfully fetched
          if (response.code === 200) {
            if (req.query.has('json')) {
              return res.setJSON(response);
            }
            //render the detail page
            return res.setHTML(await render(
              '@stackpress/.incept/${model.name}/admin/detail', 
              { ...response, settings }
            ));
          }
          //it did not fetch, render error page
          return res.setHTML(await render(error, { ...response, settings }));
        }
        //no id was found, render error page (404)
        res.setHTML(await render(error, { 
          code: 404, 
          status: 'Not Found',
          settings
        }));
      `
    });
  }
};