import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: '../node_modules/@stackpress/incept-drizzle/schema.d.ts',
  driver: 'pglite',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  extensionsFilters: ['postgis'],
  schemaFilter: 'public',
  tablesFilter: '*',
  introspect: {
    casing: 'camel',
  },
  migrations: {
    prefix: 'timestamp',
    table: '__incept_migrations__',
    schema: 'public',
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});