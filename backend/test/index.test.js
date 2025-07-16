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

test('payment submission validates fields', async () => {
  const res = await fetch(`${baseUrl}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount: 5 })
  });
  assert.equal(res.status, 400);
});

test('submit payment succeeds', async () => {
  const res = await fetch(`${baseUrl}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount: 100, memo: 'Test', platform: 'Zelle' })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(typeof data.payment, 'object');

  const adminLogin = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin' })
  });
  const adminData = await adminLogin.json();
  const adminToken = adminData.token;

  const list = await fetch(`${baseUrl}/api/payments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const payments = await list.json();
  assert.ok(payments.some(p => p.id === data.payment.id));
});

test('admin endpoints enforce permissions and can approve payment', async () => {
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

  // admin sees pending payments
  const revRes = await fetch(`${baseUrl}/api/payments?status=Under%20Review`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const rev = (await revRes.json())[0];
  const approve = await fetch(
    `${baseUrl}/api/admin/payments/${rev.id}/approve`,
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

test('admin can approve payment', async () => {
  // member submits payment
  let res = await fetch(`${baseUrl}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  body: JSON.stringify({ amount: 250, platform: 'Zelle' })
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

  let list = await fetch(`${baseUrl}/api/payments?status=Under%20Review`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const revId = (await list.json()).pop().id;

  res = await fetch(`${baseUrl}/api/admin/payments/${revId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(res.status, 200);
  const pay = await res.json();
  assert.equal(pay.payment.status, 'Approved');
});


test('search members by status', async () => {
  const res = await fetch(`${baseUrl}/api/members?search=Active`);
  assert.equal(res.status, 200);
  const members = await res.json();
  assert.equal(members.length, 2);
});

test('admin members endpoint returns aggregated balances', async () => {
  const login = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin' })
  });
  const { token: adminToken } = await login.json();

  const res = await fetch(`${baseUrl}/api/admin/members`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(res.status, 200);
  const members = await res.json();
  const member = members.find(m => m.email === 'member@example.com');
  const admin = members.find(m => m.email === 'admin@example.com');
  assert.equal(member.amountOwed, 75);
  assert.equal(admin.amountOwed, 120);
});
