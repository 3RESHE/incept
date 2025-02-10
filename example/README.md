# Incept Example

A basic boilerplate for incept.

## Install

```bash
$ yarn
$ yarn generate
$ yarn dev install
$ yarn serve
```

## Utilities

The following utilities are available per block and follow a common 
pattern of `yarn [block]:[migrate|test|dev|live] [?event] [...params]`.
The following are example commands.

```bash
$ yarn migrate
$ yarn test
$ yarn dev install
$ yarn dev populate
$ yarn dev purge
$ yarn dev push
$ yarn dev query
$ yarn live install
$ yarn live populate
$ yarn live purge
$ yarn live push
$ yarn live query
```

### Migrate

```bash
$ yarn migrate
```

Migrate creates a `migrations` folder in the `[block]` folder and 
generates an SQL file based on the `development` database only.

> It does not push these changes to the database.

### Serve

```bash
$ yarn serve [?port]
```

Starts the development server

### Test

```bash
$ yarn test
```

Tests are automatically generated, but you can add special tests in the 
`tests` folder.

### Events

All events can be ran from the command line and follow a common 
pattern of `yarn [dev|live] [event] [...params]`. Where `dev`
events are ran in the development environment and `live` events are ran
in the production envionment.

> `yarn live [event]` events are ran on production.

For example, you can query the profile table using the following commands.

```bash
$ yarn dev profile-search
$ yarn dev query "select * from profile"
```

The following are pre-defined events.

 - `$ yarn dev install` - Creates all tables in the database
 - `$ yarn dev populate` - Populates the database
 - `$ yarn dev purge` - Truncates all table rows in the database
 - `$ yarn dev push` - Pushes the latest table schema changes to the database
 - `$ yarn dev query "[query]"` - SQL raw query