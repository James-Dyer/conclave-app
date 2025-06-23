# Members List Page Plan

This document specifies the functionality and user interaction design for the new Members List page.

## Goals

- Provide a dedicated page listing all members in a table.
- Offer intuitive tools for sorting, filtering and searching members.
- Reuse generic components wherever possible so similar functionality can be applied to the Charges page.

## Table Layout

Columns include:

1. **Name**
2. **Email**
3. **Status** (Active, Alumni, Inactive, Suspended, Expelled)
4. **Initiation Date**
5. **Amount Owed**
6. **Tags** 

The table should support pagination once the list grows, but initial implementation can show all members.

## Sorting

- A **Sort** button opens a menu listing sort options: Name, Initiation Date, Amount Owed and any other relevant fields with ascending/descending options for each where relevant.

## Filtering

- A **Filter** button opens a menu with checkboxes or dropdowns to narrow the list by:
  - Member status (Active, Alumni, Inactive, Suspended, Expelled)
  - Tags
- Multiple filter criteria can be combined.

## Search Bar

- A search input is displayed prominently above the table.
- Typing a name, class year or tag dynamically hides non-matching rows as the user types.
- This component should be designed for reuse across other admin pages.

## Interaction Flow

1. Admin navigates to the Members page via the Quick Links on the dashboard.
2. By default all members are displayed in a table.
3. Admin may open the Sort menu to order the list.
4. Admin may open the Filter menu to limit the results by status or tag.
5. Admin can type in the search bar to further narrow the displayed members.
6. Combination of sorting, filtering and searching should update the table immediately without leaving the page.

## Component Reuse Considerations

- Implement the Sort menu, Filter menu and Search bar as standalone components.
- These components will later be reused on the Charges page to provide a consistent admin experience.

