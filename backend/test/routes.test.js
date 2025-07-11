process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

function buildRoute(path) {
  const builder = {
    or: () => builder,
    then: (onFulfilled, onRejected) =>
      Promise.resolve({ data: [{ id: 1 }], error: null }).then(onFulfilled, onRejected)
  };
  const stub = {
    from: () => ({ select: () => builder })
  };
  const dbPath = require.resolve('../db');
  const original = require.cache[dbPath];
  require.cache[dbPath] = { exports: stub };
  const route = require(`../routes/${path}`);
  require.cache[dbPath] = original;
  const app = express();
  app.use(route);
  return app;
}

test('charges route returns data with stubbed supabase', async () => {
  const app = buildRoute('charges');
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const res = await fetch(base + '/');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, [{ id: 1 }]);
  server.close();
});

test('members route returns data with stubbed supabase', async () => {
  const app = buildRoute('members');
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const res = await fetch(base + '/');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, [{ id: 1 }]);
  server.close();
});
