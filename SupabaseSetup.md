# Supabase + Render Setup

This guide explains how to configure Supabase Postgres and deploy it on Render.

## 1. Create the Supabase project
1. Sign in at [https://supabase.com/](https://supabase.com/) and create a new project.
2. Note your **Project URL** and **anon public key**. These values are required for the backend. Example values are stored in `backend/db.js` and can be overridden with the environment variables `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## 2. Database schema
Run the following SQL in the Supabase SQL editor to create the required tables. The `profiles` table links to `auth.users` so each user has a matching profile row.

```sql
-- User profile data
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  name text,
  is_admin boolean default false,
  status text default 'Active',
  initiation_date date,
  amount_owed numeric default 0,
  tags text[] default '{}',
  inserted_at timestamp with time zone default now()
);

-- Financial charges
create table if not exists charges (
  id bigserial primary key,
  member_id uuid references profiles(id) on delete cascade,
  status text default 'Outstanding',
  amount numeric not null,
  due_date date not null,
  description text,
  tags text[] default '{}'
);

```

Sample data is available in the `mock-data` directory. You can import the
`profiles.csv` and `charges.csv` files directly through the Supabase table
editor using the **Import Data** option.

## 3. Backend configuration
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Set environment variables on Render (or locally in a `.env` file):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_JWT_SECRET` (found under Project Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (also under Project Settings → API)
3. Deploy the backend to Render as a web service pointing to `backend/index.js`.

The `/signup` endpoint in `index.js` demonstrates how to create a user with Supabase auth and store additional info in the `profiles` table.

## 4. create_user_with_profile function

New members are created through a Postgres function executed with the service role key. Define it in the SQL editor:

```sql
create or replace function public.create_user_with_profile(
  p_email text,
  p_full_name text,
  p_status text,
  p_is_admin boolean
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  new_user_id uuid;

begin
  insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data)
  values (gen_random_uuid(), p_email, crypt('password', gen_salt('bf')), now(), '{}')
  returning id into new_user_id;

  -- ensure email logins work immediately
  insert into auth.identities (provider_id, user_id, identity_data, provider)
  values (p_email, new_user_id, json_build_object('email', p_email), 'email');

  insert into public.profiles (id, email, name, status, is_admin)
  values (new_user_id, p_email, p_full_name, p_status, p_is_admin);

  return new_user_id;
end;
$$;
```

The backend calls this procedure via `supabaseAdmin.rpc('create_user_with_profile')`. Ensure the environment variable `SUPABASE_SERVICE_ROLE_KEY` is set so the server can authenticate as the service role. If either the function or key is missing, posting to `/api/admin/members` will fail with **"permission denied for table users"**.

Users created through the admin panel are inserted with the default password
`password` and an email identity so they can sign in immediately after being
added.
