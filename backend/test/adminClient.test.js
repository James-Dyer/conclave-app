
const test = require('node:test');
const assert = require('node:assert/strict');

const modulePath = require.resolve('../adminClient');
const supabasePath = require.resolve('@supabase/supabase-js');

function reload() {
  delete require.cache[modulePath];
  return require('../adminClient');
}

test('exports stub when SERVICE_ROLE_KEY missing', async () => {
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const admin = reload();
  assert.ok(admin.auth);
  const result = await admin.auth.getUser();
  assert.deepEqual(result, {
    data: { user: null },
    error: new Error('Service role key missing')
  });
});

test('creates client when SERVICE_ROLE_KEY provided', () => {
  const stubClient = {};
  const createStub = (...args) => {
    createStub.args = args;
    return stubClient;
  };
  const original = require.cache[supabasePath];
  require.cache[supabasePath] = { exports: { createClient: createStub } };

  process.env.SUPABASE_SERVICE_ROLE_KEY = 'key';
  const admin = reload();
  require.cache[supabasePath] = original;

  assert.strictEqual(admin, stubClient);
  assert.deepEqual(createStub.args, [
    process.env.SUPABASE_URL || 'https://tsbyrpuskzsrmjfwckzh.supabase.co',
    'key',
    { auth: { persistSession: false, autoRefreshToken: false } }
  ]);
});
