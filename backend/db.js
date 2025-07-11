const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tsbyrpuskzsrmjfwckzh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzYnlycHVza3pzcm1qZndja3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI0NTEsImV4cCI6MjA2Nzc2ODQ1MX0.yGJn08v2csysvvgMguUlEV87aTVmL6qoD2bkb1x1lYg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = supabase;
