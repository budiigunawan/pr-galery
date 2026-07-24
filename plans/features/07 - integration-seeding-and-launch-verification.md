# Feature 07: Integration, Seeding & Launch Verification

## Overview

The final, sequential pass after all other features are built: seed the real database, run the full quality-gate sequence, and manually verify the complete site end-to-end in a browser. This is where mismatches between features that only surface once wired together (e.g. a data-layer type not quite matching a UI component's prop shape) get caught and reconciled.

## Requirements

- Real Neon database is seeded with the production-intended starting content (Feature 02's seed script).
- Full automated quality gate passes: lint, typecheck, unit tests, production build.
- Manual browser verification confirms both the public page and the admin CMS work correctly together, not just in isolation.
- Any integration mismatches found (e.g. prop/type mismatches between Feature 02's query return types and Feature 03/04's component props) are fixed as part of this pass.

## Technical Implementation

Run in order:
1. `npm run lint`
2. `npm run typecheck`
3. `npm run test` (Vitest suite from Features 02 and 05)
4. `npm run db:seed` against the real Neon DB (only if not already seeded during Feature 02's own verification)
5. `npm run build`
6. Manual browser verification (dev server, using a browser tool):
   - **Public page**: hero hardcoded copy renders correctly; product grid shows all seeded products in `sortOrder` inside postmark frames with placeholder images; FAQ docket cards render seeded Q&A; WhatsApp link opens a correctly formatted `wa.me` chat; Pine Deep CTA band has correct contrast; check both a 375px mobile width and a desktop width.
   - **Admin**: logged-out visit to `/admin/products` bounces to `/admin/login`; wrong password shows inline Indonesian error and stays put; correct password sets a cookie and redirects; create/edit/delete on products and FAQ reflect on the public page without a redeploy (confirms `revalidatePath` wiring works end-to-end); contact form upsert updates the singleton row and the public footer; logout clears the cookie and subsequent navigation re-bounces to login; optionally shorten `ADMIN_SESSION_TTL_SECONDS` temporarily to confirm session expiry forces re-login, then restore it.
   - **Basic accessibility sanity**: image alt text present on product photos, form labels present on all CMS forms, Stamp Red never used as body-copy text (only small accents/badges).

## Dependencies

Depends on all of Features 01–06 being complete.

## Acceptance Criteria

- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` all pass cleanly with no warnings that indicate real issues.
- [ ] Real Neon database contains the 6 seeded products, 2 FAQ entries, and 1 contact row, confirmed via `npm run db:studio` or a direct query.
- [ ] End-to-end manual walkthrough of the public page (mobile + desktop) matches the checklist above with no visual or functional defects.
- [ ] End-to-end manual walkthrough of the admin CMS (login, create/edit/delete/reorder for products and FAQ, contact upsert, logout, session expiry) matches the checklist above with no defects.
- [ ] A change made in the admin CMS is confirmed to appear on the public page without requiring a redeploy or manual cache clear.
- [ ] Any integration issues discovered during this pass (type mismatches, prop-shape mismatches, edge cases missed by earlier features) are fixed and re-verified before sign-off.
