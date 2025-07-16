const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

const JWT_SECRET = 'test-secret';

function loadCsv(file) {
  const csv = fs.readFileSync(path.join(__dirname, '..', '..', 'mock-data', file), 'utf8');
  return parse(csv, { columns: true, skip_empty_lines: true });
}

let profiles = loadCsv('profiles.csv').map((row) => ({
  id: row.id,
  email: row.email,
  password: row.email === 'admin@example.com' ? 'admin' : 'password',
  name: row.name,
  is_admin: row.is_admin === 'true' || row.is_admin === true,
  status: row.status,
  initiation_date: row.initiation_date,
  amount_owed: Number(row.amount_owed),
  tags: row.tags ? row.tags.replace(/[{}]/g, '').split(',').map((t) => t.trim()).filter(Boolean) : []
}));

let charges = loadCsv('charges.csv').map((row) => ({
  id: Number(row.id),
  member_id: row.member_id,
  status: row.status,
  amount: Number(row.amount),
  due_date: row.due_date,
  description: row.description,
  tags: row.tags ? row.tags.replace(/[{}]/g, '').split(',').map((t) => t.trim()).filter(Boolean) : [],
  partial_amount_paid: 0
}));

let payments = [
  {
    id: 1,
    member_id: profiles[0].id,
    amount: 100,
    date: '2024-04-15',
    memo: 'Dues',
    status: 'Approved',
    admin_id: profiles[1].id,
    admin_note: '',
    platform: 'Zelle'
  }
];
let nextPaymentId = 2;
let nextChargeId = Math.max(...charges.map((c) => c.id)) + 1;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function table(name) {
  if (name === 'profiles') return profiles;
  if (name === 'charges') return charges;
  if (name === 'payments') return payments;
  throw new Error('Unknown table ' + name);
}

function from(name) {
  const store = table(name);
  return {
    select() {
      let data = clone(store);
      const q = {
        eq(col, val) {
          data = data.filter((r) => r[col] === val);
          return q;
        },
        in(col, vals) {
          const arr = Array.isArray(vals)
            ? vals.map((v) => String(v))
            : String(vals)
                .replace(/[()']/g, '')
                .split(',')
                .map((v) => v.trim());
          data = data.filter((r) => arr.includes(String(r[col])));
          return q;
        },
        not(col, op, val) {
          if (op === 'in') {
            const arr = val
              .replace(/[()']/g, '')
              .split(',')
              .map((v) => v.trim());
            data = data.filter((r) => !arr.includes(String(r[col])));
          } else {
            data = data.filter((r) => r[col] !== val);
          }
          return q;
        },
        single() {
          q._single = true;
          return q;
        },
        order(col, opts = {}) {
          const dir = opts.ascending === false ? -1 : 1;
          data = data.slice().sort((a, b) => {
            if (a[col] < b[col]) return -1 * dir;
            if (a[col] > b[col]) return 1 * dir;
            return 0;
          });
          return q;
        },
        or() { return q; },
        then(res) { res({ data: q._single ? data[0] : data, error: null }); },
        async catch() {},
        async finally() {},
        async [Symbol.asyncIterator]() { return data[Symbol.asyncIterator](); }
      };
      q.then = (cb) => Promise.resolve({ data: q._single ? data[0] : data, error: null }).then(cb);
      return q;
    },
    insert(values) {
      const arr = Array.isArray(values) ? values : [values];
      const inserted = arr.map((row) => {
        const r = { ...row };
        if (!r.id) {
          if (name === 'payments') r.id = nextPaymentId++;
          else if (name === 'charges') r.id = nextChargeId++;
        }
        if (name === 'payments' && !('admin_note' in r)) r.admin_note = '';
        store.push(r);
        return r;
      });
      const result = { data: inserted, error: null };
      const promise = Promise.resolve(result);
      promise.select = () => Promise.resolve(result);
      return promise;
    },
    update(fields) {
      return {
        eq(col, val) {
          const updated = [];
          store.forEach((row) => {
            if (row[col] === val) {
              Object.assign(row, fields);
              updated.push(row);
            }
          });
          const result = { data: updated, error: null };
          const promise = Promise.resolve(result);
          promise.select = () => Promise.resolve(result);
          return promise;
        }
      };
    },
    delete() {
      return {
        eq(col, val) {
          const removed = [];
          for (let i = store.length - 1; i >= 0; i--) {
            if (store[i][col] === val) removed.push(...store.splice(i, 1));
          }
          return Promise.resolve({ data: removed, error: null });
        }
      };
    }
  };
}

const supabase = {
  auth: {
    async signInWithPassword({ email, password }) {
      const user = profiles.find((u) => u.email === email && u.password === password);
      if (!user) return { data: {}, error: { message: 'Invalid login' } };
      const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });
      return { data: { session: { access_token: token }, user: { id: user.id, email: user.email } }, error: null };
    },
    async signUp({ email, password }) {
      if (profiles.some((p) => p.email === email)) {
        return { data: {}, error: { message: 'User already registered' } };
      }
      const id = crypto.randomUUID();
      // track auth user separate from profiles; login for new users not needed
      return { data: { user: { id, email } }, error: null };
    },
    async setSession() {
      return { data: null, error: null };
    }
  },
  from
};

const supabaseAdmin = {
  from,
  auth: {
    async getUser(token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = profiles.find((u) => u.id === payload.sub);
        return { data: { user }, error: null };
      } catch (err) {
        return { data: { user: null }, error: err };
      }
    }
  },
  async rpc(fn, params) {
    if (fn !== 'create_user_with_profile') {
      return { data: null, error: new Error('Unknown function') };
    }
    const id = crypto.randomUUID();

    // emulate the SQL procedure which inserts into auth.users, auth.identities
    // and public.profiles
    profiles.push({
      id,
      email: params.p_email,
      password: 'password',
      name: params.p_full_name,
      is_admin: params.p_is_admin,
      status: params.p_status,
      initiation_date: new Date().toISOString().slice(0, 10),
      amount_owed: 0,
      tags: []
    });

    return { data: id, error: null };
  }
};

function reset() {
  profiles = loadCsv('profiles.csv').map((row) => ({
    id: row.id,
    email: row.email,
    password: row.email === 'admin@example.com' ? 'admin' : 'password',
    name: row.name,
    is_admin: row.is_admin === 'true' || row.is_admin === true,
    status: row.status,
    initiation_date: row.initiation_date,
    amount_owed: Number(row.amount_owed),
    tags: row.tags
      ? row.tags
          .replace(/[{}]/g, '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []
  }));

  charges = loadCsv('charges.csv').map((row) => ({
    id: Number(row.id),
    member_id: row.member_id,
    status: row.status,
    amount: Number(row.amount),
    due_date: row.due_date,
    description: row.description,
    tags: row.tags
      ? row.tags
          .replace(/[{}]/g, '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    partial_amount_paid: 0
  }));

  payments = [
    {
      id: 1,
      member_id: profiles[0].id,
      amount: 100,
      date: '2024-04-15',
      memo: 'Dues',
      status: 'Approved',
      admin_id: profiles[1].id,
      admin_note: ''
    }
  ];
  nextPaymentId = 2;
  nextChargeId = Math.max(...charges.map((c) => c.id)) + 1;
}

module.exports = { supabase, supabaseAdmin, reset };
