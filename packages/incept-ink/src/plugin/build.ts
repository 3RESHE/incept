//types
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Builder from '@stackpress/ingest/dist/buildtime/Builder';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(builder: Builder) {
  //generate some code in the client folder
  builder.on('idea', req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    //if no plugin object exists, create one
    if (!transformer.schema.plugin) {
      transformer.schema.plugin = {};
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    transformer.schema.plugin['@stackpress/incept-ink/dist/transform'] = {};
  });
};