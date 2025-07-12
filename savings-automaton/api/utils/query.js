const { parseDatabaseUrl } = require('./db_utils');

const dbUrl = process.env.DATABASE_URL;
const parsedUrl = parseDatabaseUrl(dbUrl);

let query;

if (parsedUrl.driver === 'postgres') {
  const { Pool } = require('pg');

  const pool = new Pool({ connectionString: dbUrl });

  query = async (text, params) => {
    const res = await pool.query(text, params);
    return res.rows;
  };
} else if (parsedUrl.driver === 'sqlite' || parsedUrl.driver === 'sqlite3') {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database(parsedUrl.database);

  query = (text, params) =>
    new Promise((resolve, reject) => {
      db.all(text, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
} else {
  throw new Error(`Unsupported database type: ${parsedUrl.driver}`);
}

module.exports = { query };
