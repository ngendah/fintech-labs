const { Model } = require('objection');

class SavingSchedule extends Model {
  static get tableName() {
    return 'savings_schedules';
  }
}

module.exports = {
  SavingSchedule,
};
