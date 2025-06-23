const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// In-memory data for Phase 1
const members = [
  { id: 1, email: 'member@example.com', password: 'password', name: 'John Doe' }
];

const charges = [
  {
    id: 1,
    memberId: 1,
    status: 'Outstanding',
    amount: 200,
    dueDate: '2024-05-01',
    description: 'Semester dues'
  },
  {
    id: 2,
    memberId: 1,
    status: 'Paid',
    amount: 100,
    dueDate: '2024-04-01',
    description: 'Fine'
  }
];

const payments = [
  { id: 1, memberId: 1, amount: 100, date: '2024-04-15', memo: 'Dues' }
];

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
    member: { id: member.id, email: member.email, name: member.name }
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

// Member data
app.get('/api/member', auth, (req, res) => {
  const member = members.find((m) => m.id === req.memberId);
  res.json({ id: member.id, email: member.email, name: member.name });
});

// Charges and payment history
app.get('/api/charges', auth, (req, res) => {
  const memberCharges = charges.filter((c) => c.memberId === req.memberId);
  res.json(memberCharges);
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

app.get('/', (req, res) => res.send('Server running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
