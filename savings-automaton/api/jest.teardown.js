const session = require('./utils/db_session');

module.exports = async () => {
  await session.destroy();
};
