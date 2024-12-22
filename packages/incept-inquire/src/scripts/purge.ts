//stackpress
import type { ClientPlugin } from '@stackpress/incept/dist/types';
import type { QueryObject } from '@stackpress/inquire/dist/types';
import type Server from '@stackpress/ingest/dist/Server';
import type Engine from '@stackpress/inquire/dist/Engine';
//common
import type { ClientWithDatabasePlugin } from '../types';
import { sequence } from '../helpers';

type Client = ClientPlugin<ClientWithDatabasePlugin>;

export default async function purge(server: Server<any, any, any>, database: Engine) {
  //get client
  const client = server.plugin<Client>('client') || {};
  //get create table schemas
  const schema = Object.values(client.model).map(model => model.schema);
  //repo of all the queries for the transaction
  const queries: QueryObject[] = [];
  //there's an order to truncating tables
  const order = sequence(schema);
  //add truncate queries
  for (const table of order) {
    const create = schema.find(create => create.build().table === table);
    if (create) {
      queries.push(database.dialect.truncate(table, true));
    }
  }

  if (queries.length) {
    await database.transaction(async connection => {
      for (const query of queries) {
        await connection.query(query);
      }
    });
  }
};