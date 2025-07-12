const dbMock = require('./supabaseMock');
require.cache[require.resolve('../db')] = { exports: dbMock.supabase };
require.cache[require.resolve('../adminClient')] = { exports: dbMock.supabaseAdmin };

const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

let server;
let baseUrl;
let memberToken;
let adminToken;

// start server and obtain tokens

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });

  // login as member
  let res = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'member@example.com', password: 'password' })
  });
  let data = await res.json();
  memberToken = data.token;

  // login as admin
  res = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin' })
  });
  data = await res.json();
  adminToken = data.token;
});

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
});

// CRUD operations for members

test('admin member CRUD works', async () => {
  // create
  const createRes = await fetch(`${baseUrl}/api/admin/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ email: 'new@example.com', password: 'pw', name: 'New' })
  });
  assert.equal(createRes.status, 200);
  const { id } = await createRes.json();
  assert.ok(id);

  // update
  const updRes = await fetch(`${baseUrl}/api/admin/members/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'Inactive' })
  });
  assert.equal(updRes.status, 200);
  assert.deepEqual(await updRes.json(), { success: true });

  // delete
  const delRes = await fetch(`${baseUrl}/api/admin/members/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(delRes.status, 200);
  assert.deepEqual(await delRes.json(), { success: true });
});

// CRUD operations for charges

test('admin charge CRUD works', async () => {
  // create
  const createRes = await fetch(`${baseUrl}/api/admin/charges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      memberId: '5b7a79df-2f46-4206-b363-b4e1da6a6e99',
      amount: 10,
      dueDate: '2025-01-01',
      description: 'Test'
    })
  });
  assert.equal(createRes.status, 200);
  const charge = await createRes.json();
  assert.ok(charge.id);

  // update
  const updRes = await fetch(`${baseUrl}/api/admin/charges/${charge.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'Paid' })
  });
  assert.equal(updRes.status, 200);
  assert.deepEqual(await updRes.json(), { success: true });

  // delete
  const delRes = await fetch(`${baseUrl}/api/admin/charges/${charge.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(delRes.status, 200);
  assert.deepEqual(await delRes.json(), { success: true });
});

// review rejection path

test('admin can reject a review request', async () => {
  // member submits review
  const reviewRes = await fetch(`${baseUrl}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${memberToken}`
    },
    body: JSON.stringify({ amount: 5 })
  });
  assert.equal(reviewRes.status, 200);

  let list = await fetch(`${baseUrl}/api/admin/reviews`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  list = await list.json();
  const revId = list[list.length - 1].id;

  const rejRes = await fetch(`${baseUrl}/api/admin/reviews/${revId}/reject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(rejRes.status, 200);

  const after = await fetch(`${baseUrl}/api/admin/reviews`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const remaining = await after.json();
  assert.ok(!remaining.some(r => r.id === revId));
});
