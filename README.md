# Conclave - Chapter Finance Management Web App

**Conclave** is the Lambda Delta chapter of Sigma Chi's internal financial management system. It is a private, login-secured web application built to manage fraternity dues, fines, and payment verification workflows — with a design philosophy centered on clarity, functionality, and zero bloat.

## Project Purpose

Conclave serves as the Lambda Delta chapter's platform for:
- Managing dues, fines, and charges
- Tracking member payment status
- Tracking and reviewing Zelle payments
- Facilitating administrative control and auditing
- Enforcing accountability for both members and admins

## Features

### Member Functionality
- Secure login via email and password
- View outstanding charges and payment history
- Submit a payment review request if a Zelle payment has not been recorded
  - Include memo/note with transaction details
- Track the status of each charge: `Delinquent`, `Outstanding`, `Under Review`, or `Paid`

### Admin Functionality
- View and search the member directory
- Browse all charges with sort and filter tools
- Delete charges when needed
- Mark charges as fulfilled
- Review and approve or reject payment confirmations


## Payment Workflow

- Members submit dues and fines using Zelle to the chapter account
- After sending payment, members may submit a review request within the app
- Admins verify payments using the chapter’s banking records (Chase Mobile app or emails from Zelle)
- Upon confirmation, the admin marks the charge as paid and logs the action

## Statuses and Tags

Each user is assigned:
- A **status**: `Active`, `Alumni`, `Inactive`, `Suspended`, or `Expelled`
- One or more **tags** for flexible grouping (e.g., `Fall 2024`, `Exec Board`, `Beta Class`)

These are used for charge targeting and filtering within the admin dashboard.

## Technical Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React                   |
| Backend   | Node.js + Express |
| Database  | Postgres (Supabase) |
| Auth      | Supabase |
| Hosting   | GitHub Pages (frontend) |
|           | Backend TBD |
| Domain    | Existing public domain `ucmsigmachi.org` reused via routing or subdomain |

## Architecture

```
conclave-app/
│
├── backend/              ← Node + Express
│    ├── test
│    └── index.js
│
├── frontend/             ← React app
│    ├── public
│    └── src
│         ├── components  ← JS Components
│         └── styles      ← CSS
│
├── README.md
└── AGENTS.md             ← Instructions for Codex AI
```

This project will be maintained in its own repository (`conclave-app`) and will be linked from the chapter's public website (`lambda-delta-chapter-website` repo).

- The public website remains informational and publicly visible
- Conclave is accessed via a “Conclave” button, linking to `/conclave` or a subdomain like `members.chapter-domain.org` - TBD
- Auth is required for all access to Conclave

## Running the App Locally

1. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```
The backend requires the following environment variables:
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`, and
`SUPABASE_SERVICE_ROLE_KEY`. See `SupabaseSetup.md` for details on
configuring the database and obtaining these values.

There is a `.env.example` for in both the frontend and backend dirs.

### Authentication in Development

The React app stores the login token in `localStorage` using a lightweight
`AuthProvider`. After logging in, the token persists across page refreshes until
you click the **Logout** button in the header.

## Testing

Automated tests exist for both the frontend and backend. Run them with `npm test`
or generate coverage reports with `npm run test:coverage`.

### Frontend

```bash
cd frontend
npm run test:coverage
```

### Backend

```bash
cd backend
npm run test:coverage
```

## Design Philosophy

- No unnecessary features — strictly chapter-specific functionality
- Minimal, clean user interface
- Fast and understandable admin tools
- Easily maintainable by future treasurers or tech chairs

## License

This project is developed for internal use within the Lambda Delta chapter of Sigma Chi. Distribution outside the chapter is not authorized without permission.
