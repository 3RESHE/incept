//modules
import { sql } from 'drizzle-orm';
//stackpress
import { store } from '@stackpress/incept/client';

async function purge() {
  const { db } = store;
  // await db.execute(sql.raw(`TRUNCATE TABLE Auth CASCADE;`));
  // await db.execute(sql.raw(`TRUNCATE TABLE File;`));
  // await db.execute(sql.raw(`TRUNCATE TABLE Address CASCADE;`));
  // await db.execute(sql.raw(`TRUNCATE TABLE Connection CASCADE;`));
  // await db.execute(sql.raw(`TRUNCATE TABLE Profile CASCADE;`));
};

purge().catch(console.error);