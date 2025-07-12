const { parseDatabaseUrl } = require('../utils/db_utils');

describe('parseDatabaseUrl', () => {
  test('should parse a PostgreSQL URL correctly', () => {
    const url = 'postgres://user:pass@localhost:5432/mydb';
    const result = parseDatabaseUrl(url);
    expect(result).toEqual({
      driver: 'postgres',
      user: 'user',
      password: 'pass',
      host: 'localhost',
      port: '5432',
      database: 'mydb',
    });
  });

  test('should parse a MySQL URL correctly', () => {
    const url = 'mysql://root:secret@127.0.0.1:3306/test_db';
    const result = parseDatabaseUrl(url);
    expect(result).toEqual({
      driver: 'mysql',
      user: 'root',
      password: 'secret',
      host: '127.0.0.1',
      port: '3306',
      database: 'test_db',
    });
  });

  test('should parse a SQLite URL (file-based)', () => {
    const url = 'sqlite:///tmp/test.sqlite';
    const result = parseDatabaseUrl(url);
    expect(result).toEqual({
      driver: 'sqlite3',
      user: null,
      password: null,
      host: null,
      port: null,
      database: 'tmp/test.sqlite',
    });
  });

  test('should parse a SQLite URL (memory-based)', () => {
    const url = 'sqlite3:///file::memory:?cache=shared';
    const result = parseDatabaseUrl(url);
    expect(result).toEqual({
      driver: 'sqlite3',
      user: null,
      password: null,
      host: null,
      port: null,
      database: 'file::memory:?cache=shared',
    });
  });

  test('should parse a SQLite URL (memory-based)', () => {
    const url = 'sqlite3:///file:memDb1?mode=memory&cache=shared';
    const result = parseDatabaseUrl(url);
    expect(result).toEqual({
      driver: 'sqlite3',
      user: null,
      password: null,
      host: null,
      port: null,
      database: 'file:memDb1?mode=memory&cache=shared',
    });
  });

  test('should throw error if no URL is provided', () => {
    expect(() => parseDatabaseUrl(null)).toThrow('DATABASE_URL is not defined');
    expect(() => parseDatabaseUrl('')).toThrow('DATABASE_URL is not defined');
  });
});
