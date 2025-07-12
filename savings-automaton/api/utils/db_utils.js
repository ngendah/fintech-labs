const { URL } = require('url');

function parseDatabaseUrl(databaseUrl) {
  if (!databaseUrl) throw new Error('DATABASE_URL is not defined');
  let parsed;
  try {
    parsed = new URL(databaseUrl);
  } catch (err) {
    console.error(err);
    throw new Error(`Invalid database URL: ${databaseUrl}`);
  }
  const protocol = parsed.protocol.replace(':', '');
  const isSQLite = protocol === 'sqlite3' || protocol === 'sqlite';
  if (isSQLite) {
    const raw = databaseUrl.replace(/^sqlite3?:\/{2,3}/, '');
    if (!raw) {
      throw new Error(`Invalid SQLite URL: missing database path`);
    }
    const decoded = decodeURIComponent(raw);
    const valid =
      decoded.startsWith('file:') || // URI filename style
      decoded.endsWith('.db') ||
      decoded.endsWith('.sqlite') ||
      decoded.startsWith(':memory:');
    if (!valid) {
      throw new Error(`Invalid SQLite database path: "${decoded}"`);
    }
    return {
      driver: 'sqlite3',
      user: null,
      password: null,
      host: null,
      port: null,
      database: decoded,
    };
  }
  if (['postgres', 'mysql'].includes(protocol)) {
    const pathname = parsed.pathname || '';
    const database = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    if (!parsed.username || !parsed.hostname || !parsed.port || !database) {
      throw new Error(
        `Invalid ${protocol} URL: must include user, host, port, and database`,
      );
    }
    return {
      driver: protocol,
      user: parsed.username,
      password: parsed.password,
      host: parsed.hostname,
      port: parsed.port,
      database,
    };
  }
  throw new Error(`Unsupported database driver: "${protocol}"`);
}

function knexConnection(databaseUrl) {
  const parsedUrl = parseDatabaseUrl(databaseUrl);
  const credentials = {
    user: parsedUrl.user,
    password: parsedUrl.password,
    host: parsedUrl.host,
    port: parsedUrl.port,
  };
  if (parsedUrl.driver === 'sqlite3') {
    return {
      client: parsedUrl.driver,
      connection: {
        filename: parsedUrl.database,
        ...credentials,
      },
    };
  }
  return {
    client: parsedUrl.driver,
    connection: { database: parsedUrl.database, ...credentials },
  };
}

module.exports = { parseDatabaseUrl, knexConnection };
