# Feature 03: Design System & Shared UI Components

## Overview

Implements a new, PR Galeri-specific visual identity — replacing this repo's default `create-next-app` styling (and explicitly *not* the unrelated Starbucks-style `DESIGN.md` already in the repo) — as Tailwind v4 theme tokens, fonts, and a set of reusable "paper-craft" themed components. This can be built entirely against mock/fixture props, with no dependency on the database layer, so it can proceed in parallel with Feature 02.

## Requirements

- Establish the brand palette, typography, and a "paper craft" signature motif (postmark-style circular photo frames, ruled-notebook-line card textures, perforated-edge docket cards, washi-tape-style hero imagery) as reusable design tokens and components — not one-off styles duplicated per page.
- Replace the scaffold's auto dark-mode (`prefers-color-scheme: dark`) styling — this brand has one fixed light/paper palette with explicit dark *bands* (not a user-togglable dark mode).
- Load and apply the three brand typefaces via `next/font/google`.
- Build shared components so Feature 04 (public page) and Feature 06 (admin CMS) don't duplicate styling logic. Admin UI intentionally stays plain (no paper-craft motif) — only `Button` needs to be shared with the admin area.

**Palette**: Pine `#1F3A2E` (primary brand green) · Pine Deep `#16281F` (dark feature-band/footer) · Kraft `#F1EBDD` (page canvas) · Paper White `#FBF9F4` (card surface) · Ink `#2B2A25` (text) · Stamp Red `#A8402A` (sparing accent only — small badges/tags/focus states, never a background or large area).

**Typography**: Display/headings = Fraunces (variable, italic used for tagline-style copy). Body/UI = Karla. Utility/catalog labels = JetBrains Mono (e.g. "NO. 01 · A5" tags).

## Technical Implementation

**`app/layout.tsx`**: replace Geist font imports with:
```ts
import { Fraunces, Karla, JetBrains_Mono } from "next/font/google";

const fraunces = Fraunces({ variable: "--font-display", subsets: ["latin"], style: ["normal", "italic"] });
const karla = Karla({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
```
Apply all three variables on `<html lang="id" className={`${fraunces.variable} ${karla.variable} ${mono.variable} ...`}>`. Remove the scaffold's dark-mode CSS block and any leftover `dark:` classes in `page.tsx`.

**`app/globals.css`** `@theme` block (extends the existing token pattern already in the file):
```css
@theme inline {
  --color-pine: #1F3A2E;
  --color-pine-deep: #16281F;
  --color-kraft: #F1EBDD;
  --color-paper: #FBF9F4;
  --color-ink: #2B2A25;
  --color-stamp: #A8402A;

  --font-display: var(--font-display), serif;
  --font-sans: var(--font-sans), sans-serif;
  --font-mono: var(--font-mono), monospace;

  --radius-card: 0.75rem;
  --shadow-card: 0 2px 8px rgba(43, 42, 37, 0.08);
}
```
This produces utilities: `bg-pine`, `bg-pine-deep`, `bg-kraft`, `bg-paper`, `text-ink`, `text-stamp`/`border-stamp`, `font-display`, `font-sans`, `font-mono`, `rounded-card`, `shadow-card`.

Add two reusable `@utility` blocks (Tailwind v4 CSS-based, no config file needed):
- `ruled-bg` — faint repeating-linear-gradient notebook lines, used behind `ProductCard`.
- `docket-edge` — perforated top-edge effect (repeating-radial-gradient or `clip-path: polygon(...)`) for `DocketCard`.

The active-press micro-interaction needs no custom utility — apply Tailwind's built-in `active:scale-95 transition-transform duration-100` directly in `Button.tsx`.

**`components/ui/` — one file each, one-line responsibility**:
- `Button.tsx` — pill-shaped primary/secondary/ghost button or link, with the `active:scale-95` press interaction. Shared with the admin area (Feature 06).
- `Section.tsx` — page-band wrapper with a `tone` prop (`kraft` / `paper` / `pine-deep`) controlling background + text color per landing-page section.
- `PostmarkFrame.tsx` — circular clipped image frame (postmark/wax-seal motif) for product thumbnails.
- `ProductCard.tsx` — composes `PostmarkFrame` + `CatalogTag` + name/description over the `ruled-bg` texture.
- `CatalogTag.tsx` — small monospace pill label (`font-mono`, stamp-red border), e.g. "NO. 01 · A5".
- `DocketCard.tsx` — FAQ entry styled as a torn receipt using `docket-edge`, with a slight per-index rotation.
- `WashiTapeFrame.tsx` — hero-specific rotated image frame with two tape-strip pseudo-corners.
- `SectionHeading.tsx` — consistent Fraunces display heading + italic Fraunces tagline treatment.

Each component takes plain props (strings/booleans/numbers) so it can be built and visually checked with mock data before Feature 04 wires in real database content.

## Dependencies

None on other features (buildable in parallel with Feature 02). Feature 04 and Feature 06 depend on this feature's components.

## Acceptance Criteria

- [ ] `app/globals.css` defines all six palette tokens, three font tokens, and the `ruled-bg`/`docket-edge` utilities; no leftover dark-mode media query block.
- [ ] `app/layout.tsx` loads Fraunces, Karla, and JetBrains Mono via `next/font/google` and applies all three CSS variables on `<html>`.
- [ ] All eight `components/ui/*` components exist, are typed (props interfaces, no `any`), and render correctly with representative mock/fixture data (verified via a temporary local page or Storybook-less manual render before Feature 04 wires real data).
- [ ] Stamp Red never appears as a background or body-text color in any component — only as a small accent (border/text on tags, focus rings).
- [ ] `Button.tsx`'s active state visibly scales to 95% with a smooth transition when clicked/tapped.
- [ ] `npm run lint` and `npm run typecheck` pass with all new components in place.
