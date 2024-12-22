//common
import database from '../database';

async function query() {
  const db = await database();
  const query = process.argv.slice(2).pop();
  if (query) {
    console.log(await db.query(query));
  }
};

query()
  .then(() => process.exit(0))
  .catch(console.error);