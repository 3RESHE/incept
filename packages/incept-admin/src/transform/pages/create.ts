//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept/dist/config/Registry';

export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/admin/create.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
  
    // import type Request from '@stackpress/ingest/dist/Request';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/Request',
      defaultImport: 'Request'
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
    // import type { ProfileInput } from '../types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '../types',
      namedImports: [ `${model.title}Input` ]
    });
    // import client from '../../client';
    source.addImportDeclaration({
      moduleSpecifier: '../../client',
      defaultImport: 'client'
    });
    // export default async function ProfileCreate(req: Request, res: Response) {  
    source.addFunction({
      name: `Admin${model.title}Create`,
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
        const session = project.plugin<Session>('session');
        //get the renderer
        const { render } = project.plugin<InkPlugin>('template');
        //get authorization
        const authorization = session.authorize(req, res, [ '${model.dash}-create' ]);
        //if not authorized
        if (!authorization) return;
        //general settings
        const settings = { ...config.admin, session: authorization };
        //if form submitted
        if (req.method === 'POST') {
          //get form body
          const input = req.post.get() as ProfileInput;
          const response = await model.${model.camel}.action.create(input);
          //if successfully created
          if (response.code === 200) {
            //redirect
            return res.redirect(
              \`\${config.admin.root}/${model.dash}/detail/\${response.results?.id}\`
            );
          }
          //it did not create...
          //set the errors
          if (response.errors) {
            res.errors.set(response.errors);
          }
          //recall the create form
          return res.setHTML(await render(
            '@stackpress/.incept/${model.name}/admin/create', 
            { ...response, input, settings }
          ), response.code as number);
        }
        //show form
        return res.setHTML(await render(
          '@stackpress/.incept/${model.name}/admin/create', 
          { settings }
        ));
      `
    });
  }
};