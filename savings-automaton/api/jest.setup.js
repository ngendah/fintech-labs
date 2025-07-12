const session = require('./utils/db_session');

module.exports = async () => {
  console.log('Running Knex migrations for tests...');
  await session.migrate.latest();
  console.log('Knex migrations completed.');
  console.log('Seed testing data ...');
  await session.seed.run();
  console.log('Data seeding completed.');
};
