//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Server from '@stackpress/ingest/dist/Server';
import type { ClientPlugin } from '@stackpress/incept/dist';
//local
import type { 
  DatabaseConfig, 
  ClientWithDatabasePlugin 
} from './types';

type Client = ClientPlugin<ClientWithDatabasePlugin>;
type Database = DatabaseConfig['database'];

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on listen, add database events
  server.on('listen', req => {
    const server = req.context;
    try {
      //it's possible that the client isnt generated yet...
      //config, registry, model, fieldset
      const client = server.plugin<Client>('client');
      //loop through all the models
      for (const model of Object.values(client.model)) {
        //register all the model events
        server.use(model.events);
      }
    } catch(e) {}
  });
  //generate some code in the client folder
  server.on('idea', req => {
    const server = req.context;
    //config, registry, model, fieldset
    const client = server.plugin<Client>('client') || {};
    //need migrations path
    const { migrations } = server.config<Database>('database') || {};
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    //if no plugin object exists, create one
    if (!transformer.schema.plugin) {
      transformer.schema.plugin = {};
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    transformer.schema.plugin['@stackpress/incept-inquire/dist/transform'] = {
      history: client.config || {},
      migrations
    };
  });
};