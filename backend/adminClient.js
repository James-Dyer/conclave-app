const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tsbyrpuskzsrmjfwckzh.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const hasServiceRoleKey = Boolean(SERVICE_ROLE_KEY);

// Use a Supabase "server" client when the service role key is configured. In
// local development or tests the key may be absent, so callers should check
// `hasServiceRoleKey` and fall back to local JWT verification when needed.
const supabaseAdmin = hasServiceRoleKey
  ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

module.exports = { supabaseAdmin, hasServiceRoleKey };
