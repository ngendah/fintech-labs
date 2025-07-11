const { knex } = require('./utils/test_utils');

module.exports = async () => {
  await knex.destroy();
};
