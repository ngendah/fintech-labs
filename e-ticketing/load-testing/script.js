import http from 'k6/http';
import { sleep } from 'k6';
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";

export const options = {
  vus: 1,
  // duration: '1s',
  thresholds: {
    http_req_duration: ['p(95)<100']
  }
}

export default function() {
  const uid = __VU + '-' + __ITER;
  const user = 'u' + uid;
  const params = { headers: { 'Content-Type': 'application/json' } };
  let resp = http.post('http://api-gateway:3000/register', {
    "username": user,
    "email": `${user}@example.com`,
    "password": "test-password"
  }, params);
  expect.soft(resp.status).toBe(201);
  sleep(1);
  const bookingParams = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resp}`
    }
  };
  const seat = `S-${uid}`;
  resp = http.post('http://api-gateway:3000/booking', { eventId: 1, seats: [seat] }, bookingParams);
  expect.soft(resp.status).toBe(201);
  sleep(1);
}
