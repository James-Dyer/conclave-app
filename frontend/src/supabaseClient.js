import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  'https://tsbyrpuskzsrmjfwckzh.supabase.co';
const supabaseAnon =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzYnlycHVza3pzcm1qZndja3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI0NTEsImV4cCI6MjA2Nzc2ODQ1MX0.yGJn08v2csysvvgMguUlEV87aTVmL6qoD2bkb1x1lYg';

let supabase;

export async function getValidAccessToken() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  let { session } = data || {};
  if (
    session &&
    session.expires_at &&
    session.expires_at * 1000 - Date.now() < 60000
  ) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    session = refreshed.session || session;
  }
  return session ? session.access_token : null;
}

async function authorizedFetch(input, init = {}) {
  const token = await getValidAccessToken();
  init = init || {};
  init.headers = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  return fetch(input, init);
}

supabase = createClient(supabaseUrl, supabaseAnon, {
  global: {
    fetch: authorizedFetch
  }
});

export { supabase, authorizedFetch as authFetch };
