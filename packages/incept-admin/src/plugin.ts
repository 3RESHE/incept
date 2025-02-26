//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Server from '@stackpress/ingest/dist/Server';
//incept
import type { ClientPlugin } from '@stackpress/incept/dist';
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
//admin
import type { ClientWithRoutesPlugin } from './types';

type Client = ClientPlugin<ClientWithRoutesPlugin>;

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, add templates
  server.on('config', req => {
    const server = req.context;
    const config = server.config.withPath;
    const module = config.get<string>('build.module');
    //get the client (to determine the model page templates)
    const client = server.plugin<ClientPlugin>('client');
    //get the template plugin
    const { templates } = server.plugin<TemplatePlugin>('template');
    templates.add('@stackpress/incept-admin/dist/components/error');
    if (!client || !templates) return;
    //get all the models and add the page templates
    Object.values(client.model).forEach(model => {
      templates.add(`${module}/${model.config.name}/admin/templates/create.ink`);
      templates.add(`${module}/${model.config.name}/admin/templates/detail.ink`);
      templates.add(`${module}/${model.config.name}/admin/templates/remove.ink`);
      templates.add(`${module}/${model.config.name}/admin/templates/restore.ink`);
      templates.add(`${module}/${model.config.name}/admin/templates/search.ink`);
      templates.add(`${module}/${model.config.name}/admin/templates/update.ink`);
    });
  }, -10);
  //on route, add admin routes
  server.on('route', req => {
    const server = req.context;
    try {
      //it's possible that the client isnt generated yet...
      //config, registry, model, fieldset
      const client = server.plugin<Client>('client');
      //loop through all the models
      for (const model of Object.values(client.model)) {
        //register all the admin routes
        model.admin(server);
      }
    } catch(e) {}
  });
  //generate some code in the client folder
  server.on('idea', req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    //if no plugin object exists, create one
    if (!transformer.schema.plugin) {
      transformer.schema.plugin = {};
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    transformer.schema.plugin['@stackpress/incept-admin/dist/transform'] = {};
  });
};