import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '10s', target: 3 },
    { duration: '10s', target: 5 },
    { duration: '30s', target: 50 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<100'],
  },
  maxIterations: 3,
  summaryTrendStats: ['avg', 'p(95)', 'max'],
}

const registerTrend = new Trend('register_duration');
const bookingTrend = new Trend('booking_duration');

export default function() {
  const server = 'api-gateway'
  const uid = `${__VU}-${__ITER}-${Date.now()}`;
  const user = 'u' + uid;
  const params = { headers: { 'Content-Type': 'application/json' } };
  const body = {
    "username": user,
    "email": `${user}@example.com`,
    "password": "test-password"
  }
  let start = Date.now();
  let resp = http.post(`http://${server}:3000/register`, JSON.stringify(body), params);
  registerTrend.add(Date.now() - start);
  check(resp, { 'register 201': (r) => r.status === 201 });
  sleep(1);
  const token = resp.json().token
  const bookingParams = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };
  const seat = `S-${uid}`;
  start = Date.now();
  resp = http.post(`http://${server}:3000/booking`, JSON.stringify({ eventId: 1, seats: [seat] }), bookingParams);
  bookingTrend.add(Date.now() - start);
  check(resp, { 'booking 201': (r) => r.status === 201 });
  sleep(1);
}
