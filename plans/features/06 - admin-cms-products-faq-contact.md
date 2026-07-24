# Feature 06: Admin CMS: Products, FAQ & Contact Management

## Overview

The actual content-management screens: CRUD for products and FAQ entries, and a singleton edit form for contact info — the tools the business owner uses day-to-day to keep the public site current. Bundled into one feature since all three follow the same simple Server-Action-backed CRUD pattern and share the same admin layout/nav.

## Requirements

- All `/admin/*` routes in this feature sit behind Feature 05's auth gate; every mutating Server Action independently calls `requireSession()` as defense in depth.
- **Products**: list view (shows all products including inactive ones, in `sortOrder`, with an indicator for inactive items), create form, edit form, delete action, and a way to reorder (sort order controls). Form fields: name, description, category, image URLs (entered as a multi-line/comma-separated text field, parsed into an array per Feature 02's validation), format/size options (optional free text), active/inactive toggle.
- **FAQ**: list view (in `sortOrder`), create form, edit form, delete action, reorder controls. Form fields: question, answer.
- **Contact info**: single edit form (no list/create/delete — it's a singleton) for WhatsApp number, email, Instagram handle, Shopee URL. Always upserts.
- Every successful mutation calls `revalidatePath("/")` (so the public page reflects changes immediately) plus the relevant `/admin/...` list path.
- Form validation errors (from Feature 02's zod schemas) must surface as clear inline messages next to the relevant field — not a generic failure page.
- Deleting a product or FAQ entry requires an explicit confirm step (not a single accidental click) — e.g. a confirm dialog or a two-step "are you sure" affordance.
- Admin UI uses plain Tailwind styling and only `Button` from Feature 03's shared components — no paper-craft/postmark motif needed here; keep this area visually simple and utilitarian.

## Technical Implementation

**`lib/actions/products.ts`, `faq.ts`, `contact.ts`** (all `"use server"`): each action calls `requireSession()` first, then the relevant zod parse function from `lib/validation/*` (Feature 02), then the relevant `lib/db/queries/*` function (Feature 02), then `revalidatePath(...)`. Actions: `createProductAction`, `updateProductAction`, `deleteProductAction`, `reorderProductsAction`; mirrored `*FaqAction` set; `upsertContactAction`.

**Routes**:
```
app/admin/
  page.tsx                 # redirect -> /admin/products
  products/
    page.tsx               # list + delete + reorder controls, "New product" link
    new/page.tsx            # ProductForm bound to createProductAction
    [id]/edit/page.tsx      # ProductForm pre-filled, bound to updateProductAction
  faq/
    page.tsx
    new/page.tsx
    [id]/edit/page.tsx
  contact/page.tsx          # ContactForm bound to upsertContactAction
```

**`components/admin/`**:
- `AdminNav.tsx` — simple nav between Products / FAQ / Contact / Logout.
- `ProductForm.tsx` — shared between new/edit; uses `useActionState` for submission + inline error display.
- `FaqForm.tsx` — same pattern for FAQ.
- `ContactForm.tsx` — same pattern for the singleton contact row.
- `DeleteButton.tsx` — confirm-then-delete control, reused by products and FAQ list views.
- `SortOrderControls.tsx` — up/down (or drag-free numeric) controls to adjust `sortOrder`, reused by both list views.

No client-side form library — React 19's `useActionState` plus native `<form action={...}>` and the zod schemas from Feature 02 are sufficient for these three small forms.

## Dependencies

Depends on Feature 02 (query functions, validation schemas), Feature 03 (`Button` component only), and Feature 05 (session/auth). Should not be built in parallel with Feature 04 in a way that touches the same files — the two features share no files, so they can proceed in parallel once their shared dependencies (02, 03, 05) are done.

## Acceptance Criteria

- [ ] Logged in as admin, `/admin/products` lists all 6 seeded products with correct `sortOrder`, showing active/inactive status.
- [ ] Creating a new product with valid input appears on both `/admin/products` and the public `/` page without a redeploy.
- [ ] Submitting a product form with a missing required field (e.g. blank name) shows an inline validation error and does not create a broken/partial record.
- [ ] Editing an existing product's fields (including image URLs and active toggle) persists and is reflected on the public page.
- [ ] Deleting a product requires a confirm step, then removes it from both the admin list and the public page.
- [ ] Reordering products changes their display order on the public page's product grid.
- [ ] The same create/edit/delete/reorder behavior works correctly for FAQ entries.
- [ ] `/admin/contact` loads the current contact info pre-filled, and saving updates the singleton row (verified: saving twice does not create a second row) and updates the public footer's contact links.
- [ ] All mutating actions reject the request (redirect to login) if called without a valid session — verified by attempting a direct action call after clearing the session cookie.
- [ ] `npm run lint`, `npm run typecheck`, and `npm run build` pass with all admin routes and actions in place.
