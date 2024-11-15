//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept/dist/config/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/admin/restore.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
  
    // import type Request from '@stackpress/ingest/dist/payload/Request';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/payload/Request',
      defaultImport: 'Request'
    });
    // import type Response from '@stackpress/ingest/dist/payload/Response';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/payload/Response',
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
    // export default async function ProfileRestore(req: Request, res: Response) {
    source.addFunction({
      name: `Admin${model.name}Restore`,
      isAsync: true,
      isDefaultExport: true,
      parameters: [
        { name: 'req', type: 'Request' }, 
        { name: 'res', type: 'Response' }
      ],
      statements: `
        //extract project and model from client
        const { project, model } = client;
        //bootstrap plugins
        await project.bootstrap();
        //get the project config
        const config = project.config.get<Record<string, any>>();
        //get the session
        const session = project.get<Session>('session');
        //get the renderer
        const { render } = project.get<InkPlugin>('template');
        //prep error page
        const error = '@stackpress/incept-admin/dist/components/error';
        //get authorization
        const authorization = session.authorize(req, res, [ '${model.dash}-restore' ]);
        //if not authorized
        if (!authorization) return;
        //general settings
        const settings = { ...config.admin, session: authorization };
        //get url params
        const { params } = req.ctxFromRoute(
          \`\${config.admin.root}/${model.dash}/restore/${
            model.ids.map(column => `:${column.name}`).join('/')
          }\`
        );
        //get id from url params
        ${model.ids.map(
          (column, i) => `const id${i + 1} = params.get('${column.name}');`
        ).join('\n        ')}
        //if there is an id
        if (${model.ids.map((_, i) => `id${i + 1}`).join(' && ')}) {
          //if confirmed
          if (req.query.get<string>('confirmed')) {
            //restore the row using the id
            const response = await model.${model.camel}.action.restore(${
              model.ids.map((_, i) => `id${i + 1}`).join(', ')
            });
            //if successfully restored
            if (response.code === 200) {
              //redirect
              res.code = 302;
              res.status = 'Found';
              res.headers.set(
                'Location', 
                \`\${config.admin.root}/${model.dash}/detail/${
                  model.ids.map((_, i) => `\${id${i + 1}}`).join('/')
                }\`
              );
              return;
            }
            //not restored, render error page
            res.mimetype = 'text/html';
            res.body = await render(error, { ...response, settings });
            return;
          }
          //not confirmed, fetch the data using the id
          const response = await model.${model.camel}.action.detail(${
            model.ids.map((_, i) => `id${i + 1}`).join(', ')
          });
          //if successfully fetched
          if (response.code === 200) {
            //render the restore page
            res.mimetype = 'text/html';
            res.body = await render(
              '@stackpress/.incept/${model.name}/admin/restore', 
              { ...response, settings }
            );
            return;
          }
          //it did not fetch, render error page
          res.mimetype = 'text/html';
          res.body = await render(error, { ...response, settings });
          return;
        }
        //no id was found, render error page (404)
        res.mimetype = 'text/html';
        res.body = await render(error, { 
          code: 404, 
          status: 'Not Found',
          settings 
        });
      `
    });
  }
};