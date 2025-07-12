// Provide mock Supabase clients for the server
const dbMock = require('./supabaseMock');
require.cache[require.resolve('../db')] = { exports: dbMock.supabase };
require.cache[require.resolve('../adminClient')] = { exports: dbMock.supabaseAdmin };

const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

let server;
let baseUrl;
let token;

// Start server before tests

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

// Close server after tests

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('login succeeds with valid credentials', async () => {
  const res = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'member@example.com', password: 'password' })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.token);
  assert.equal(data.member.email, 'member@example.com');
  token = data.token;
});

test('login fails with invalid credentials', async () => {
  const res = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'member@example.com', password: 'wrong' })
  });
  assert.equal(res.status, 401);
});

test('get member data requires auth', async () => {
  const res = await fetch(`${baseUrl}/api/member`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.name, 'John Doe');
});

test('review endpoint validates fields', async () => {
  const res = await fetch(`${baseUrl}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  });
  assert.equal(res.status, 400);
});

test('submit review succeeds', async () => {
  const res = await fetch(`${baseUrl}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount: 100, memo: 'Test' })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(typeof data.review, 'object');

  const adminLogin = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin' })
  });
  const adminData = await adminLogin.json();
  const adminToken = adminData.token;

  const chargesRes = await fetch(`${baseUrl}/api/admin/charges`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const list = await chargesRes.json();
  const charge = list.find((c) => c.id === 1);
  assert.equal(charge.status, 'Outstanding');
});

test('admin endpoints enforce permissions and can approve review', async () => {
  // login as admin
  const adminLogin = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin' })
  });
  assert.equal(adminLogin.status, 200);
  const adminData = await adminLogin.json();
  const adminToken = adminData.token;

  // member cannot access admin route
  const forbidden = await fetch(`${baseUrl}/api/admin/members`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(forbidden.status, 403);

  // admin can access admin route
  const listRes = await fetch(`${baseUrl}/api/admin/members`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(listRes.status, 200);
  const members = await listRes.json();
  assert.ok(Array.isArray(members));

  // admin sees pending reviews
  const revRes = await fetch(`${baseUrl}/api/admin/reviews`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const rev = (await revRes.json())[0];
  const approve = await fetch(
    `${baseUrl}/api/admin/reviews/${rev.id}/approve`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    }
  );
  assert.equal(approve.status, 200);

  // member should now have an additional payment
  const payRes = await fetch(`${baseUrl}/api/payments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const payments = await payRes.json();
  assert.equal(payments.length, 2);
});

test('lump sum approval allocates across charges', async () => {
  // member submits lump sum review
  let res = await fetch(`${baseUrl}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount: 250 })
  });
  assert.equal(res.status, 200);

  // login as admin
  const adminLogin = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin' })
  });
  const adminData = await adminLogin.json();
  const adminToken = adminData.token;

  let list = await fetch(`${baseUrl}/api/admin/reviews`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const revId = (await list.json()).pop().id;

  res = await fetch(`${baseUrl}/api/admin/reviews/${revId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(res.status, 200);

  const chargesRes = await fetch(`${baseUrl}/api/admin/charges`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const after = await chargesRes.json();
  const c5 = after.find((c) => c.id === 5);
  const c1 = after.find((c) => c.id === 1);
  const c3 = after.find((c) => c.id === 3);
  assert.equal(c5.status, 'Paid');
  assert.ok(c1.status === 'Paid' || c1.partialAmountPaid === 175);
  assert.equal(c3.status, 'Partially Paid');
  assert.equal(c3.partialAmountPaid, 75);
});
