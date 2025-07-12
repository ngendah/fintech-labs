const express = require('express');
const { Model } = require('objection');
const { User } = require('./models/user');
const { SavingSchedule } = require('./models/saving_schedule');
const db_session = require('./utils/db_session');
const app = express();
app.use(express.json());

Model.knex(db_session);

app.get('/', (req, res) => {
  res.send('Savings API is running');
});

app.post('/savings', async (req, res) => {
  const { userId, amount, frequency } = req.body;
  if (!userId || !amount || !frequency) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const user = await User.query().findById(userId);
  if (!user) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  const saving_schedule = await SavingSchedule.query().insertGraph({
    user_id: userId,
    amount,
    frequency,
  });

  if (!saving_schedule) {
    return res.status(500).json({ error: 'An error occurred' });
  }

  res.status(201).json({
    message: 'Savings schedule created',
    data: { userId, amount, frequency },
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
