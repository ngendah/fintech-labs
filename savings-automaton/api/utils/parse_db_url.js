function parseDatabaseUrl(databaseUrl) {
  if (!databaseUrl) throw new Error('DATABASE_URL is not defined');

  console.log(databaseUrl);

  const { URL } = require('url');
  const parsed = new URL(databaseUrl);

  const driver = parsed.protocol.replace(':', '');
  const user = parsed.username || null;
  const password = parsed.password || null;
  const host = parsed.hostname || null;
  const port = parsed.port || null;
  const pathname = parsed.pathname || '';
  const database = pathname.startsWith('/') ? pathname.slice(1) : pathname;

  return {
    driver,
    user,
    password,
    host,
    port,
    database,
  };
}

module.exports = { parseDatabaseUrl };
