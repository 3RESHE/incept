//common
import database from '../database';

async function purge() {
  const db = await database();
  const dialect = db.dialect;
  const queries = [
    dialect.truncate('Auth', true),
    dialect.truncate('File', true),
    dialect.truncate('Address', true),
    dialect.truncate('Connection', true),
    dialect.truncate('Profile', true)
  ];
  db.transaction(async connection => {
    for (const query of queries) {
      await connection.query(query);
    }
  });
};

purge().catch(console.error);