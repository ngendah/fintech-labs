const { knexConnection } = require('./db_utils');
const db_session = require('knex')(knexConnection(process.env.DATABASE_URL));

module.exports = db_session;
