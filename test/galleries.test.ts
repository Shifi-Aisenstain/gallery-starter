import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { startServer } from '../src/server.js';

const baseUrl = 'http://localhost:3000';
let server: ReturnType<typeof startServer>;

test.before(async () => {
  server = startServer();
  for (let i = 0; i < 50; i += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/galleries`, {
        headers: { 'X-User-Id': 'dana' },
      });
      if (response.ok) {
        return;
      }
    } catch {
      // server not ready yet
    }
    await delay(100);
  }
  throw new Error('Server did not start in time');
});

test.after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});

test('GET /api/galleries returns galleries for the current user', async () => {
  const response = await fetch(`${baseUrl}/api/galleries`, {
    headers: { 'X-User-Id': 'dana' },
  });

  assert.equal(response.status, 200);
  const data = await response.json();

  assert.deepEqual(data, [
    {
      id: 1,
      name: 'Levi wedding',
      photographer: 'dana',
      status: 'draft',
    },
    {
      id: 2,
      name: 'Cohen bar mitzvah',
      photographer: 'dana',
      status: 'published',
    },
  ]);
});

test('GET /api/galleries returns no galleries for an unknown user', async () => {
  const response = await fetch(`${baseUrl}/api/galleries`, {
    headers: { 'X-User-Id': 'ghost' },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});
