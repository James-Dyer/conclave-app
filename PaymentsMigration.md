# Payments Table Migration Guide

This guide explains how to migrate from separate `reviews` and `payments` tables into a single unified `payments` table that stores both the payment details and its review status.

## 1. Database Migration

1. **Drop the old tables** if they exist:

```sql
drop table if exists public.reviews cascade;
drop table if exists public.payments cascade;
```

2. **Create the new `payments` table**:

```sql
create table public.payments (
  id           serial         primary key,
  member_id    uuid           not null references public.profiles(id),
  amount       numeric(10,2)  not null,
  date         date           not null default current_date,
  memo         text           default '',
  status       text           not null
                   check (status in ('Under Review','Approved','Denied'))
                   default 'Under Review',
  admin_id     uuid           null references public.profiles(id),
  created_at   timestamptz    not null default now()
);
create index idx_payments_member on public.payments(member_id);
create index idx_payments_status on public.payments(status);
create index idx_payments_admin  on public.payments(admin_id);
```

3. **(Optional) Seed from the old `reviews` table**:

```sql
insert into public.payments (member_id, amount, date, memo, status)
  select member_id, amount, date, memo, 'Under Review' from public.reviews;
```

## 2. API Changes

### 2.1 Remove old routes

- Delete any endpoints under `/api/review`.
- Remove all `/api/admin/reviews` routes.

### 2.2 Add unified `/api/payments` endpoints

1. **Submit a payment review** (member)

```js
// POST /api/payments
app.post('/api/payments', auth, async (req, res) => {
  const { amount, memo, date } = req.body;
  if (amount == null) return res.status(400).json({ error: 'Missing amount' });

  const { data, error } = await supabase
    .from('payments')
    .insert({ member_id: req.memberId, amount, date, memo, status: 'Under Review' })
    .select();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, payment: data[0] });
});
```

2. **List all payments** (member)

```js
// GET /api/payments
app.get('/api/payments', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('member_id', req.memberId);
  if (error) return res.status(500).json({ error: error.message });

  res.json(data.map(p => ({
    id: p.id,
    amount: p.amount,
    date: p.date,
    memo: p.memo,
    status: p.status,
    adminId: p.admin_id
  })));
});
```

3. **Admin review actions**

```js
// POST /api/admin/payments/:id/approve
app.post('/api/admin/payments/:id/approve', auth, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase
    .from('payments')
    .update({ status: 'Approved', admin_id: req.memberId })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, payment: data[0] });
});

// POST /api/admin/payments/:id/deny
app.post('/api/admin/payments/:id/deny', auth, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase
    .from('payments')
    .update({ status: 'Denied', admin_id: req.memberId })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, payment: data[0] });
});
```

4. **Cleanup old routes**: remove `/api/review` and `/api/admin/reviews` handlers.

## 3. Front-End Updates

- **Submit review**: POST to `/api/payments`.
- **Fetch history**: use GET `/api/payments`.
- **Filter by status**: admin UI can call `/api/payments?status=Under%20Review`.
- **Approve/Deny**: `/api/admin/payments/:id/approve` or `/api/admin/payments/:id/deny`.

## 4. Testing & Cleanup

1. Update tests to use the unified `payments` model.
2. Remove old `reviews` fixtures and code.
3. Verify end‑to‑end:
   - Member POSTs a payment; status shows `Under Review` in GET `/api/payments`.
   - Admin approves/denies; status updates accordingly.

With these steps you'll have a single source of truth for all payment activity and its review status.
