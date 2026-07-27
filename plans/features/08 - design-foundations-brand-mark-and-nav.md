# Feature 08: Design Foundations — Brand Mark & Letterhead Nav

## Overview

Foundational feature for the landing-page revamp. Extracts the business's real hand-illustrated monogram logo from existing reference screenshots, adds two new CSS texture/edge utilities the later revamp features depend on, and builds the site's first navigation bar (the current landing page has none). Every other revamp feature (09–13) depends on the logo asset and/or the CSS utilities added here.

## Requirements

- **Brand mark extraction**: crop the circular hand-illustrated monogram (a "PR" wordmark with "PRAYOGI RAHAYU" and "GALERI" wrapped around it, plus a small clover glyph) out of the reference screenshots at the repo root (`prgaleri-full.png` has a clean, uncropped instance top-left; `prgaleri-4.png` has a larger instance bottom-right). Produce a clean PNG with transparent background at a reasonable resolution (at least 512×512) saved to `public/logo-mark.png`. This is a best-effort raster crop from an existing screenshot, not a redraw — if cropping introduces visible artifacts or the background can't be made transparent, save it on a solid `kraft` (`#F1EBDD`) background instead and note the limitation in the PR/commit description.
- **Nav bar** (new `components/ui/Nav.tsx`):
  - Sticky top bar (`sticky top-0 z-40`), `kraft` surface, subtle bottom border/shadow so it reads as a distinct "letterhead" strip above the hero.
  - Left: `logo-mark.png` (small, e.g. 40px) + "PRGaleri HomePrinting" wordmark in Fraunces.
  - Center/right: anchor links to `#produk`, `#cara-pesan`, `#faq`, `#contact` (add matching `id`s to those `Section`s in `app/page.tsx` — `#cara-pesan` is added by feature 11, so this feature can add the link now and it will resolve once that section exists).
  - Right-most: a WhatsApp CTA using the existing `Button` component (`variant="primary"`), only rendered if `contactInfo` has a WhatsApp number — `Nav` must accept the resolved `whatsappLink: string | null` as a prop (computed in `app/page.tsx` via the existing `safeWhatsAppLink` helper) rather than fetching data itself.
  - Mobile (below `sm`): collapse the anchor links, keep logo + wordmark on the left and the WhatsApp CTA on the right. No hamburger menu / no expandable mobile drawer — a 4-link anchor nav doesn't need one at this scale.
- **CSS utilities** (edit `app/globals.css`, inside/alongside the existing `@utility docket-edge` block):
  - `docket-edge-top`: a perforated/scalloped edge for the *top* of a container (inverse of the existing `docket-edge`, which perforates the bottom). Used at the very top of the page, above the nav.
  - `grid-dots`: a faint repeating dot-grid background (graph-paper texture), visually distinct from the existing `ruled-bg` notebook-line texture used on `ProductCard`. Low-contrast (e.g. `ink` at ~5–8% opacity dots), so it reads as texture, not decoration.
- **Mounting**: render `Nav` and the top `docket-edge-top` strip directly in `app/page.tsx`, above the existing hero `Section`, *not* in `app/layout.tsx` — `app/layout.tsx` is shared with `/admin/*` routes, which must not show the storefront nav or paper-craft chrome.

## Technical Implementation

- New file: `components/ui/Nav.tsx` — client or server component (no interactivity beyond anchor links + the existing `Button`, so this can stay a server component; no `"use client"` needed).
- Edit: `app/globals.css` — add `@utility docket-edge-top` and `@utility grid-dots` near the existing `@utility docket-edge`. Do not modify existing color tokens (`--color-pine`, etc.) or the existing `docket-edge` utility.
- Edit: `app/page.tsx` — import and render `<Nav whatsappLink={whatsappLink} />` above the hero `Section`; move the `safeWhatsAppLink` computation earlier in the function if needed so it's available to `Nav`. Wrap the very top of the page in a small element carrying the `docket-edge-top` utility (on the `kraft`-toned hero `Section`'s top edge, or a thin standalone strip above `Nav` — implementer's call based on what looks right against the sticky nav).
- New asset: `public/logo-mark.png`.

## Dependencies

None — this is the first revamp feature. Features 09, 10, 11, 12 depend on this one for `logo-mark.png` and/or the new CSS utilities.

## Acceptance Criteria

- [ ] `public/logo-mark.png` exists, displays correctly (no obvious cropping artifacts), and is used by `Nav`.
- [ ] `Nav` renders sticky at the top of `/`, shows logo + wordmark, anchor links, and a WhatsApp CTA (when contact info exists) or no CTA (when it doesn't, without crashing).
- [ ] `Nav` collapses gracefully at 375px width — no horizontal overflow, no overlapping elements.
- [ ] `docket-edge-top` and `grid-dots` utilities are defined in `app/globals.css` and render visibly when applied.
- [ ] `/admin/*` routes render unchanged — no `Nav` or paper-craft chrome leaks into the admin layout.
- [ ] `npm run lint` and `npm run typecheck` pass.
