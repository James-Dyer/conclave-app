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
