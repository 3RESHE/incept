//stackpress
import type { ServerConfig } from '@stackpress/incept/dist/types';
import type { QueryObject } from '@stackpress/inquire/dist/types';
import type Server from '@stackpress/ingest/dist/Server';
import type Engine from '@stackpress/inquire/dist/Engine';
import Revisions from '@stackpress/incept/dist/Revisions';
//common
import create from '../schema';
import { sequence } from '../helpers';

export default async function push(server: Server<any, any, any>, database: Engine) {
  //get config
  const config = server.config<ServerConfig['idea']>('idea'); 
  //if there is a revisions folder
  if (!config.revisions) {
    return;
  }

  //this is where we are going to store all the queries
  const queries: QueryObject[] = [];
  const revisions = new Revisions(config.revisions, server.loader);
  //get the last last revision
  const from = revisions.last(-1);
  //get the last revision
  const to = revisions.last();
  //if no previous revision
  if (!from && to) {
    //make a list of create schemas
    const schema = Array
      .from(to.registry.model.values())
      .map(model => create(model));
    //there's an order to creating and dropping tables
    const order = sequence(schema);
    //add drop queries
    for (const table of order) {
      queries.push(database.dialect.drop(table));
    }
    //add create queries
    for (const table of order.reverse()) {
      const create = schema.find(create => create.build().table === table);
      if (create) {
        //set the engine to determine the dialect
        create.engine = database;
        queries.push(...create.query());
      }
    }
    if (queries.length) {
      //start a new transaction
      database.transaction(async connection => {
        //loop through all the queries
        for (const query of queries) {
          //execute the query
          await connection.query(query);
        }
      });
    }
  } else if (from && to) {
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
      //start a new transaction
      await database.transaction(async connection => {
        //loop through all the queries
        for (const query of queries) {
          //execute the query
          await connection.query(query);
        }
      });
    }
  }
};