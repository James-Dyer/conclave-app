# Codex
Relevant information about the project for the codex agent to understand when performing tasks

## Development

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
  - `display_name`
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
