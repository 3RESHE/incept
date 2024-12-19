//common
import database from '../database';

async function purge() {
  const db = await database();
  const dialect = db.dialect;
  const queries = [
    dialect.truncate('Auth', false),
    dialect.truncate('File', false),
    dialect.truncate('Address', false),
    dialect.truncate('Connection', false),
    dialect.truncate('Profile', false)
  ];
  db.transaction(async connection => {
    for (const query of queries) {
      await connection.query(query);
    }
    return [];
  });
};

purge().catch(console.error);