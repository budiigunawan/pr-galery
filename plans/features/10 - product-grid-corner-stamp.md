# Feature 10: Product Grid Corner Stamp

## Overview

Ties the real brand mark into every product tile, matching how the business's own earlier Canva mockup (`prgaleri-2.png`/`prgaleri-3.png` reference screenshots) stamped a small monogram in the corner of each product photo as a maker's-mark of authenticity. Currently `ProductCard`/`PostmarkFrame` only wrap the photo in a generic dashed circular ring.

## Requirements

- `PostmarkFrame` (`components/ui/PostmarkFrame.tsx`) gains an optional corner-stamp: a small rendering of `public/logo-mark.png` (from feature 08) positioned in the bottom-right of the circular photo frame, similar in spirit to the reference screenshots.
- The stamp must not obscure the product photo's subject matter significantly — small size (e.g. ~28–32px), enough opacity/contrast to read against varied photo backgrounds (consider a small solid or semi-opaque `paper`-colored backing circle behind the stamp so it stays legible on dark or busy photos).
- The existing dashed postmark ring stays — the corner stamp is additive, not a replacement (both motifs are on-brief; removing the dashed ring would lose an already-working detail).
- `ProductCard` (`components/ui/ProductCard.tsx`) should pass through whatever prop `PostmarkFrame` needs to enable the stamp (e.g. a `showStamp` boolean, default `true`) — keep the API minimal, no need for per-product configurability since every product should show it.
- `CatalogTag` labels (`NO. 01 · A5` etc.) are unchanged — this feature only touches the photo frame.

## Technical Implementation

- Edit: `components/ui/PostmarkFrame.tsx` — add the corner-stamp `<Image>` (or plain `<img>` if simpler, since `logo-mark.png` is a small static local asset) absolutely positioned within the existing `relative` wrapper, e.g. `absolute bottom-0 right-0`.
- Edit: `components/ui/ProductCard.tsx` — only if a prop needs threading through; otherwise no change (if the stamp is unconditional inside `PostmarkFrame`, `ProductCard` needs no edits at all — prefer this simpler option unless there's a concrete reason a caller would want to opt out).
- No changes to `app/page.tsx` beyond what's already passed to `ProductCard` in the product-grid `Section`.

## Dependencies

- Feature 08 (needs `public/logo-mark.png` to exist).

## Acceptance Criteria

- [ ] Every product tile in the "Produk Kami" grid shows the monogram stamp in the photo's corner, at every product's photo (including the `FALLBACK_PRODUCT_IMAGE_URL` placeholder case).
- [ ] Stamp remains legible against at least one light-background and one dark-background placeholder image (spot-check by temporarily swapping a product's image URL, or checking against the existing seeded placeholder variety).
- [ ] Existing dashed postmark ring is still visible — not replaced.
- [ ] `npm run lint` and `npm run typecheck` pass.
