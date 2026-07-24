# Feature 02: Database Schema & Data Layer

## Overview

Defines the Postgres schema (products, FAQ entries, contact info) via Drizzle ORM, the DB client, reusable query helpers, input-validation schemas, a small WhatsApp-link utility, and a seed script populating the catalog content from the existing Canva site. This is the single source of truth for data used by both the public landing page (Feature 04) and the admin CMS (Feature 06).

## Requirements

- Three tables: `products`, `faq_items`, `contact_info`. All primary keys are randomly-generated UUIDs (`gen_random_uuid()`), per AGENTS.md.
- `contact_info` is a singleton — the schema must make it structurally impossible to have more than one row, and writes must be a single upsert operation rather than separate create/update flows.
- Products support: name, description, category/tag, one or more image URLs, an optional free-text format/size field, a sort order for display, and an active/inactive flag (so a product can be hidden without deleting it).
- FAQ entries support: question, answer, sort order.
- Contact info supports: WhatsApp number, email, Instagram handle (stored without a leading `@`), Shopee URL.
- Query helpers must be reusable — both the public page and the admin Server Actions call the same functions rather than each writing their own `db.select()`/`db.insert()` calls.
- A seed script populates the 6 catalog products, 2 FAQ entries, and the 1 contact-info row using the content below, with placeholder product images clearly marked for later replacement.
- Input validation (zod schemas) exists as pure, importable functions separate from the Server Actions that will use them in Feature 06, so they can be unit-tested here without needing the admin UI built yet.
- A WhatsApp link utility normalizes Indonesian local-format phone numbers (e.g. `085117046472`) into a valid `https://wa.me/...` link.

**Seed content** (from the current Canva site):

Products:
1. **Loose Leaf A5** — "Isi ulang (refill) loose leaf ukuran A5. Tersedia dalam berbagai pilihan ketebalan kertas premium dan format isi: bergaris, kotak, polos, dan daily planner."
2. **Notebook custom** — "Abadikan ide dan catatan pentingmu dalam notebook jilid spiral eksklusif. Tersedia dalam berbagai ukuran dan bebas custom desain cover sesukamu!"
3. **Buku Tulis custom** — "Buku tulis jilid steples tengah dengan desain cover yang unik dan personal. Cocok untuk buku catatan sekolah, seminar, suvenir acara, atau media promosi bisnismu."
4. **Kalender duduk** — "Hias meja kerjamu dengan kalender duduk personal. Cetak dengan foto, quotes, atau desain buatanmu sendiri. Tersedia dalam ukuran populer A5 dan A6 dengan dudukan (hard cover) yang kokoh dan rapi."
5. **Sticker custom** — "Cetak stiker custom dengan logo jualan, ilustrasi lucu, atau label nama sesuai kebutuhanmu dengan berbagai macam jenis bahan (vinyl, glossy, transparan)."
6. **Produk cetak lainnya** — "Butuh produk cetak custom lainnya? Kami juga melayani pembuatan amplop custom, buku mewarnai anak, dll. Punya ide produk cetak lain? Hubungi tim kami untuk konsultasi desain dan harga!"

FAQ:
- Q: "Apakah bisa cetak dengan desain sendiri?" A: "Tentu saja bisa! Kami siap membantu mewujudkan desain kreatifmu ke dalam berbagai produk cetak yang tersedia di PRGaleri."
- Q: "Apakah bisa pesan satuan?" A: "Bisa banget! Kami melayani pemesanan satuan tanpa minimal order, sangat cocok untuk koleksi pribadi atau hadiah spesial."

Contact: WhatsApp `085117046472`, email `pr.galeri@gmail.com`, Instagram `prgaleri`, Shopee `https://shopee.co.id/prgaleri`.

## Technical Implementation

**`lib/db/schema.ts`**:
```ts
import { pgTable, uuid, text, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default(""),
  imageUrls: text("image_urls").array().notNull().default([]),
  formatOptions: text("format_options"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactInfo = pgTable("contact_info", {
  id: uuid("id").primaryKey().defaultRandom(),
  whatsappNumber: text("whatsapp_number").notNull(),
  email: text("email").notNull(),
  instagramHandle: text("instagram_handle").notNull(),
  shopeeUrl: text("shopee_url").notNull(),
  singleton: boolean("singleton").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  singletonUnique: unique("contact_info_singleton_unique").on(table.singleton),
}));
```
The UNIQUE constraint on `singleton` (always `true`) makes a second row a Postgres-level constraint violation. All writes use `db.insert(contactInfo).values({...}).onConflictDoUpdate({ target: contactInfo.singleton, set: {...} })`.

**`lib/db/client.ts`**:
```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```
Use the `neon-http` (stateless) driver, not the WebSocket `Pool` variant — nothing here needs multi-statement transactions.

**`lib/db/queries/products.ts`**: `listActiveProducts()`, `listAllProductsAdmin()`, `getProductById(id)`, `createProduct(input)`, `updateProduct(id, input)`, `deleteProduct(id)`, `reorderProducts(ids: string[])`.
**`lib/db/queries/faq.ts`**: mirrored CRUD + reorder for `faqItems`.
**`lib/db/queries/contact.ts`**: `getContactInfo()` (returns `null` gracefully if no row exists yet — must not throw), `upsertContactInfo(input)`.

**`lib/db/seed.ts`**: one-off script inserting the 6 products, 2 FAQ entries, 1 contact row above. Product images use `placehold.co` URLs tinted to the brand palette (e.g. `https://placehold.co/800x800/1F3A2E/FBF9F4?text=Loose+Leaf+A5`), with an inline comment flagging these as placeholders to replace with real photography via the CMS later.

**`lib/validation/products.ts`, `faq.ts`, `contact.ts`**: zod schemas + parse helpers. Products: required name/description, `imageUrls` parsed from a newline/comma-separated textarea string into a trimmed, deduplicated array with URL validation per entry, `sortOrder` string→number coercion. FAQ: required question/answer, whitespace trimming, sortOrder coercion. Contact: email format validation, Instagram handle normalization (strip any leading `@` so storage is consistent), Shopee URL must parse as a valid `https://` URL.

**`lib/utils/whatsapp.ts`**: `toWhatsAppLink(rawNumber: string): string` — strips non-digit characters, strips a leading `0` and prepends `62` (Indonesia country code) if the number isn't already in international format, returns `https://wa.me/<digits>`. Must handle already-international input (leading `62`) as a passthrough and return a sane fallback (or throw a clear validation error, consistent with the validation schemas) for empty/garbage input.

**`lib/env.ts`**: zod-validated accessor — `z.object({ DATABASE_URL: z.string().url(), ADMIN_PASSWORD: z.string().min(1), SESSION_SECRET: z.string().min(32) }).parse(process.env)` — fails fast at import time with a clear message rather than a cryptic error later in `lib/db/client.ts` or `lib/auth/session.ts`.

## Dependencies

Depends on Feature 01 (dependencies installed, `drizzle.config.ts`/`vitest.config.ts` present, `.env.local` populated with a real `DATABASE_URL`).

## Acceptance Criteria

- [ ] `npm run db:generate` produces migration SQL for all three tables under `lib/db/migrations/`, with UUID primary keys and the `contact_info` singleton unique constraint visible in the generated SQL.
- [ ] `npm run db:migrate` applies successfully against the real Neon database (never `drizzle-kit push`).
- [ ] `npm run db:seed` inserts the 6 products, 2 FAQ entries, and 1 contact row without error; running it twice does not create duplicate contact rows (upsert behavior confirmed).
- [ ] `getContactInfo()` returns `null` (not a thrown error) when called against an empty `contact_info` table.
- [ ] `lib/validation/products.test.ts`, `faq.test.ts`, `contact.test.ts` pass, covering: missing required fields rejected, `imageUrls` string-to-array parsing with dedup, invalid URLs rejected, sortOrder coercion, Instagram handle normalization, Shopee URL validation.
- [ ] `lib/utils/whatsapp.test.ts` passes: `085117046472` → `https://wa.me/6285117046472`; an already-international number passes through correctly; empty/garbage input is handled without throwing an unhandled exception.
- [ ] `npm run typecheck` and `npm run lint` pass with the new `lib/db/*` and `lib/validation/*` code in place.
