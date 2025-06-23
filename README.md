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
- View and manage all members and their charges
- Assign charges to:
  - Individual members
  - Groups filtered by status (e.g., Active)
  - Tags (e.g., Beta Class)
- Edit assigned charges:
  - Apply flat or percentage-based discounts or interest
  - Leave internal notes
- Delete charges if necessary
- Manually mark charges as fulfilled
- Review submitted payment confirmations
  - Email/SMS notifications with a direct review link (optional)
- Send reminders to delinquent members
- View full audit logs of all financial activity and admin actions

### Audit Logging
- All charge creation, edits, deletions, and payment review actions are logged
- Logs are filterable by:
  - Admin username
  - Action type
  - Affected member
  - Date range
- Audit logs are only visible to admins

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
| Backend   | TBD: Maybe Node.js + Express?       |
| Database  | TBD              |
| Auth      | TBD     |
| Hosting   | GitHub Pages (frontend) |
|           | Backend TBD |
| Domain    | Existing public domain `ucmsigmachi.org` reused via routing or subdomain |

## Architecture

```
conclave-app/
│
├── backend/                ← Backend tools
│   ├── index.js
│   ├── routes/
│   ├── models/
│   ├── config/
│   └── package.json
│
├── frontend/               ← React app (frontend)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── node_modules/
│
├── README.md
└── .gitignore
```

This project will be maintained in its own repository (`conclave-app`) and will be linked from the chapter's public website (`lambda-delta-chapter-website` repo).

- The public website remains informational and publicly visible
- Conclave is accessed via a “Member Login” button, linking to `/conclave` or a subdomain like `members.chapter-domain.org` - TBD
- Auth is required for all access to Conclave


## Design Philosophy

- No unnecessary features — strictly chapter-specific functionality
- Minimal, clean user interface
- Fast and understandable admin tools
- Easily maintainable by future treasurers or tech chairs

## License

This project is developed for internal use within the Lambda Delta chapter of Sigma Chi. Distribution outside the chapter is not authorized without permission.
