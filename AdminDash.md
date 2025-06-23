# Admin Dashboard Redesign Plan

This document outlines the redesign of the admin dashboard by splitting key functionality into dedicated pages while keeping high‑priority payment review tasks easily accessible.

## Quick Links Section

- **Members** – "Browse and manage all member accounts"
- **Charges** – "View and update all assigned charges"
- **Payment Reviews** – "Approve or reject submitted proofs"

Each quick link will be presented as a button with a short 5–8 word description so admins can immediately navigate to the appropriate tool. The Members and Charges links open their own pages. Payment Reviews remain on the dashboard with a reserved section for future enhancements.

## Dashboard Layout

1. **Header**
   - Displays the page title and any temporary navigation controls required during development.
2. **Quick Links**
   - Horizontally arranged buttons for Members, Charges and Payment Reviews.
   - Each button includes a concise description underneath.
3. **Payment Reviews Section**
   - Placeholder area for handling review requests.
   - Will eventually show a table of pending reviews with approve/reject actions.
4. **Additional Tools (Future)**
   - Space for new quick links as more admin features are added.

## Navigation Strategy

- The header contains temporary buttons to reach new pages during development per `AGENTS.md` guidelines.
- Members and Charges buttons direct to the new `MembersList` and `ChargeList` pages respectively.
- The Payment Reviews area stays on the main dashboard due to its priority status.

## Component Reuse

- Shared components such as search bars or sort/filter menus should be abstracted so they can be reused on both the Members and Charges pages.

