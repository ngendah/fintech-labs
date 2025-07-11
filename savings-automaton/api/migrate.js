const { knex } = require('./utils/migrations');

if (require.main === module) {
  await knex.migrate.latest();
}
