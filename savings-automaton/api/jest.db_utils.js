const { knexConnection } = require('./utils/db_utils');
const knex = require('knex')(knexConnection(process.env.DATABASE_URL));

module.exports = knex;
