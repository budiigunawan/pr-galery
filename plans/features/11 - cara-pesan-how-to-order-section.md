# Feature 11: "Cara Pesan" How-to-Order Section

## Overview

Adds a new section to the landing page explaining the actual order process as a real, ordered sequence — placed between the product grid and the feature/CTA band. Unlike decorative 01/02/03 numbering, this section's numbering is justified because ordering from PR Galeri genuinely is a sequential process (chat → specify → the item is printed/bound at home → handoff), and making that process visible is expected to reduce "how do I even order this?" friction for first-time visitors.

## Requirements

- New section titled "Cara Pesan" (or similar — final Indonesian copy at implementer's discretion, consistent with the page's existing informal-but-clear tone), placed after the product grid `Section` and before the existing `pine-deep` feature/CTA band `Section` in `app/page.tsx`.
- Exactly 4 steps, reflecting the real process implied by the rest of the site's copy and contact flow:
  1. Chat via WhatsApp/contact channel to start an order.
  2. Specify details (paper type, size, custom design, quantity — no minimum order, per the existing feature-band copy).
  3. The item is printed and bound at home ("dicetak dan dijilid langsung di rumah", echoing the hero's existing copy).
  4. Pickup/delivery handoff.
  (Exact wording should stay consistent with copy already used elsewhere on the page — e.g. reuse "dicetak dan dijilid langsung di rumah" verbatim from the hero rather than inventing a different phrase for the same fact.)
- Each step renders via a new `TicketStep` component styled as a small perforated ticket stub — reusing the page's existing mono/stamp numbering language (e.g. `CatalogTag`-style or the `DocketCard`'s `No. 0X` mono treatment) rather than a generic numbered-circle pattern.
- Layout: a horizontal row of 4 steps on `lg+`, wrapping/stacking on smaller widths (consistent with the responsive patterns already used for the product grid).
- Section should have `id="cara-pesan"` so the nav link added in feature 08 resolves correctly.

## Technical Implementation

- New file: `components/ui/TicketStep.tsx` — props: `step: number`, `title: string`, `description: string`. Visually: mono step number (`stamp` color, echoing `DocketCard`'s `No. 0X` treatment), short bold title (Fraunces or Karla semibold — implementer's call, but stay consistent with existing heading hierarchy), short description in body copy.
- Edit: `app/page.tsx` — add a new `<Section tone="paper" id="cara-pesan">` (or `tone="kraft"` — pick whichever keeps the kraft/paper alternating rhythm consistent with the sections immediately before/after it) containing a `SectionHeading` and a responsive grid/row of 4 `TicketStep`s.
- No data-layer changes — the 4 steps are static copy, not CMS-managed (consistent with the existing non-goal that hero/about copy isn't CMS-editable).

## Dependencies

- Feature 08 (the nav's `#cara-pesan` link needs this section's `id` to exist; can be built in parallel with 08 and wired together, but the nav link will 404-scroll until this ships).

## Acceptance Criteria

- [ ] New section appears between the product grid and the feature/CTA band, with `id="cara-pesan"`.
- [ ] Exactly 4 steps render, each with a step number, title, and description, in a horizontal row on desktop and a stacked/wrapped layout on mobile (375px) with no overflow.
- [ ] Step 3's copy is consistent with (not contradictory to) the hero's existing "dicetak dan dijilid langsung di rumah" claim.
- [ ] Clicking the "Cara Pesan" nav link (from feature 08) scrolls to this section.
- [ ] `npm run lint` and `npm run typecheck` pass.
