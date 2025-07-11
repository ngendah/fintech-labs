const cron = require('node-cron');

cron.schedule('0 9 * * FRI', () => {
  console.log('Running scheduled savings job at 9am every Friday...');
});
