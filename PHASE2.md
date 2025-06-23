# Phase 2 Implementation Plan - Basic Admin Dashboard

This document outlines the steps required to implement **Phase 2** as defined in `AGENTS.md`. Phase 2 adds an administrative dashboard with the ability to manage members, charges and payment review requests.

## 1. Backend Changes

1. **Admin Authentication and Roles**
   - Extend the member data model to include an `isAdmin` flag. Only users with `isAdmin: true` are allowed to access admin routes.
   - Update `/api/login` to return the `isAdmin` property so the frontend can route admins to the dashboard.
   - Add a middleware function `adminOnly` that verifies the logged‑in member is an administrator.

2. **Member Management Endpoints**
   - `GET /api/admin/members` – return a list of all members.
   - `POST /api/admin/members` – create a new member account.
   - `PUT /api/admin/members/:id` – update member fields (email, name, status, tags).
   - `DELETE /api/admin/members/:id` – remove a member.

3. **Charge Management Endpoints**
   - `GET /api/admin/charges` – list all charges (optionally filter by member).
   - `POST /api/admin/charges` – assign a new charge to a member or group.
   - `PUT /api/admin/charges/:id` – mark a charge as fulfilled or modify the amount/description.
   - `DELETE /api/admin/charges/:id` – delete a charge.

4. **Payment Review Endpoints**
   - `GET /api/admin/reviews` – list all submitted payment review requests.
   - `POST /api/admin/reviews/:id/approve` – mark a review’s charge as paid.
   - `POST /api/admin/reviews/:id/reject` – reject a review and leave an optional note.

5. **Data Storage**
   - Continue to use in‑memory arrays for Phase 2.
   - Ensure each new record type has an incremental id field similar to `nextReviewId` in Phase 1.

## 2. Frontend Changes

1. **Admin Login Flow**
   - After a successful login, check the `isAdmin` flag from the server.
   - If the user is an admin, show a link to the admin dashboard in the header.

2. **Admin Dashboard Page**
   - Create a new `AdminDashboard` component.
   - Display tabs or sections for:
     - Member list
     - Charge list
     - Payment review requests
   - Use simple tables or lists for the data (id, name, amount, status, etc.).

3. **Member Management UI**
   - Provide a form or button to add new members.
   - Allow editing existing member details.
   - Include delete functionality with a confirmation prompt.

4. **Charge Management UI**
   - Allow admins to assign a new charge via a form (member selection, amount, description, due date).
   - Display existing charges with actions to mark as fulfilled or delete.

5. **Payment Review Handling**
   - Show submitted payment review requests in a list.
   - Provide approve and reject buttons for each review.

6. **Temporary Navigation**
   - Follow the guideline from `AGENTS.md`: add a temporary button in the header that links to the new Admin Dashboard so developers can reach it during development.
   - Remove or hide the button once proper routing is added in later phases.

## 3. Integration Steps

1. **API Client Updates**
   - Extend `apiClient.js` with functions for all new admin endpoints.
   - Ensure each request sends the auth token via the `Authorization` header.

2. **State Management**
   - Use React state (or context if needed) to store lists of members, charges and reviews.
   - Fetch the data when the Admin Dashboard mounts and refresh after any modification.

3. **Error Handling and Loading States**
   - Display loading indicators while data is being fetched.
   - Show simple error messages on API failures.

## 4. Testing Checklist

- Verify that non‑admin users cannot access admin routes (both backend and frontend).
- Confirm that admins can create, edit and delete members and charges.
- Ensure approving a review marks the correct charge as paid.
- Manual testing through the temporary navigation button for all new pages.

This plan implements the tasks listed for Phase 2 and prepares the project for the more advanced features of later phases.

