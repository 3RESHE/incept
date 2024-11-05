//types
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Project from '@stackpress/incept/dist/Project';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(project: Project) {
  //generate some code in the client folder
  project.on('idea', (transformer: Transformer<CLIProps>) => {
    //if no plugin object exists, create one
    if (!transformer.schema.plugin) {
      transformer.schema.plugin = {};
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    transformer.schema.plugin['@stackpress/incept-client/dist/transform'] = {};
  });
};