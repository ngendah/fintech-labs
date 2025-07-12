const { knexConnection } = require('./utils/db_utils');

module.exports = knexConnection(process.env.DATABASE_URL);
