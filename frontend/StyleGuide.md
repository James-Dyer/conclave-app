# Frontend Style Guide Docs

Welcome to the Frontend Style Guide Docs. This guide captures the essential design foundations—colors, typography, responsive grids, core UI components, interaction patterns, and accessibility checks—to create a unified, professional, and accessible dark-themed interface.

## Color Palette

- **Background:** Steel Gray `#1F1C2C`
- **Text / Primary Content:** Gray `#928DAB`
- **Accent / Surfaces:** Off-white `#EDEDED` (or similar—try `#F2F2F2` for a bit more warmth)
- **Optional Highlight:** If you want a pop color for links/buttons, consider Soft Cyan `#4DD0E1` or Coral `#FF6B6B`

## Typography

- **Primary (body) font:** *Inter*\
  Designed for legibility on screens, modern yet professional.
- **Secondary (headings) font:** *Montserrat* or *Poppins*\
  Geometric, clean lines that pair nicely with Inter’s humanist shapes.

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

- Use `margin-block: var(--space-xl)` (~32px) between major sections to keep pages visually open and consistent.

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



## 6. Define Interaction Patterns

- **Hover / Focus Transitions:** 150–200ms cubic-bezier fade
- **Button Press Feedback:** slight scale (0.97) on click
- **Form Validation States:** inline error text in a warm accent (`#FF6B6B`)

## 7. Accessibility & Contrast

- **Contrast checks:**
  - Body text on Steel Gray: `#928DAB` vs `#1F1C2C` → ratio ≈ 7.5:1 ✅
  - Accent text on dark panels: ensure at least 4.5:1 for smaller text
- **Keyboard navigation:**
  - Visible focus outlines, skip-to-content link
- **ARIA roles & landmarks** for `nav`, `main`, `footer`

### Accessibility Checklist

- **Contrast Ratios:**
  - Text vs. background >= 4.5:1 (normal text), >= 3:1 (large text)
- **Focus Indicators:**
  - Visible focus outline on all interactive elements
- **Skip to Content:**
  - "Skip to main content" link present at top
- **ARIA Roles & Landmarks:**
  - `nav`, `main`, `footer` landmarks correctly applied
- **Semantic HTML:**
  - Proper heading order (H1 → H2 → H3...)
- **Keyboard Navigation:**
  - All interactive elements reachable and operable via keyboard
- **Live Regions:**
  - Loading overlays announce status changes via ARIA live regions
- **Error Messaging:**
  - Form errors announced and visually clear with inline messages

