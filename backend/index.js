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

async function isAdmin(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
  if (error) return false;
  return !!data.is_admin;
}

// Retrieve payments. Members get their own records.
// Admins can filter by status to view pending submissions.
app.get('/api/payments', auth, async (req, res) => {
  const { status } = req.query;
  const admin = await isAdmin(req.memberId);

  let query = supabase.from('payments').select('*');
  if (!admin || !status) {
    query = query.eq('member_id', req.memberId);
  }
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(
    (data || []).map((p) => ({
      id: p.id,
      memberId: p.member_id,
      amount: p.amount,
      date: p.date,
      memo: p.memo,
      status: p.status,
      adminId: p.admin_id,
      adminNote: p.admin_note
    }))
  );
});

// Submit a payment for review
app.post('/api/payments', auth, async (req, res) => {
  const { amount, memo, date } = req.body || {};
  if (amount == null) {
    return res.status(400).json({ error: 'Missing amount' });
  }

  const { data, error } = await supabase
    .from('payments')
    .insert({
      member_id: req.memberId,
      amount,
      date: date || new Date().toISOString().slice(0, 10),
      memo: memo || '',
      status: 'Under Review',
      admin_note: ''
    })
    .select();
  if (error) return res.status(500).json({ error: error.message });
  const inserted = Array.isArray(data) ? data[0] : data;
  res.json({ success: true, payment: inserted });
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

// Payment approval endpoints for the unified payments table
app.post('/api/admin/payments/:id/approve', auth, adminOnly, async (req, res) => {
  const paymentId = Number(req.params.id);

  // Load the payment
  const { data: [payment], error: payErr } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId);
  if (payErr || !payment) return res.status(404).json({ error: 'Payment not found' });
  console.log('👉 Approving payment:', payment);

  let remaining = Number(payment.amount);

  // Fetch outstanding charges
  const { data: charges, error: chErr } = await supabase
    .from('charges')
    .select('*')
    .eq('member_id', payment.member_id)
    .in('status', ['Outstanding','Delinquent','Partially Paid'])
    .order('due_date', { ascending: true });
  if (chErr) {
    console.error('Error fetching charges:', chErr);
    return res.status(500).json({ error: chErr.message });
  }
  console.log('Outstanding charges:', charges);

  // Allocate
  for (const c of charges) {
    const paidSoFar = Number(c.partial_amount_paid || 0);
    const due       = Number(c.amount) - paidSoFar;
    console.log(`— charge ${c.id}: due ${due}, remaining ${remaining}`);

    let upd;
    if (remaining >= due) {
      upd = { status: 'Paid', partial_amount_paid: 0 };
      remaining -= due;
    } else if (remaining > 0) {
      upd = { status: 'Partially Paid', partial_amount_paid: paidSoFar + remaining };
      remaining = 0;
    } else {
      break;
    }

    const { error: updErr } = await supabase
      .from('charges')
      .update(upd)
      .eq('id', c.id);

    if (updErr) {
      console.error(`❌ Failed to update charge ${c.id}:`, updErr);
      return res.status(500).json({ error: updErr.message });
    }
    console.log(`Charge ${c.id} updated to`, upd);
  }

  // Mark payment approved
  const { data: updated, error: updPayErr } = await supabase
    .from('payments')
    .update({ status: 'Approved', admin_id: req.memberId })
    .eq('id', paymentId)
    .select();
  if (updPayErr) {
    console.error('Failed to update payment status:', updPayErr);
    return res.status(500).json({ error: updPayErr.message });
  }

  console.log('🎉 Payment approved:', updated[0]);
  res.json({ success: true, payment: updated[0] });
});


app.post('/api/admin/payments/:id/deny', auth, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const { note } = req.body || {};
  if (!note) return res.status(400).json({ error: 'Missing denial note' });
  const { data, error } = await supabase
    .from('payments')
    .update({ status: 'Denied', admin_id: req.memberId, admin_note: note })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, payment: Array.isArray(data) ? data[0] : data });
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
