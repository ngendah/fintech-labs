const session = require('./utils/db_session');

module.exports = async () => {
  console.log('Running Knex migrations for tests...');
  await session.migrate.latest();
  console.log('Knex migrations completed.');
};
