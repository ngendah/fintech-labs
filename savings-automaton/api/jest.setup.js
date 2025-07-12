const knex = require('./jest.db_utils');

module.exports = async () => {
  console.log('Running Knex migrations for tests...');
  await knex.migrate.latest();
  console.log('Knex migrations completed.');
};
