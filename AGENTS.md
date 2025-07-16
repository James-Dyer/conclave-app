# Codex
Relevant information about the project for the codex agent to understand when performing tasks. The full list of color and spacing variables used by the frontend lives in `frontend/StyleGuide.md`.

## Development Guide
- By default don't use emojis where they don't need to be. Particularly logs and debug statements.

### Login workflow
Log in and grab the token
```
TOKEN=$(curl -s https://conclave-app.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin"}' \
  | jq -r .token)
echo $TOKEN
```


To hit the “member dashboard” route (GET /api/member):
```
curl -i https://conclave-app.onrender.com/api/member \
  -H "Authorization: Bearer $TOKEN"
```


Hit admin gaurded route
```
curl -i https://conclave-app.onrender.com/api/admin/members \
  -H "Authorization: Bearer $TOKEN"
```

When needed, pull the .env variables into the shell
```
set -a
source .env
set +a
```

## Supabase Tables

Conclave stores its data in three core tables:

- **profiles** – member information and permissions
  - `id` uuid primary key referencing `auth.users`
  - `email`
  - `name`
  - `is_admin` boolean flag
  - `status`
  - `initiation_date`
  - `amount_owed`
  - `tags` text array
  - `inserted_at` timestamp with time zone
- **charges** – dues and fines assigned to members
  - `id` bigserial primary key
  - `member_id` uuid referencing `profiles.id`
  - `status`
  - `amount`
  - `due_date`
  - `description`
  - `tags` text array
  - `partial_amount_paid` numeric
- **payments** – member payment submissions
  - `id` bigserial primary key
  - `member_id` uuid referencing `profiles.id`
  - `amount`
  - `date`
  - `memo`
  - `status`
  - `admin_id` uuid of approving admin
  - `admin_note` text reason when payment denied

## Supabase Clients

The backend exposes two Supabase client instances:

- **`supabase`** – defined in `backend/db.js` using the anon public key. It is
  used for all regular queries against tables like `profiles`, `charges` and
  `payments`.
- **`supabaseAdmin`** – defined in `backend/adminClient.js` using the service
  role key when available. This client has elevated privileges and is only used
  for privileged actions such as verifying JWTs with
  `supabaseAdmin.auth.getUser()` and calling the `create_user_with_profile`
  function during admin member creation.

In general, use `supabase` for standard CRUD operations and reach for
`supabaseAdmin` only when a service role is required.

## Reusable Frontend Components

Several React components in `frontend/src/components` provide shared functionality used across the application:

- **ConfirmDialog** – A custom confirmation popup for actions like approving or denying payments. It supports an optional text input and exposes handlers for confirm and cancel actions.
- **SortMenu** – A dropdown select for choosing the current sort order. Pass option objects, a value and `onChange`.
- **FilterMenu** – Checkbox lists for filtering by status and tags. Accepts options and change handlers for each.
- **SearchBar** – Generic text input used for searching tables.
- **DataTable** – Basic table renderer configured via column definitions, data rows and an optional actions render function. It paginates 10 rows per page with navigation buttons.
- **NotificationContainer / NotificationContext** – Global toast system for temporary messages. Call `addNotification` to display a message; the container renders them stacked in the corner.

These keep common UI logic centralized so pages like `MembersList` and `ChargesList` stay concise.
## Documenting Database Schema Changes
When implementing features that require new Supabase columns or tables, clearly describe the required schema updates in your pull request summary.
Note any new column names, types and defaults so the Supabase instance can be updated accordingly.
