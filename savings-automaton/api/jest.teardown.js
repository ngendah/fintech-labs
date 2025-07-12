const knex = require('./jest.db_utils');

module.exports = async () => {
  await knex.destroy();
};
