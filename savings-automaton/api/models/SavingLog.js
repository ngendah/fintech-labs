const { Model } = require('objection');

class SavingLog extends Model {
  static get tableName() {
    return 'savings_logs';
  }
}

module.exports = {
  User,
};
