const { knex } = require('./utils/migrations');

module.exports = async () => {
  console.log('Running Knex migrations for tests...');
  await knex.migrate.latest();
  console.log('Knex migrations completed.');
  // console.log('Seeding data ...');
  // await knex.seed.run();
  // console.log('Seeding data completed.');
};
