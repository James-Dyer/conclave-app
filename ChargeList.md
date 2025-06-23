# Charges List Page Plan

This document specifies the functionality and user interaction design for the new Charges List page.

## Goals

Provide a dedicated page listing all charges in a table.
Offer intuitive tools for sorting, filtering and searching charges.
Surface key admin actions (edit, delete, mark paid, send reminder) inline.
Reuse generic components (Search bar, Sort menu, Filter menu) for consistency with the Members page.
Table Layout

Columns include:

Member
The recipient of the charge, clickable to open member profile.
Description
Charge memo or type (e.g., “Fall 2025 Dues”, “Late Fee”).
Amount
Monetary value due, formatted with currency symbol.
Status
One of: Outstanding, Paid, Delinquent, Under Review.
Due Date
Date by which payment is due.
Tags
Custom tags assigned at charge creation (e.g., “Exec Board”, “Beta Class”).
Actions
Inline buttons for Edit, Delete, Mark as Paid, View Review.
Pagination
Show all charges initially; switch to paginated view (e.g., 25/50/100 rows per page) once the list exceeds a threshold.
Sorting

Sort button opens a menu offering:
Due Date (asc/desc)
Amount (asc/desc)
Status (A→Z)
Member Name (asc/desc)
Sorted results update instantly without full page reload.

Filtering

Filter button opens a panel with:
Status: Outstanding, Paid, Delinquent, Under Review
Due Date: date-range picker
Amount: min/max inputs
Tags: multi-select dropdown
Member Status: Active, Alumni, Inactive, Suspended, Expelled
Active filters appear as removable chips above the table.
Search Bar

Prominently placed above the table.
Searches across Member name, Description text and Tags.
Typing dynamically hides non-matching rows in real time.
Row Actions

Edit
Opens a modal or drawer to adjust charge details (amount, due date, notes, tags).
Delete
Prompts for confirmation before removing the charge.
Mark as Paid
Marks the charge paid, logs the action in the audit log.
View Review (for “Under Review” status)
Opens member’s submitted proof/details.
Bulk Actions

Row checkboxes allow multi-select.
Bulk toolbar appears when ≥1 row is selected, with options to:
Mark as Paid
Send Reminder (email/SMS)
Delete
Interaction Flow

Admin clicks Charges in Quick Links on the Dashboard.
All charges load in the table by default.
Admin may:
Type to search
Click Sort to re-order
Click Filter to narrow results
Select rows for bulk operations
Use inline Actions for individual charge tasks
Table updates instantly; modals/drawers handle edits and confirmations.
Component Reuse Considerations

SearchBar, SortMenu, FilterMenu: same as Members page.
DataTable: generic table component configured via props (columns, actions, pagination).
DateRangePicker and MultiSelectDropdown: reusable across admin pages.
