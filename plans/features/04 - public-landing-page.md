# Feature 04: Public Landing Page

## Overview

Wires the data layer (Feature 02) and shared design components (Feature 03) together into the actual public-facing landing page at `app/page.tsx`, plus the hardcoded hero/about copy that isn't CMS-managed. This is what visitors see when they land on the site.

## Requirements

Single scrolling page, mobile-first responsive, following the layout rhythm: Kraft hero → Paper White product grid → Pine Deep feature/CTA band → docket-style FAQ → Pine Deep contact/footer band.

- **Hero section** (Kraft tone): brand name "PRGaleri HomePrinting", tagline "Crafted with Passion." (set in italic Fraunces), and the monogram/logo treatment. Hardcoded — not read from the database.
- **Feature/CTA band** (Pine Deep tone): headline "Ingin punya produk cetak unik dengan ciri khasmu sendiri?", supporting copy about single-unit or wholesale printing at competitive prices, closing line "Yuk, buat produk impianmu sekarang!" Hardcoded.
- **Product grid**: renders all active products from `listActiveProducts()`, in `sortOrder`, using `ProductCard` (postmark-framed image, `CatalogTag`, name, description). Must handle an empty catalog gracefully (e.g. a friendly "belum ada produk" empty state) rather than rendering a broken/empty grid.
- **FAQ section**: renders all FAQ entries from the FAQ query, in `sortOrder`, using `DocketCard`. Same graceful-empty-state requirement if no FAQ entries exist.
- **Contact/order section + footer** (Pine Deep tone): renders live contact info from `getContactInfo()` — WhatsApp (formatted via `toWhatsAppLink()` from Feature 02, opens `https://wa.me/...`), email (`mailto:` link), Instagram (`https://instagram.com/<handle>`), Shopee link. Must handle the case where `getContactInfo()` returns `null` (no row seeded yet) without crashing the page — e.g. omit that section or show a minimal fallback.
- Page must be a Server Component reading directly from `lib/db/queries/*` (no client-side fetch waterfall).
- Page revalidates periodically (ISR) and picks up admin edits without waiting for the full revalidation window, once Feature 06's mutations call `revalidatePath("/")`.

## Technical Implementation

`app/page.tsx`:
- `export const revalidate = 3600;` (hourly ISR) as the baseline cache policy; Feature 06's Server Actions additionally call `revalidatePath("/")` on every product/FAQ/contact mutation so admin edits appear immediately rather than waiting up to an hour.
- Fetches `listActiveProducts()`, FAQ list, and `getContactInfo()` from `lib/db/queries/*` (Feature 02) at the top of the component (these are plain async calls in a Server Component, no extra data-fetching library needed).
- Composes `Section`, `SectionHeading`, `ProductCard`, `DocketCard`, `Button` from `components/ui/*` (Feature 03) around the hardcoded hero/CTA copy and the fetched data.
- Product images render inside `PostmarkFrame` using `next/image` (relies on Feature 01's `images.remotePatterns` config to load arbitrary admin-pasted URLs).

## Dependencies

Depends on Feature 02 (data layer/query functions) and Feature 03 (design components). Can be built in parallel with Feature 05 (Admin Authentication) once both dependencies are ready.

## Acceptance Criteria

- [ ] Visiting `/` renders the hero, product grid, FAQ, and contact/footer sections in the specified order and tones.
- [ ] Product grid shows all 6 seeded products (once Feature 02's seed has run) in their seeded `sortOrder`, each with a postmark-framed image, catalog tag, name, and description.
- [ ] FAQ section shows both seeded Q&A entries as docket-styled cards.
- [ ] Clicking the WhatsApp contact link opens a chat pre-addressed to `https://wa.me/6285117046472` (or whatever number is currently in `contact_info`).
- [ ] Email, Instagram, and Shopee contact links point to correctly formatted URLs derived from the `contact_info` row.
- [ ] Page renders without errors when the products table, FAQ table, or contact_info row is empty (graceful empty states, no crash).
- [ ] Layout is usable and visually correct at a 375px mobile width and at a desktop width (1280px+).
- [ ] `npm run build` succeeds with this page included (no Server/Client component boundary errors).
