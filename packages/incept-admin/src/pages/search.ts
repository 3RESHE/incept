//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//incept
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
import type Model from '@stackpress/incept/dist/schema/Model';
//common
import type { AdminConfig } from '../types';

export default function AdminSearchPageFactory(model: Model) {
  return async function AdminSearchPage(req: ServerRequest, res: Response) {
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
    const module = server.config.path<string>('client.module');
    const error = '@stackpress/incept-admin/dist/components/error';
    const template = `${module}/${model.name}/admin/templates/search`;
    //extract filters from url query
    let { q, filter, span, sort, skip, take } = req.data<{
      q?: string,
      filter?: Record<string, string|number|boolean>,
      span?: Record<string, (string|number|null|undefined)[]>,
      sort?: Record<string, any>,
      skip?: number,
      take?: number
    }>();

    if (skip && !isNaN(Number(skip))) {
      skip = Number(skip);
    }

    if (take && !isNaN(Number(take))) {
      take = Number(take);
    }
    //search using the filters
    const response = await server.call(
      `${model.dash}-search`,
      { q, filter, span, sort, skip, take }
    );
    //if successfully searched
    if (response.code === 200) {
      if (req.query.has('json')) {
        return res.setJSON(response);
      }
      //render the search page
      return res.setHTML(await render(template, { 
        q,
        filter, 
        span, 
        sort, 
        skip, 
        take, 
        settings: admin,
        session: session.results,
        ...response
      }));
    }
    //it did not search, render error page
    res.setHTML(await render(error, { 
      ...response, 
      settings: admin,
      session: session.results 
    }));
  };
};