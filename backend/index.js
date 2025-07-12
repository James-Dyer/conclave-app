const express = require('express');
const crypto = require('node:crypto');
const supabase = require('./db');
const supabaseAdmin = require('./adminClient');
const jwt = require('jsonwebtoken');
const membersRoute = require('./routes/members');
const chargesRoute = require('./routes/charges');

const app = express();

// In tests we skip starting external connections.
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

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'test-secret';

// Create a new user account and profile entry using Supabase authentication
app.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  const { data: userData, error: authErr } = await supabase.auth.signUp({
    email,
    password
  });
  if (authErr) return res.status(400).json({ error: authErr.message });

  const { data, error: dbErr } = await supabase
    .from('profiles')
    .insert({ id: userData.user.id, email, display_name: displayName })
    .select();
  if (dbErr) return res.status(500).json({ error: dbErr.message });
  const inserted = Array.isArray(data) ? data[0] : data;

  res.status(201).json({ user: userData.user, profile: inserted });
});

// Log in a user and return a JWT. When running tests we verify credentials
// against the local in-memory data instead of calling Supabase.
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session) {
    return res.status(401).send(error ? error.message : 'Login failed');
  }

  const {
    data: profileData,
    error: profileErr
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  if (profileErr) return res.status(500).json({ error: profileErr.message });

  const profile = profileData || {};

  res.json({
    token: data.session.access_token,
    member: {
      id: data.user.id,
      email: data.user.email,
      name: profile.name,
      isAdmin: profile.isAdmin
    }
  });
});

/**
 * Middleware that validates an incoming JWT and attaches the member ID to
 * the request. In the test environment the token is verified locally,
 * otherwise the Supabase admin client is used.
 */
async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  const {
    data: { user },
    error
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    console.error('Supabase auth failed:', error);
    return res.status(401).send('Invalid token');
  }
  req.memberId = user.id;
  next();
}

/**
 * Middleware that allows access only to users flagged as administrators.
 */
async function adminOnly(req, res, next) {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', req.memberId)
    .single();
  if (error || !data || !data.is_admin) {
    return res.status(403).send('Forbidden');
  }
  next();
}

// Return basic information about the currently authenticated member
app.get('/api/member', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.memberId)
    .single();
  if (error || !data) return res.status(404).send('Not found');
  res.json({
    id: data.id,
    email: data.email,
    name: data.display_name,
    isAdmin: data.is_admin
  });
});

// Fetch all charges associated with the logged in member from Supabase
app.get('/api/my-charges', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('charges')
    .select('*')
    .eq('member_id', req.memberId);
  if (error) return res.status(500).json({ error: error.message });

  const mapped = (data || []).map((row) => ({
    id: row.id,
    memberId: row.member_id,
    status: row.status,
    amount: row.amount,
    dueDate: row.due_date,
    description: row.description,
    tags: row.tags,
    partialAmountPaid: row.partial_amount_paid || 0,
  }));

  res.json(mapped);
});

// Retrieve the payment history for the authenticated member
app.get('/api/payments', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('member_id', req.memberId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(
    (data || []).map((p) => ({
      id: p.id,
      memberId: p.member_id,
      chargeId: p.charge_id,
      amount: p.amount,
      date: p.date,
      memo: p.memo
    }))
  );
});

// Allow a member to request a manual review of a payment
// POST /api/review
app.post('/api/review', auth, async (req, res) => {
  // 1) Pull only the fields you need
  const { amount, memo, date } = req.body || {};

  // 2) Validate
  if (amount == null) {
    return res.status(400).json({ error: 'Missing amount' });
  }

  // 3) Reviews are independent of charges, so we don't modify charge status.

  // 4) Insert a standalone review record
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      member_id: req.memberId, // who sent it
      amount, // how much
      memo: memo || '', // optional note
      date: date || new Date().toISOString().slice(0, 10) // default today as YYYY-MM-DD
    })
    .select();

  // 5) Error handling
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const inserted = Array.isArray(data) ? data[0] : data;

  // 6) Success
  res.json({ success: true, review: inserted });
});


// ------------------------------
// Admin routes
// ------------------------------

// Return a list of all members without exposing passwords
app.get('/api/admin/members', auth, adminOnly, async (req, res) => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(
    (data || []).map((m) => ({
      id: m.id,
      email: m.email,
      name: m.display_name,
      isAdmin: m.is_admin,
      status: m.status,
      initiationDate: m.initiation_date,
      amountOwed: m.amount_owed,
      tags: m.tags
    }))
  );
});

// Create a new member record
app.post('/api/admin/members', auth, adminOnly, async (req, res) => {
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
  const id = crypto.randomUUID();
  const { error } = await supabase.from('profiles').insert({
    id,
    email,
    display_name: name,
    is_admin: isAdmin,
    status,
    initiation_date: initiationDate,
    amount_owed: amountOwed,
    tags,
    password
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id });
});

// Update an existing member
app.put('/api/admin/members/:id', auth, adminOnly, async (req, res) => {
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
  const { error } = await supabase
    .from('profiles')
    .update({
      email,
      password,
      display_name: name,
      is_admin: isAdmin,
      status,
      initiation_date: initiationDate,
      amount_owed: amountOwed,
      tags
    })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Delete a member by id
app.delete('/api/admin/members/:id', auth, adminOnly, async (req, res) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Charge management

// Return all charges in the system
app.get('/api/admin/charges', auth, adminOnly, async (req, res) => {
  const { data, error } = await supabase.from('charges').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(
    (data || []).map((c) => ({
      id: c.id,
      memberId: c.member_id,
      status: c.status,
      amount: c.amount,
      dueDate: c.due_date,
      description: c.description,
      tags: c.tags,
      partialAmountPaid: c.partial_amount_paid || 0
    }))
  );
});

// Create a new charge for a member
app.post('/api/admin/charges', auth, adminOnly, async (req, res) => {
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
  const { data, error } = await supabase
    .from('charges')
    .insert({
      member_id: memberId,
      status,
      amount,
      due_date: dueDate,
      description: description || '',
      tags
    })
    .select();
  if (error) return res.status(500).json({ error: error.message });
  const inserted = Array.isArray(data) ? data[0] : data;
  res.json({
    id: inserted.id,
    memberId: inserted.member_id,
    status: inserted.status,
    amount: inserted.amount,
    dueDate: inserted.due_date,
    description: inserted.description,
    tags: inserted.tags,
    partialAmountPaid: inserted.partial_amount_paid || 0
  });
});

// Update an existing charge by id
app.put('/api/admin/charges/:id', auth, adminOnly, async (req, res) => {
  const { status, amount, dueDate, description, tags } = req.body || {};
  const { error } = await supabase
    .from('charges')
    .update({
      status,
      amount,
      due_date: dueDate,
      description,
      tags
    })
    .eq('id', Number(req.params.id));
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Remove a charge from the system
app.delete('/api/admin/charges/:id', auth, adminOnly, async (req, res) => {
  const { error } = await supabase
    .from('charges')
    .delete()
    .eq('id', Number(req.params.id));
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Payment review endpoints

// List all submitted payment reviews
app.get('/api/admin/reviews', auth, adminOnly, async (req, res) => {
  const { data: revs, error } = await supabase.from('reviews').select('*');
  if (error) return res.status(500).json({ error: error.message });
  const mapped = (revs || []).map((r) => ({
    id: r.id,
    memberId: r.member_id,
    amount: r.amount,
    memo: r.memo,
    date: r.date
  }));
  res.json(mapped);
});

// Approve a review and mark the associated charge as paid
app.post('/api/admin/reviews/:id/approve', auth, adminOnly, async (req, res) => {
  const reviewId = Number(req.params.id);
  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single();
  if (error || !review) return res.status(404).send('Not found');

  let remaining = Number(review.amount);
  let chargesQuery;
  chargesQuery = await supabase
    .from('charges')
    .select('*')
    .eq('member_id', review.member_id);
  if (chargesQuery.error)
    return res.status(500).json({ error: chargesQuery.error.message });
  chargesQuery.data = chargesQuery.data
    .filter((c) => c.status !== 'Paid' && c.status !== 'Deleted by Admin')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const targets = chargesQuery.data;
  const totalDue = targets.reduce(
    (sum, c) => sum + (c.amount - (c.partial_amount_paid || 0)),
    0
  );
  if (remaining > totalDue) {
    return res.status(400).json({ error: 'Payment exceeds outstanding charges' });
  }

  for (const charge of targets) {
    const paidSoFar = Number(charge.partial_amount_paid || 0);
    const due = charge.amount - paidSoFar;
    if (remaining >= due) {
      charge.status = 'Paid';
      charge.partial_amount_paid = 0;
      remaining -= due;
    } else if (remaining > 0) {
      charge.status = 'Partially Paid';
      charge.partial_amount_paid = paidSoFar + remaining;
      remaining = 0;
    }
    await supabase
      .from('charges')
      .update({
        status: charge.status,
        partial_amount_paid: charge.partial_amount_paid
      })
      .eq('id', charge.id);
    if (remaining === 0) break;
  }

  await supabase.from('payments').insert({
    member_id: review.member_id,
    amount: review.amount,
    date: review.date || new Date().toISOString(),
    memo: review.memo
  });

  await supabase.from('reviews').delete().eq('id', reviewId);
  res.json({ success: true });
});

// Reject a payment review without applying a payment
app.post('/api/admin/reviews/:id/reject', auth, adminOnly, async (req, res) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', Number(req.params.id));
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Simple health check endpoint
app.get('/', (req, res) => res.send('Server running'));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

app.get('/debug/auth', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return res.status(400).json({ error: 'no token sent' });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return res.json({ data, error });
});

app.get('/debug/env', (req, res) => {
  res.json({
    url: process.env.SUPABASE_URL || null,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
});

module.exports = app;
