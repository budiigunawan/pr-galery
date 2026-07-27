# Requirements

## Overview

PR Galeri HomePrinting is a small Indonesian home-based printing/stationery business (loose leaf refills, custom notebooks, desk calendars, custom stickers, exercise books, and other custom print jobs) currently running its storefront entirely off a Canva site (prgaleri.my.canva.site) with no editable backend. Any product, FAQ, or contact-info change requires manually editing the Canva design.

This plan replaces it with a real Next.js application: a public landing page presenting the product catalog, FAQ, and contact/order info, backed by a lightweight CMS so the owner can add/edit/remove products, FAQ entries, and contact details themselves — no code changes, no redeploys.

**Phase 2 — Landing Page Revamp (features 08–14):** the launch shipped (features 01–07) with hardcoded hero/feature-band copy and generic `placehold.co` placeholder imagery. This phase deepens the existing "paper-craft" visual identity (pine/kraft/stamp, postmark frames, docket cards) rather than replacing it, adds the navigation the page currently lacks, and extracts the business's real hand-illustrated monogram logo (found in reference screenshots `prgaleri-full.png`/`prgaleri-2/3/4.png` at the repo root, never actually wired into the app) so the site's brand mark stops being a placeholder.

## Goals

- Recreate and improve on the existing Canva site's content (products, FAQ, contact/order info) with a distinctive, purpose-built visual identity for PR Galeri.
- Let the business owner manage products, FAQ entries, and contact info through a simple admin area, without needing developer help.
- Keep the "contact us to order" model — no cart, no checkout, no payments. Orders happen via WhatsApp/email/Instagram/Shopee, same as today.
- Ship on a real, production-ready stack (Next.js App Router, Postgres via Drizzle) that the owner or a future developer can maintain.

## Non-Goals

- No e-commerce cart, checkout, or online payment processing.
- No multi-user accounts or role-based permissions — a single shared admin password is sufficient.
- No file/image upload infrastructure — product photos are plain pasted URLs, not uploaded files.
- No use of this repo's existing `DESIGN.md` (a Starbucks-style design system for an unrelated kind of product) — a new design system is defined specifically for PR Galeri instead.
- No full e2e/browser test automation — verification is manual browser testing plus a small Vitest unit-test suite for pure logic.
- Hero/about copy on the landing page is not CMS-managed; only products, FAQ, and contact info are editable.

## Assumptions & Constraints

- **Stack**: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4 (CSS-based `@theme` config, no `tailwind.config.js`). Repo currently a bare `create-next-app` scaffold — no DB, no auth, no CMS code yet.
- **Database**: Neon serverless Postgres via Drizzle ORM. All ID columns are UUID, randomly generated. Schema changes always go through `drizzle-kit generate` + a migrate step — `drizzle push` is never used (per AGENTS.md).
- **Admin auth**: a single shared password (env var `ADMIN_PASSWORD`) gates `/admin/*` via middleware + a signed session cookie (HMAC, Node `crypto`) — no user-accounts table, no Better Auth.
- **Images**: product photo fields are plain URL strings the admin pastes in. Seed data uses placeholder images (`placehold.co`, brand-tinted) until real product photography is available.
- **Testing**: Vitest added for unit-testable pure logic (validation parsing, WhatsApp link normalization, session signing). No DB-touching or browser-automation tests are part of the automated suite; those are verified manually.
- **Secrets**: an agent cannot fabricate a real `DATABASE_URL`, `ADMIN_PASSWORD`, or `SESSION_SECRET` — the user must supply these in `.env.local` before the data layer or auth can be exercised against a live database.

## Feature Index

| # | Feature | Summary |
|---|---------|---------|
| 01 | [Project Foundations & Tooling](features/01%20-%20project-foundations-and-tooling.md) | Dependencies, env files, Drizzle/Vitest config, `.gitignore` fix, npm scripts, `next.config.ts` image config |
| 02 | [Database Schema & Data Layer](features/02%20-%20database-schema-and-data-layer.md) | Drizzle schema, DB client, query helpers, validation schemas, WhatsApp util, seed script, unit tests |
| 03 | [Design System & Shared UI Components](features/03%20-%20design-system-and-shared-ui-components.md) | Tailwind theme tokens, fonts, paper-craft motif components (`Button`, `ProductCard`, `DocketCard`, etc.) |
| 04 | [Public Landing Page](features/04%20-%20public-landing-page.md) | `app/page.tsx` wiring real data + design components + hardcoded hero/about copy |
| 05 | [Admin Authentication](features/05%20-%20admin-authentication.md) | Session signing/verification, auth middleware, login/logout flow |
| 06 | [Admin CMS: Products, FAQ & Contact Management](features/06%20-%20admin-cms-products-faq-contact.md) | CRUD pages + Server Actions for products, FAQ entries, and the contact-info singleton |
| 07 | [Integration, Seeding & Launch Verification](features/07%20-%20integration-seeding-and-launch-verification.md) | Seed the real Neon DB, full lint/typecheck/test/build pass, manual browser verification |
| 08 | [Design Foundations: Brand Mark & Letterhead Nav](features/08%20-%20design-foundations-brand-mark-and-nav.md) | Extract the real PR monogram logo, add tear-edge/dot-grid CSS utilities, build the sticky nav bar |
| 09 | [Hero Section Revamp](features/09%20-%20hero-section-revamp.md) | Strengthen the hero as a thesis moment: eyebrow tag, scaled heading, dot-grid texture |
| 10 | [Product Grid Corner Stamp](features/10%20-%20product-grid-corner-stamp.md) | Add the real monogram as a corner "maker's mark" stamp on product photos |
| 11 | ["Cara Pesan" How-to-Order Section](features/11%20-%20cara-pesan-how-to-order-section.md) | New 4-step ticket-stub section explaining the order process |
| 12 | [Footer & Contact Revamp](features/12%20-%20footer-and-contact-revamp.md) | Icon+label contact rows, large monogram, closing tear-edge |
| 13 | [Motion & Micro-interactions](features/13%20-%20motion-and-micro-interactions.md) | Scroll-reveal on sections/cards, `DocketCard` hover-straighten, reduced-motion support |
| 14 | [Copy Consistency & Revamp QA](features/14%20-%20copy-consistency-and-revamp-qa.md) | Unify CTA button vocabulary site-wide; lint/typecheck/responsive verification pass |

## Open Questions

- **Real product photography**: none exists yet; the site launches with placeholder images until the owner supplies real photos (swappable via the CMS at any time, no code change needed).
- **`next.config.ts` `images.remotePatterns`**: plan recommends allowing any `https://` host (`{ protocol: "https", hostname: "**" }`) so `next/image` can optimize arbitrary admin-pasted image URLs. Flagged as a deliberate trust decision (single trusted admin, not public user-generated content) rather than silently assumed.
- **Logo asset quality (feature 08)**: the only source for the real PR monogram is a raster screenshot of an old Canva mockup, not a vector original. The extracted `public/logo-mark.png` is a best-effort crop, not a redraw — recommend the owner supply a proper vector/high-res export later if this logo becomes permanent.
