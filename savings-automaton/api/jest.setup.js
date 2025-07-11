const { knex } = require('./utils/test_utils');

module.exports = async () => {
  console.log('Running Knex migrations for tests...');
  await knex.migrate.latest();
  console.log('Knex migrations completed.');
  // console.log('Seeding data ...');
  // await knex.seed.run();
  // console.log('Seeding data completed.');
};
