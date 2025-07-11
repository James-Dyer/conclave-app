import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || 'https://tsbyrpuskzsrmjfwckzh.supabase.co';
const supabaseAnon =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzYnlycHVza3pzcm1qZndja3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI0NTEsImV4cCI6MjA2Nzc2ODQ1MX0.yGJn08v2csysvvgMguUlEV87aTVmL6qoD2bkb1x1lYg';

export const supabase = createClient(supabaseUrl, supabaseAnon);
