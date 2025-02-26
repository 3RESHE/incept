//stackpress
import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//incept
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
import type Model from '@stackpress/incept/dist/schema/Model';
//common
import type { AdminConfig } from '../types';

export default function AdminDetailPageFactory(model: Model) {
  return async function AdminDetailPage(req: ServerRequest, res: Response) {
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
    //get the renderer
    const { render } = server.plugin<TemplatePlugin>('template');
    //determine the templates
    const config = server.config.withPath;
    const module = config.get<string>('build.module');
    const error = '@stackpress/incept-admin/dist/components/error';
    const template = `${module}/${model.name}/admin/templates/detail`;
    //get id from url params
    const ids = model.ids.map(column => req.data(column.name)).filter(Boolean);
    if (ids.length === model.ids.length) {
      //emit detail event
      const response = await server.call<UnknownNest>(`${model.dash}-detail`, req);
      //if they want json (success or fail)
      if (req.data.has('json')) {
        return res.setJSON(response);
      }
      //if successfully fetched
      if (response.code === 200) {
        //render the detail page
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
  };
};