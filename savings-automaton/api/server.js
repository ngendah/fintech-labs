const express = require('express');
const { query } = require('./utils/query');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Savings API is running');
});

app.post('/savings', async (req, res) => {
  const { userId, amount, frequency } = req.body;
  if (!userId || !amount || !frequency) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Stub: simulate DB save
  res
    .status(201)
    .json({
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
