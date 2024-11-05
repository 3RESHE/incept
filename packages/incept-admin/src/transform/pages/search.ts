//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept/dist/config/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/admin/search.ts`;
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
    // import client from '../../client';
    source.addImportDeclaration({
      moduleSpecifier: '../../client',
      defaultImport: 'client'
    });
    // export default async function ProfileSearch(req: Request, res: Response) {
    source.addFunction({
      name: 'ProfileSearch',
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
        const authorization = session.authorize(req, res, [ '${model.dash}-search' ]);
        //if not authorized
        if (!authorization) return;
        //general settings
        const settings = { ...config.admin, session: authorization };
        //extract filters from url query
        let { q, filter, span, sort, skip, take } = req.query.get() as Record<string, unknown> & {
          q?: string,
          filter?: Record<string, string|number|boolean>,
          span?: Record<string, (string|number|null|undefined)[]>,
          sort?: Record<string, any>,
          skip?: number,
          take?: number
        };

        if (skip && !isNaN(Number(skip))) {
          skip = Number(skip);
        }

        if (take && !isNaN(Number(take))) {
          take = Number(take);
        }
        //search using the filters
        const response = await model.${model.camel}.action.search(
          { q, filter, span, sort, skip, take }
        );
        //if successfully searched
        if (response.code === 200) {
          //render the search page
          const ids = model.${model.camel}.config.ids.map(
            column => \`{{data.\${column.name}}}\`
          ).join('/');
          res.mimetype = 'text/html';
          res.body = await render('@stackpress/.incept/${model.name}/admin/search', { 
            q,
            filter, 
            span, 
            sort, 
            skip, 
            take, 
            settings,
            ...response,
            results: (response.results || []).map(data => ({
              ...data,
              _view: model.${model.camel}.config.render(
                \`\${config.admin.root}/${model.dash}/detail/\${ids}\`, 
                data
              )
            }))
          });
          return;
        }
        //it did not search, render error page
        res.mimetype = 'text/html';
        res.body = await render(error, { ...response, settings});
      `
    });
  }
};