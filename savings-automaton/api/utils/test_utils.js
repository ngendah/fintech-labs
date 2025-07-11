const { parseDatabaseUrl } = require('./parse_db_url');
const dbUrl = process.env.DATABASE_URL;
const parsedUrl = parseDatabaseUrl(dbUrl);

const knex = require('knex')({
  client: parsedUrl.driver,
  connection: {
    filename: parsedUrl.database,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
});

module.exports = { knex };
