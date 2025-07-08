const express = require('express');
const mongoose = require('mongoose');
const membersRoute = require('./routes/members');
const chargesRoute = require('./routes/charges');
const ChargeModel = require('./models/Charge');

const app = express();

// Avoid attempting a MongoDB connection when running tests to prevent
// unhandled rejections if no Mongo instance is available. Tests set
// NODE_ENV=test so this block is skipped during "npm test".
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect('mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch((err) => {
      // Log the connection error but allow the server to continue
      // so that non-DB dependant routes can still be exercised.
      console.error('Mongo connection error', err);
    });
}
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/members', membersRoute);
app.use('/api/charges', chargesRoute);

// In-memory data for Phase 2
const data = require('../mockData.json');
let members = data.members;
let charges = data.charges;
let nextMemberId = Math.max(...members.map((m) => m.id)) + 1;
let nextChargeId = Math.max(...charges.map((c) => c.id)) + 1;

const payments = [
  { id: 1, memberId: 1, amount: 100, date: '2024-04-15', memo: 'Dues' }
];
let nextPaymentId = 2;

const sessions = {};
let nextReviewId = 1;
const reviews = [];

function generateToken() {
  return Math.random().toString(36).substring(2);
}

// Authentication
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const member = members.find(
    (m) => m.email === email && m.password === password
  );
  if (!member) {
    return res.status(401).send('Invalid credentials');
  }
  const token = generateToken();
  sessions[token] = member.id;
  res.json({
    token,
    member: {
      id: member.id,
      email: member.email,
      name: member.name,
      isAdmin: member.isAdmin
    }
  });
});

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  const memberId = sessions[token];
  if (!memberId) {
    return res.status(401).send('Unauthorized');
  }
  req.memberId = memberId;
  next();
}

function adminOnly(req, res, next) {
  const member = members.find((m) => m.id === req.memberId);
  if (!member || !member.isAdmin) {
    return res.status(403).send('Forbidden');
  }
  next();
}

// Member data
app.get('/api/member', auth, (req, res) => {
  const member = members.find((m) => m.id === req.memberId);
  res.json({ id: member.id, email: member.email, name: member.name });
});

// Charges and payment history
app.get('/api/my-charges', auth, async (req, res) => {
  const memberCharges = await ChargeModel.find({ memberId: req.memberId }).lean();
  res.json(memberCharges.map((c) => ({ ...c, id: c._id })));
});

app.get('/api/payments', auth, (req, res) => {
  const memberPayments = payments.filter((p) => p.memberId === req.memberId);
  res.json(memberPayments);
});

// Payment review submission
app.post('/api/review', auth, (req, res) => {
  const { chargeId, amount, memo } = req.body || {};
  if (!chargeId || !amount) {
    return res.status(400).send('Missing chargeId or amount');
  }
  const review = {
    id: nextReviewId++,
    memberId: req.memberId,
    chargeId,
    amount,
    memo: memo || ''
  };
  reviews.push(review);
  res.json({ success: true });
});

// Admin routes
// Member management
app.get('/api/admin/members', auth, adminOnly, (req, res) => {
  const safeMembers = members.map(({ password, ...m }) => m);
  res.json(safeMembers);
});

app.post('/api/admin/members', auth, adminOnly, (req, res) => {
  const {
    email,
    password,
    name,
    isAdmin = false,
    status = 'Active',
    initiationDate = new Date().toISOString().slice(0, 10),
    amountOwed = 0,
    tags = []
  } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).send('Missing fields');
  }
  const member = {
    id: nextMemberId++,
    email,
    password,
    name,
    isAdmin,
    status,
    initiationDate,
    amountOwed,
    tags
  };
  members.push(member);
  res.json({ id: member.id });
});

app.put('/api/admin/members/:id', auth, adminOnly, (req, res) => {
  const member = members.find((m) => m.id === Number(req.params.id));
  if (!member) return res.status(404).send('Not found');
  const {
    email,
    password,
    name,
    isAdmin,
    status,
    initiationDate,
    amountOwed,
    tags
  } = req.body || {};
  if (email !== undefined) member.email = email;
  if (password !== undefined) member.password = password;
  if (name !== undefined) member.name = name;
  if (isAdmin !== undefined) member.isAdmin = isAdmin;
  if (status !== undefined) member.status = status;
  if (initiationDate !== undefined) member.initiationDate = initiationDate;
  if (amountOwed !== undefined) member.amountOwed = amountOwed;
  if (tags !== undefined) member.tags = tags;
  res.json({ success: true });
});

app.delete('/api/admin/members/:id', auth, adminOnly, (req, res) => {
  const idx = members.findIndex((m) => m.id === Number(req.params.id));
  if (idx === -1) return res.status(404).send('Not found');
  members.splice(idx, 1);
  res.json({ success: true });
});

// Charge management
app.get('/api/admin/charges', auth, adminOnly, (req, res) => {
  res.json(charges);
});

app.post('/api/admin/charges', auth, adminOnly, (req, res) => {
  const {
    memberId,
    status = 'Outstanding',
    amount,
    dueDate,
    description,
    tags = []
  } = req.body || {};
  if (!memberId || !amount || !dueDate) {
    return res.status(400).send('Missing fields');
  }
  const charge = {
    id: nextChargeId++,
    memberId: Number(memberId),
    status,
    amount,
    dueDate,
    description: description || '',
    tags
  };
  charges.push(charge);
  res.json(charge);
});

app.put('/api/admin/charges/:id', auth, adminOnly, (req, res) => {
  const charge = charges.find((c) => c.id === Number(req.params.id));
  if (!charge) return res.status(404).send('Not found');
  const { status, amount, dueDate, description, tags } = req.body || {};
  if (status !== undefined) charge.status = status;
  if (amount !== undefined) charge.amount = amount;
  if (dueDate !== undefined) charge.dueDate = dueDate;
  if (description !== undefined) charge.description = description;
  if (tags !== undefined) charge.tags = tags;
  res.json({ success: true });
});

app.delete('/api/admin/charges/:id', auth, adminOnly, (req, res) => {
  const idx = charges.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).send('Not found');
  charges.splice(idx, 1);
  res.json({ success: true });
});

// Payment review endpoints
app.get('/api/admin/reviews', auth, adminOnly, (req, res) => {
  res.json(reviews);
});

app.post('/api/admin/reviews/:id/approve', auth, adminOnly, (req, res) => {
  const reviewIdx = reviews.findIndex((r) => r.id === Number(req.params.id));
  if (reviewIdx === -1) return res.status(404).send('Not found');
  const review = reviews[reviewIdx];
  const charge = charges.find((c) => c.id === review.chargeId);
  if (charge) charge.status = 'Paid';
  payments.push({
    id: nextPaymentId++,
    memberId: review.memberId,
    amount: review.amount,
    date: new Date().toISOString(),
    memo: review.memo
  });
  reviews.splice(reviewIdx, 1);
  res.json({ success: true });
});

app.post('/api/admin/reviews/:id/reject', auth, adminOnly, (req, res) => {
  const idx = reviews.findIndex((r) => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).send('Not found');
  reviews.splice(idx, 1);
  res.json({ success: true });
});

app.get('/', (req, res) => res.send('Server running'));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
