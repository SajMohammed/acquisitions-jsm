import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from './app.js';
const port = 3001; // Use different port for testing

describe('App Health Tests', () => {
  let server;

  before(async () => {
    server = http.createServer(app);
    await new Promise(resolve => {
      server.listen(port, resolve);
    });
  });

  after(async () => {
    if (server) {
      await new Promise(resolve => {
        server.close(resolve);
      });
    }
  });

  it('should respond to health check', async () => {
    const response = await makeRequest('/health');

    assert.strictEqual(response.statusCode, 200);

    const data = JSON.parse(response.data);
    assert.strictEqual(data.status, 'OK');
    assert(data.timestamp);
    assert(typeof data.uptime === 'number');
  });

  it('should respond to root endpoint', async () => {
    const response = await makeRequest('/');

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.data, 'Hello from acquisitions api');
  });

  it('should respond to API endpoint', async () => {
    const response = await makeRequest('/api');

    assert.strictEqual(response.statusCode, 200);

    const data = JSON.parse(response.data);
    assert.strictEqual(data.message, 'Aquisitions API is running!');
  });
});

// Helper function to make HTTP requests
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port,
      path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
        });
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });
}
