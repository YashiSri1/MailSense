const http = require('http');

console.log('Running sanity test...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Sanity test passed. Backend is running and healthy.');
      console.log('Response:', data);
      process.exit(0);
    } else {
      console.error('❌ Sanity test failed. Status code:', res.statusCode);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Sanity test failed with error: ${e.message}`);
  process.exit(1);
});

req.end();
