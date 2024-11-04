//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept-spec/dist/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/admin/update.ts`;
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
    // import type Session from '@stackpress/incept-session/dist/Session';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-session/dist/Session',
      defaultImport: 'Session'
    });
    // import type { InkPlugin } from '@stackpress/incept-ink/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/incept-ink/dist/types',
      namedImports: [ 'InkPlugin' ]
    });
    // import type { ProfileInput } from '../types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '../types',
      namedImports: [ 'ProfileInput' ]
    });
    // import client from '../../client';
    source.addImportDeclaration({
      moduleSpecifier: '../../client',
      defaultImport: 'client'
    });
    // export default async function ProfileCreate(req: Request, res: Response) {  
    source.addFunction({
      name: 'ProfileCreate',
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
        const error = '@stackpress/incept-admin/theme/error';
        //get authorization
        const authorization = session.authorize(req, res, [ '${model.dash}-update' ]);
        //if not authorized
        if (!authorization) return;
        //general settings
        const settings = { ...config.admin, session: authorization };
        //get url params
        const { params } = req.ctxFromRoute(
          \`\${config.admin.root}/${model.dash}/update/:id\`
        );
        //get id from url params
        const id = params.get('id');
        //if there is an id
        if (id) {
          //if form submitted
          if (req.method === 'POST') {
            //get form body
            const input = req.post.get() as Partial<ProfileInput>;
            //update the row using the id and the submitted input
            const response = await model.${model.camel}.action.update(id, input);
            //if successfully updated
            if (response.code === 200) {
              //redirect
              res.code = 302;
              res.status = 'Found';
              res.headers.set(
                'Location', 
                \`\${config.admin.root}/${model.dash}/detail/\${id}\`
              );
            }
            //it did not update...
            //set the errors
            if (response.errors) {
              res.errors.set(response.errors);
            }
            //recall the update form
            res.code = response.code as number;
            res.status = response.status as string;
            res.mimetype = 'text/html';
            res.body = await render(
              '@stackpress/.incept/${model.name}/admin/update', 
              { ...response, settings, input }
            );
            return;
          }
          //not submitted, fetch the data using the id
          const response = await model.${model.camel}.action.detail(id);
          //if successfully fetched
          if (response.code === 200) {
            //render the update page
            const input: Record<string, any> = { ...(response.results || {}) };
            const results: Record<string, any> = response.results || {};
            results.suggestion = model.${model.camel}.config.suggest(results);
            res.mimetype = 'text/html';
            res.body = await render(
              '@stackpress/.incept/${model.name}/admin/update', 
              { ...response, settings, results, input }
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