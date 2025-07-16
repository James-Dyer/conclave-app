# Frontend Style Guide Docs

Welcome to the Frontend Style Guide Docs. This guide captures the essential design foundations—colors, typography, responsive grids, core UI components, interaction patterns, and accessibility checks—to create a unified, professional, and accessible dark-themed interface.

## Color Palette

- **Background:** White `#F2F8FC`
- **Text / Primary Content:** Navy `#282C34`
- **Accent:** Light blue `#a8d0ff` (hover `#82b4e5`)
- **Surfaces:** Light gray `#F5F5F5` with darker `#E0E0E0` for emphasis
- **Status Highlights:** Success `#4CAF50`, error `#B30000`
- **Cards** Background: White #FFFFFF; Border / Shadow: 0 1px 3px rgba(0,0,0,0.1)

## Typography

- **Primary (body) font:** *Inter*\
  Designed for legibility on screens, modern yet professional.
- **Secondary (headings) font:** Roboto Slab

**Base sizes & scale:**

- Body: 16px → Line-height 1.5
- H1–H6 scale: 32 / 24 / 20 / 18 / 16 / 14\


Document A typography style tile showing font-family, weights (300–700), sizes, line-heights.

## 1. Viewport Definitions

| View    | Breakpoint      |
| ------- | --------------- |
| Mobile  | up to 768px     |
| Desktop | 769px and wider |

## 2. Grid Setup

**Mobile (≤768px):**

- Columns: 4
- Gutter (gap): `var(--space-md)` (16px)
- Container: full‑width (no max-width)

**Desktop (≥769px):**

- Columns: 12
- Gutter (gap): `var(--space-lg)` (24px)
- Container: centered, `max-width: 1200px; margin: 0 auto;`

## 3. Spacing Scale

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}
```

Gutter (gap): `var(--space-lg)` (24px)

## 4. Layout Wireframe Guidance

**Header:**

- **Mobile:** spans all 4 cols (logo on left, hamburger on right)
- **Desktop:** spans all 12 cols (logo left, nav centered, CTA/button right)



**Footer:**

- Always spans full width of the grid.

**Section Margins:**

- Use vertical spacing of var(--space-lg) (24px) between sections

## 5. Core UI Components

### DataTable

- **Purpose:** Renders tabular data with a loading overlay for async states.
- **Props:**
  - `columns` array of `{ header, accessor }`
  - `data` array of row objects
  - `renderActions` callback for optional actions column
  - `loading` boolean to show a spinner overlay
- **States:**
  - Internal sorting state (sort column & direction).
- **Accessibility:** Uses semantic `<table>` markup; spinner has `aria-label="loading"` for screen readers.
### ConfirmDialog

- **Purpose:** Modal dialog prompting confirmation, with Confirm/Cancel and optional text input.
- **Props:**
  - `open` boolean to show the dialog
  - `title` heading text
  - `children` content within the body
  - `confirmText` and `cancelText` button labels
  - `onConfirm` and `onCancel` callbacks
  - `inputLabel`, `inputValue`, `onInputChange` for optional text input
  - `errorText` to display validation errors
- **States:**
  - Controlled by the `open` prop
  - Optional input value managed externally

### Buttons

- **PrimaryButton** – Light blue action button used for main actions. Rounded corners.
- **SecondaryButton** – Gray button for less prominent actions like “Back”.

### SearchBar

- **Purpose:** Styled input for entering search queries.
- **Props:**
  - `value` string for the input value
  - `onChange` callback receiving the new value
  - `placeholder` text, default "Search"
- **Styles:**
  - Full-width, rounded corners, inset shadow, search icon on the left.

### FilterMenu

- **Purpose:** Panel of checkbox filters grouped by status and tags.
- **Props:**
  - `statusOptions` array of status strings
  - `selectedStatuses` current selected statuses
  - `tagOptions` array of tag strings
  - `selectedTags` current selected tags
  - `onChangeStatuses` callback
  - `onChangeTags` callback
- **UX:**
  - Collapsible dropdown sections per category; sticky header for long lists.

### SortMenu

- **Purpose:** Select dropdown for choosing sort field and order.
- **Props:**
  - `options` array of `{ label, value }`
  - `value` current selection
  - `onChange` callback
- **Styles:**
  - Compact button that expands into a list of options.

### NotificationContainer

- **Purpose:** Displays toast messages via `NotificationContext`.
- **Context API:** `useNotifications()` returns `{ notifications, addNotification, removeNotification }` from `NotificationContext`.
- **Behaviors:**
  - Vertical stack of toasts, auto-dismiss after 5s, pause on hover, manual close button.

## Member Dashboard Layout

- **Row 1:** Header spanning all 12 columns with page title and global actions.
- **Row 2:** Ten-column container holding four summary cards. The "Mark as Paid" button sits below the cards, right aligned and styled with the brand accent color.
- **Row 3:** Ten-column region split 6/4. The left side contains the charges and payments tables; the right side is reserved for an activity feed or chart.
- During development the rows are temporarily tinted different background colors so their boundaries are clear.
- Empty state tables show an illustration with a short hint instead of plain text (e.g., "Looks like you've got no outstanding charges").