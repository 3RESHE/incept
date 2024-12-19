//modules
import path from 'node:path';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser/dist/types';
import type { QueryObject } from '@stackpress/inquire/dist/types';
import type { PluginWithProject } from '@stackpress/incept/dist/types';
import Registry from '@stackpress/incept/dist/schema/Registry';
//common
import type { DatabasePlugin } from '../types';
import create from '../schema';

export default async function migrate(props: PluginWithProject) {
  //extract props
  const { cli, config, schema } = props;

  const store = cli.server.plugin<DatabasePlugin>('database');
  //if database is not available
  if (!store) {
    //we cannot push to database
    //we cannot create a migration file (without a dialect)
    return;
  }

  //create a registry from the history
  const history = new Registry(config.history as SchemaConfig || {});
  const from = Array.from(history.model.values()).map(model => create(model));
  //create a registry from the new generated schema
  const registry = new Registry(schema);
  const to = Array.from(registry.model.values()).map(model => create(model));
  
  //this is where we are going to store all the queries
  const queries: QueryObject[] = [];

  //loop through all 'to' the models
  for (const schema of to) {
    const name = schema.build().table;
    const before = from.find(from => from.build().table === name);
    //if the schema wasn't there before
    if (!before) {
      //set the engine to determine the dialect
      schema.engine = store;
      //add to the queries
      queries.push(...schema.query());
      continue;
    }
    //the model was there before...
    try {
      //this could error if there were no differences found.
      //push all the alter statements
      queries.push(...store.diff(before, schema).query());
    } catch(e) {}
  }
  //loop through all 'from' the models
  for (const schema of from) {
    const name = schema.build().table;
    const after = to.find(to => to.build().table === name);
    //if the model is not there now
    if (!after) {
      //we need to drop this table
      queries.push(store.dialect.drop(name));
      continue;
    }
  }
  //if there are queries to be made...
  if (queries.length) {
    //try to migrate first
    const fs = cli.server.loader.fs;
    const migrations = config.migrations as string;
    //if can migrate
    if (migrations) {
      if (!fs.existsSync(migrations)) {
        fs.mkdirSync(migrations, { recursive: true });
      }
      //add migration file
      fs.writeFileSync(
        path.join(migrations, `${Date.now()}.sql`),
        queries.map(query => query.query).join(';\n')
      );
    }
    //either way, push up to the database
    await store.transaction(async connection => {
      for (const query of queries) {
        await connection.query(query);
      }
      return [];
    });
  }
}