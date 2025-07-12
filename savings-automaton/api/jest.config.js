// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/jest.setup.js',
  globalTeardown: '<rootDir>/jest.teardown.js',
};

// Set environment variables globally
process.env = Object.assign(process.env, {
  DATABASE_URL: 'sqlite3:///file::memory:?cache=shared',
});
