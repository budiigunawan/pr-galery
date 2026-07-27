# Feature 14: Copy Consistency & Revamp QA

## Overview

Final pass across the whole revamped page: unify CTA button vocabulary (the same action should keep the same label everywhere it appears, per plain-language interface-writing practice), then run the full verification sweep across all of features 08–13 together, since several of them touch overlapping parts of `app/page.tsx` and small integration issues (spacing between the new sections, nav-link scroll targets, responsive edge cases) are more likely to surface once everything is combined.

## Requirements

- **CTA copy audit**: as of the pre-revamp page, the "get in touch to order" action is labeled three different ways in three places — hero button ("Hubungi Kami"), feature-band button ("Yuk, Pesan Sekarang"), footer heading ("Pesan Sekarang"). Decide on one consistent label for "go talk to us to place an order" and use it everywhere that exact action appears (the hero CTA and the feature-band CTA, at minimum — the footer's `SectionHeading` "Pesan Sekarang" can stay as a section title rather than a button label, since it's naming the section, not a clickable action, but confirm this distinction still reads clearly once other copy is finalized).
- Spot-check all other button/link labels introduced across features 08–13 (nav links, `TicketStep` copy, contact-row labels) for consistency with each other and with the rest of the site's tone (informal but clear Indonesian, matching existing copy like "Yuk, buat produk impianmu sekarang!").
- **Full verification sweep** (after all of 08–13 are merged/combined):
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build` (catches any issue lint/typecheck miss, e.g. `next/image` config problems with the new local `logo-mark.png` asset)
  - Manual browser check of `/` at 375px, 768px, and 1280px+ widths: nav collapse, hero, product grid + corner stamps, "Cara Pesan" section, feature band, FAQ, footer + tear-edge — confirm nothing overlaps, overflows, or is visually broken at any width.
  - Manual check that all nav anchor links (`#produk`, `#cara-pesan`, `#faq`, `#contact`) scroll to the correct section.
  - Manual check of `/admin/*` routes to confirm no storefront nav/chrome leaked in.
  - Devtools check of `prefers-reduced-motion: reduce` behavior (feature 13's criteria, re-verified in the fully combined page).

## Technical Implementation

- Edit: `app/page.tsx` — copy edits only for CTA label unification; no structural changes beyond what 08–13 already introduced.
- No new components or files expected for this feature — it's a copy pass plus verification, not new functionality. If the verification sweep surfaces bugs from 08–13, fix them in this feature rather than reopening those feature files, since this is explicitly the integration/QA checkpoint.

## Dependencies

- Depends on features 08, 09, 10, 11, 12, and 13 all being implemented — this is the final feature and assumes everything before it is in place.

## Acceptance Criteria

- [ ] The "contact us to order" action uses one consistent label everywhere it appears as a clickable CTA.
- [ ] `npm run lint`, `npm run typecheck`, and `npm run build` all pass with no errors.
- [ ] Manual browser verification at 375px/768px/1280px+ shows no visual defects across the whole page.
- [ ] All nav anchor links scroll to their correct section.
- [ ] `/admin/*` routes are confirmed unaffected.
- [ ] `prefers-reduced-motion: reduce` is confirmed working on the fully combined page.
