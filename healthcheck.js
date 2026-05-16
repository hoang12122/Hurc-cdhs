/**
 * Docker Healthcheck Script
 * Chạy bên trong container Distroless để kiểm tra trạng thái bọc thép.
 */
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/health', // Giả định có endpoint này
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', (e) => {
  console.error(`HEALTHCHECK ERROR: ${e.message}`);
  process.exit(1);
});

req.end();
