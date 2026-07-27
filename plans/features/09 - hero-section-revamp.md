# Feature 09: Hero Section Revamp

## Overview

Strengthens the landing page's hero from a generic heading+paragraph+button layout into a clearer "thesis" moment for the page, per the frontend-design direction: an eyebrow tag establishing what the business is, a larger display heading, and a paper-grain texture that visually distinguishes the hero from the product grid below it.

## Requirements

- Keep the existing two-column asymmetric layout (copy left, `WashiTapeFrame`-framed photo right on `lg+`, stacked on mobile) — this is already a distinctive, on-brief layout; do not replace it with a generic centered hero.
- Add a small eyebrow tag above the heading using the existing `CatalogTag` component (e.g. label like `"HOME PRINTING · SATUAN & CUSTOM"` — final copy at implementer's discretion, but must describe what the business does, not be a generic label like "Welcome").
- Scale up the Fraunces heading for stronger visual weight at desktop widths (current `SectionHeading` heading is capped at `text-4xl sm:text-5xl` via a className override in `app/page.tsx` — increase this, e.g. to `sm:text-6xl lg:text-7xl`, tuned so it doesn't overflow or force awkward line breaks in the actual heading text "PRGaleri HomePrinting").
- Apply the `grid-dots` utility (added in feature 08) to the hero `Section`'s background, at low enough opacity that it reads as texture behind the copy and photo, not as visual noise competing with them.
- Keep the CTA button, but its label must be updated per the copy-consistency direction from feature 14 (this feature can ship with the current "Hubungi Kami" label; feature 14 does the final unification pass across all CTAs).
- No new components are required for this feature; it is a styling/copy pass on the existing hero markup in `app/page.tsx`.

## Technical Implementation

- Edit: `app/page.tsx` — the hero `<Section tone="kraft" className="overflow-hidden">` block (currently lines ~43–68). Add a `CatalogTag` above the `SectionHeading`, adjust the `SectionHeading`'s className heading-size override, add `grid-dots` to the `Section`'s `className`.
- No changes needed to `components/ui/SectionHeading.tsx`, `components/ui/CatalogTag.tsx`, or `components/ui/WashiTapeFrame.tsx` — reuse as-is.
- Depends on `grid-dots` utility from feature 08 existing in `app/globals.css`.

## Dependencies

- Feature 08 (needs the `grid-dots` CSS utility and the sticky `Nav` in place above the hero, since the hero's top spacing may need adjusting to sit correctly below the new nav).

## Acceptance Criteria

- [ ] Hero shows an eyebrow `CatalogTag`, the scaled-up heading, existing tagline, body copy, CTA button, and washi-taped photo, in that order, matching the existing left-align-on-mobile/left-column-on-desktop behavior.
- [ ] Heading text does not overflow or wrap awkwardly at 375px, 768px, and 1280px+ widths.
- [ ] `grid-dots` texture is visible but subtle behind the hero content — verified visually in the browser, not just by reading the CSS.
- [ ] No layout shift or overlap between the new sticky `Nav` (feature 08) and the top of the hero.
- [ ] `npm run lint` and `npm run typecheck` pass.
