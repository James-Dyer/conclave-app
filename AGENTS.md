# Codex
Relevant information about the project for the codex agent to understand when performing tasks

## Phases

### Phase 1 - Core Member Portal

Frontend:
- Build the minimal UI necessary for members to log in and view their outstanding charges and payment history.
- Display charge statuses (“Delinquent,” “Outstanding,” “Under Review,” “Paid”).
- Allow a member to submit a simple payment review request with a memo field.
- Pages: login, dashboard, charge details, payment review form.
  
Backend:
- Provide authentication and member data endpoints.
- Implement routes for retrieving charges and payment history.
- Accept payment review submissions.

### Phase 2 - Basic Admin Dashboard

Frontend:
- Add an admin-only section for viewing all members, assigning charges, and reviewing payment confirmation requests.
- Include simple tables or lists for members and charges.
- Provide ability to mark charges as fulfilled or delete them.
- Basic search/filtering capabilites for the admin dashboard
  
Backend:
- Implement admin authentication and role checks.
- Expose APIs to manage members, assign charges, and review payments.
- Implement searching, filtering, and sorting capabilities for member list and charge list

### Phase 3 - Advanced Member & Admin Functions

Frontend:
- Introduce status and tag management (Active, Alumni, etc.).
- Support filtering members or charges by status or tags.
- Implement sending emails where appropriate: admin should be able to send mass reminder or delinquency collections emails.
  
Backend:
- Persist member statuses and tags and provide filtering queries.
- Integrate email services

### Phase 4 - Audit Logs & Full Workflow

Frontend:
- Build interface for audit logs that can be filtered by user, action, or date range.
- Polish workflows for editing charges, applying discounts or interest, and more complex review processes.
  
Backend:
- Record audit logs for key actions and expose search APIs.
- Support bulk operations like mass assignments and charge edits.

### Phase 5 - Front end overhaul
- Everything needs to bbe polished and look good for a good user experience

## Development
When creating new pages that are not directly accessible thru the frontend page only, create a temporary button on the header so the developer can navigate to that new page and check out how it look on thier localhost.
