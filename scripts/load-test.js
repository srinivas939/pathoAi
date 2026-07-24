import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 Options: 100 Virtual Users for 1 minute
export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.05'],     // error rate under 5%
    http_req_duration: ['p(95)<1500'],   // 95% of requests completed under 1.5s
  },
};

export default function () {
  const targetUrl = __ENV.BACKEND_URL || 'http://127.0.0.1:5173/api/admin/health';
  const res = http.get(targetUrl);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.1);
}
