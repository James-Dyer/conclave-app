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
let memberId;

// start server and log in users

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });

  let res = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'member@example.com', password: 'password' })
  });
  let data = await res.json();
  memberToken = data.token;
  memberId = data.member.id;

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

// ensure clean data before each test

test.beforeEach(() => {
  dbMock.reset();
});

async function clearCharges() {
  const res = await fetch(`${baseUrl}/api/admin/charges`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const list = await res.json();
  for (const c of list) {
    await fetch(`${baseUrl}/api/admin/charges/${c.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }
}

async function createCharge(amount, dueDate, status = 'Outstanding') {
  const res = await fetch(`${baseUrl}/api/admin/charges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ memberId, amount, dueDate, status })
  });
  const data = await res.json();
  return data.id;
}

async function submitPayment(amount) {
  const res = await fetch(`${baseUrl}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${memberToken}`
    },
    body: JSON.stringify({ amount })
  });
  const data = await res.json();
  return data.payment.id;
}

async function approvePayment(id) {
  const res = await fetch(`${baseUrl}/api/admin/payments/${id}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  return res.json();
}

async function denyPayment(id, note = 'No') {
  const res = await fetch(`${baseUrl}/api/admin/payments/${id}/deny`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ note })
  });
  return res.json();
}

async function listCharges() {
  const res = await fetch(`${baseUrl}/api/my-charges`, {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  return res.json();
}

async function getPayment(id) {
  const res = await fetch(`${baseUrl}/api/payments`, {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  const list = await res.json();
  return list.find(p => p.id === id);
}

// one charge, payment approved

test('single charge approved', async () => {
  await clearCharges();
  await createCharge(40, '2025-01-01');

  const pid = await submitPayment(40);
  let charges = await listCharges();
  assert.equal(charges.length, 1);
  assert.equal(charges[0].status, 'Under Review');
  assert.equal(charges[0].partialAmountPaid, 40);

  await approvePayment(pid);
  charges = await listCharges();
  assert.equal(charges[0].status, 'Paid');
  assert.equal(charges[0].partialAmountPaid, 0);

  const pay = await getPayment(pid);
  assert.equal(pay.status, 'Approved');
});

// one charge, payment denied

test('single charge denied', async () => {
  await clearCharges();
  await createCharge(50, '2025-01-01');

  const pid = await submitPayment(50);
  await denyPayment(pid, 'bad');
  const charges = await listCharges();
  assert.equal(charges[0].status, 'Outstanding');
  assert.equal(charges[0].partialAmountPaid, 0);
  const pay = await getPayment(pid);
  assert.equal(pay.status, 'Denied');
});

// two charges one payment approved

test('two charges one payment approved', async () => {
  await clearCharges();
  await createCharge(30, '2025-01-01');
  await createCharge(50, '2025-02-01');

  const pid = await submitPayment(60);
  let charges = await listCharges();
  const c1 = charges.find(c => c.amount === 30);
  const c2 = charges.find(c => c.amount === 50);
  assert.equal(c1.partialAmountPaid, 30);
  assert.equal(c2.partialAmountPaid, 30);
  assert.equal(c1.status, 'Under Review');
  assert.equal(c2.status, 'Under Review');

  await approvePayment(pid);
  charges = await listCharges();
  const a1 = charges.find(c => c.amount === 30);
  const a2 = charges.find(c => c.amount === 50);
  assert.equal(a1.status, 'Paid');
  assert.equal(a1.partialAmountPaid, 0);
  assert.equal(a2.status, 'Partially Paid');
  assert.equal(a2.partialAmountPaid, 30);
});

// two charges two payments approve first deny second

test('two charges two payments mixed', async () => {
  await clearCharges();
  await createCharge(30, '2025-01-01');
  await createCharge(50, '2025-02-01');

  const p1 = await submitPayment(30);
  const p2 = await submitPayment(50);

  await approvePayment(p1);
  await denyPayment(p2, 'no');

  const charges = await listCharges();
  const c1 = charges.find(c => c.amount === 30);
  const c2 = charges.find(c => c.amount === 50);
  assert.equal(c1.status, 'Paid');
  assert.equal(c2.status, 'Outstanding');
});

// two charges three payments complex ordering

test('two charges three payments complex', async () => {
  await clearCharges();
  await createCharge(30, '2025-01-01');
  await createCharge(50, '2025-02-01');

  const p1 = await submitPayment(30); // charge1
  const p2 = await submitPayment(20); // charge2 partial
  await approvePayment(p2);           // charge2 now partially paid 20
  const p3 = await submitPayment(30); // charge2 now under review 50

  await denyPayment(p1, 'oops');
  await approvePayment(p3);

  const charges = await listCharges();
  const c1 = charges.find(c => c.amount === 30);
  const c2 = charges.find(c => c.amount === 50);
  assert.equal(c1.status, 'Outstanding');
  assert.equal(c2.status, 'Paid');

  const pay1 = await getPayment(p1);
  const pay2 = await getPayment(p2);
  const pay3 = await getPayment(p3);
  assert.equal(pay1.status, 'Denied');
  assert.equal(pay2.status, 'Approved');
  assert.equal(pay3.status, 'Approved');
});
