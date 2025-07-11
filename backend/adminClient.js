const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tsbyrpuskzsrmjfwckzh.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseAdmin;
if (SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
} else {
  supabaseAdmin = {
    auth: {
      async getUser() {
        return { data: { user: null }, error: new Error('Service role key missing') };
      }
    }
  };
}

module.exports = supabaseAdmin;
