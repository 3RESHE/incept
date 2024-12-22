//modules
import path from 'node:path';
//stackpress
import type { ServerConfig } from '@stackpress/incept/dist/types';
import type { QueryObject } from '@stackpress/inquire/dist/types';
import type Server from '@stackpress/ingest/dist/Server';
import type Engine from '@stackpress/inquire/dist/Engine';
import Revisions from '@stackpress/incept/dist/Revisions';
//common
import type { DatabaseConfig } from '../types'; 
import create from '../schema';
import { sequence } from '../helpers';

export default async function migrate(server: Server<any, any, any>, database: Engine) {
  //get config
  const { revisions: root } = server.config<ServerConfig['idea']>('idea') || {}; 
  const { migrations } = server.config<DatabaseConfig['database']>('database') || {}; 
  //if there is not a migrations or revisions folder
  if (!migrations || !root) {
    return;
  }
  //collect all the revisions
  const revisions = new Revisions(root, server.loader);
  //if there are no revisions
  if (!revisions.size()) {
    return;
  }
  const fs = server.loader.fs;
  const first = revisions.first();
  if (first) {
    //this is where we are going to store all the queries
    const queries: QueryObject[] = [];
    //make a list of create schemas
    const schema = Array
      .from(first.registry.model.values())
      .map(model => create(model));
    //there's an order to creating and dropping tables
    const order = sequence(schema);
    //add drop queries
    for (const table of order) {
      queries.push(database.dialect.drop(table));
    }
    //add create queries
    for (const table of order.reverse()) {
      const create = schema.find(
        create => create.build().table === table
      );
      if (create) {
        create.engine = database;
        queries.push(...create.query());
      }
    }
    if (queries.length) {
      if (!fs.existsSync(migrations)) {
        fs.mkdirSync(migrations, { recursive: true });
      }
      //add migration file
      fs.writeFileSync(
        path.join(migrations, `${first.date.getTime()}.sql`),
        queries.map(query => query.query).join(';\n')
      );
    }
  }

  for (let i = 1; i < revisions.size(); i++) {
    const from = revisions.index(i - 1);
    const to = revisions.index(i);
    if (!from || !to) break;
    //create a registry from the history
    const previous = Array.from(from.registry.model.values()).map(
      model => create(model)
    );
    //create a registry from the new generated schema
    const current = Array.from(to.registry.model.values()).map(
      model => create(model)
    );
    //this is where we are going to store all the queries
    const queries: QueryObject[] = [];
    //loop through all 'current' the models
    for (const schema of current) {
      const name = schema.build().table;
      const before = previous.find(from => from.build().table === name);
      //if the schema wasn't there before
      if (!before) {
        //set the engine to determine the dialect
        schema.engine = database;
        //add to the queries
        queries.push(...schema.query());
        continue;
      }
      //the model was there before...
      try {
        //this could error if there were no differences found.
        //push all the alter statements
        queries.push(...database.diff(before, schema).query());
      } catch(e) {}
    }
    //loop through all 'previous' the models
    for (const schema of previous) {
      const name = schema.build().table;
      const after = current.find(to => to.build().table === name);
      //if the model is not there now
      if (!after) {
        //we need to drop this table
        queries.push(database.dialect.drop(name));
        continue;
      }
    }
    //if there are queries to be made...
    if (queries.length) {
      if (!fs.existsSync(migrations)) {
        fs.mkdirSync(migrations, { recursive: true });
      }
      //add migration file
      fs.writeFileSync(
        path.join(migrations, `${to.date.getTime()}.sql`),
        queries.map(query => query.query).join(';\n')
      );
    }
  }
};