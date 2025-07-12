const cron = require('node-cron');

function  savings_schedule() {
  console.log('Running scheduled savings job at 9am every Friday...');
}

function start_cron_tasks() {
  console.log('Starting cron tasks');
  cron.schedule('0 9 * * FRI', savings_schedule);
}

module.exports = start_cron_tasks;

if (require.main === module) {
  start_cron_tasks();
}
