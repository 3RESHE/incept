//stackpress
import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//incept
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
import type Model from '@stackpress/incept/dist/schema/Model';
//common
import type { AdminConfig } from '../types';

export default function AdminCreatePageFactory(model: Model) {
  return async function AdminCreatePage(req: ServerRequest, res: Response) {
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
    //determine the template
    const config = server.config.withPath;
    const module = config.get<string>('client.module');
    const template = `${module}/${model.name}/admin/templates/create`;
    //get the renderer
    const { render } = server.plugin<TemplatePlugin>('template');
    //if form submitted
    if (req.method === 'POST') {
      //emit the create event
      const response = await server.call<UnknownNest>(`${model.dash}-create`, req);
      //if they want json (success or fail)
      if (req.data.has('json')) {
        return res.setJSON(response);
      }
      //if successfully created
      if (response.code === 200) {
        //redirect
        return res.redirect(
          `${root}/${model.dash}/detail/${response.results?.id}`
        );
      }
      //it did not create...
      //recall the create form
      return res.setHTML(await render(template, { 
        ...response, 
        input: req.data(),
        settings: admin,
        session: session.results,
      }), response.code || 400);
    }
    //show form
    return res.setHTML(await render(template, { 
      settings: admin,
      session: session.results 
    }));
  };
};