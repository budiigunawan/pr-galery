# Feature 12: Footer & Contact Revamp

## Overview

Restyles the existing contact/footer section from a plain row of pill buttons into an icon+label layout (matching the business's own earlier Canva mockup reference in `prgaleri-4.png`), adds the large brand mark, and closes out the "whole page is one continuous order docket" signature idea with a perforated tear-edge at the very bottom of the page.

## Requirements

- Keep the existing `pine-deep` tone `Section` with `id="contact"` and the `SectionHeading heading="Pesan Sekarang"`.
- Replace the current flat row of `Button` components (WhatsApp / Email / Instagram / Shopee) with icon+label rows inside a `paper`-toned card sitting on the dark `pine-deep` band — matching the two-column card layout in `prgaleri-4.png` (contact-info card on one side, brand mark on the other, both sitting on the dark green band as light-colored cards/marks against the dark surface).
- Each contact method (WhatsApp, Email, Instagram, Shopee) needs a small icon — reuse any icon approach already available in the project if one exists (check `components/` for existing icon usage before adding a new icon dependency); if none exists, inline SVGs are acceptable, but do not add a new icon library dependency for four icons.
- Display `public/logo-mark.png` (feature 08) prominently in the footer, sized larger than the nav/product-corner instances (e.g. ~120–160px).
- Add the `docket-edge-top` utility (feature 08) — or a bottom-edge equivalent if the top-edge version doesn't visually work upside-down at the page's bottom edge; implementer should sanity-check by rendering both and picking whichever reads correctly as a "torn edge" at the very bottom of the page — to the bottom of the footer `Section`, closing the perforated-edge framing established at the top of the page in feature 08.
- Preserve all existing conditional logic: WhatsApp link only renders if `contactInfo.whatsappNumber` resolves via `safeWhatsAppLink`; the "belum hadir" fallback copy still renders when `contactInfo` is `null`.
- Copyright line (`© 2026 PRGaleri HomePrinting`) stays, positioned below/after the tear-edge close.

## Technical Implementation

- Edit: `app/page.tsx` — the contact/footer `<Section tone="pine-deep" id="contact">` block (currently lines ~153–204). Restructure the inner markup into a two-column layout (contact-info card + brand mark), replacing the current `Button`-row `div`.
- May introduce a small new component (e.g. `components/ui/ContactRow.tsx`) for the icon+label row if that keeps `app/page.tsx` from getting too dense — implementer's call based on how much markup this ends up being; not required if it fits cleanly inline.
- No changes to `lib/db/queries/contact.ts` or the `contactInfo` shape — this is presentation-only.

## Dependencies

- Feature 08 (needs `public/logo-mark.png` and the tear-edge CSS utility).

## Acceptance Criteria

- [ ] Footer shows a contact-info card (icon + label per channel: WhatsApp, Email, Instagram, Shopee) and the large brand mark, both legible against the `pine-deep` background.
- [ ] WhatsApp row is omitted (not shown broken/empty) when `safeWhatsAppLink` returns `null`.
- [ ] "Belum hadir" fallback still renders correctly when `contactInfo` is `null` (verify by temporarily testing with no seeded contact row, or by code inspection of the conditional).
- [ ] A perforated tear-edge is visible at the very bottom of the page, below the footer content and above the copyright line (or wherever visually correct).
- [ ] Layout doesn't overflow or collapse awkwardly at 375px width — contact card and brand mark stack vertically on mobile.
- [ ] `npm run lint` and `npm run typecheck` pass.
