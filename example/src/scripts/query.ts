async function query() {
  const database = process.env.NODE_ENV === 'production' 
    ? await import('../databases/production') 
    : process.env.NODE_ENV === 'integration'
    ? await import('../databases/integration')
    : await import('../databases/development');
  const db = await database.default();
  const query = process.argv.slice(2).pop();
  if (query) {
    console.log(await db.query(query.replace(/\\/g, "'")));
  }
};

query()
  .then(() => process.exit(0))
  .catch(console.error);