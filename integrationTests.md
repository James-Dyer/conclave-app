# Integration Test Guide

This document summarizes the integration tests found under `backend/test`.
Each test spins up the Express server with a mocked Supabase client so the
entire API can be exercised without a real database.

## adminClient.test.js
- **exports stub when SERVICE_ROLE_KEY missing** – ensures the `adminClient` module returns a stub client if no service role key is configured.
- **creates client when SERVICE_ROLE_KEY provided** – verifies a real Supabase client is created when the service role key exists.

## index.test.js
- **login succeeds with valid credentials** – user can log in with correct email and password.
- **login fails with invalid credentials** – invalid login attempts return 401.
- **get member data requires auth** – `/api/member` requires a valid JWT.
- **payment submission validates fields** – posting a payment without required fields returns 400.
- **submit payment succeeds** – successfully submits a payment and confirms it appears in the member's list.
- **admin endpoints enforce permissions and can approve payment** – ensures regular users cannot access admin routes, while admins can approve payments and see results.
- **admin can approve payment** – basic approval path verifying status updates.
- **search members by status** – search filter returns expected members.
- **admin members endpoint returns aggregated balances** – admin query aggregates outstanding balances per member.

## admin_crud.test.js
- **admin member CRUD works** – full create, update, delete flow for member records.
- **admin charge CRUD works** – create, update, and delete charges via admin endpoints.
- **admin can deny a payment request** – denial workflow reverts charge status and stores the admin note.

## routes.test.js
- **charges route returns data with stubbed supabase** – verifies the charges route works with a simple stubbed client.
- **members route returns data with stubbed supabase** – same as above for the members route.

## payment_flow.test.js
- **single charge approved** – approving a single payment fully pays the matching charge.
- **single charge denied** – denying a single payment leaves the charge outstanding.
- **two charges one payment approved** – payment larger than the first charge rolls the remainder to the next charge.
- **two charges two payments mixed** – mix of approved and denied payments affects charge statuses accordingly.
- **two charges three payments complex** – complex sequence of approvals and denials covering edge scenarios.

Run all tests with:

```bash
cd backend
npm test
```
