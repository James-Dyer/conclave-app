# Charges List Page Plan

This document specifies the functionality and user interaction design for the new Charges List page.

## Goals

Provide a dedicated page listing all charges in a table.
Offer intuitive tools for sorting, filtering and searching charges.
Surface key admin actions (delete, mark paid) inline.
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
Inline buttons for Delete and Mark as Paid.
Sorting

Sort button opens a menu offering:
Due Date (asc/desc)
Amount (asc/desc)
Sorted results update instantly without full page reload.

Filtering

Filter button opens a panel with:
Status: Outstanding, Paid, Delinquent, Under Review
Tags: multi-select dropdown
Search Bar

Prominently placed above the table.
Searches across Member name, Description text and Tags.
Typing dynamically hides non-matching rows in real time.
Row Actions

Delete
Prompts for confirmation before removing the charge.
Mark as Paid
Marks the charge paid.
Interaction Flow

Admin navigates to the Manage Charges page.
All charges load in the table by default.
Admin may:
Type to search
Click Sort to re-order
Click Filter to narrow results
Use inline Actions for individual charge tasks
Table updates instantly.
Component Reuse Considerations

SearchBar, SortMenu, FilterMenu: same as Members page.
DataTable: generic table component configured via props (columns, actions, pagination).
