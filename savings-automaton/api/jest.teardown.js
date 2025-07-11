const { knex } = require('./utils/migrations');

module.exports = async () => {
  await knex.destroy();
};
