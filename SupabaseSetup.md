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
  display_name text,
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
