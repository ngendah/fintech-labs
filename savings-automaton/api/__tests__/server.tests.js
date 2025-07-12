const request = require('supertest');
const app = require('../server');

describe('Savings API', () => {
  test('GET / should return 200 and status message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Savings API is running');
  });

  test('POST /savings with valid data should return 201', async () => {
    const data = {
      userId: '1',
      amount: 50,
      frequency: 'weekly',
    };
    const response = await request(app).post('/savings').send(data);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Savings schedule created');
    expect(response.body.data).toEqual(data);
  });

  test('POST /savings with missing data should return 400', async () => {
    const response = await request(app).post('/savings').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });
});
