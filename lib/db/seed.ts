/**
 * One-off seed script — run via `npm run db:seed` (tsx lib/db/seed.ts).
 *
 * Idempotent: re-running this script does not create duplicate products,
 * FAQ entries, or contact rows. Products/FAQ are seeded via a
 * delete-then-insert of the known seed set; contact info uses the
 * singleton upsert pattern.
 */
// `dotenv/config` must be the very first import: TS/esbuild hoists all
// `import` statements above other top-level code (matching real ESM
// semantics), so a later `config()` *call* would run after "./client" is
// already required and has read `process.env.DATABASE_URL`. A bare
// side-effecting `import "dotenv/config"` runs its config() synchronously
// during its own (first) require, before subsequent imports evaluate.
// The `db:seed` npm script sets DOTENV_CONFIG_PATH=.env.local so this
// picks up the real Neon credentials (dotenv/config only loads `.env` by
// default, not `.env.local`).
import "dotenv/config";
import { inArray } from "drizzle-orm";
import { db } from "./client";
import { products, faqItems, contactInfo } from "./schema";

// NOTE: image URLs below are placehold.co placeholders tinted to the brand
// palette (house green #1F3A2E background / cream #FBF9F4 text). Replace
// with real product photography via the admin CMS once available.
const SEED_PRODUCTS = [
  {
    name: "Loose Leaf A5",
    description:
      "Isi ulang (refill) loose leaf ukuran A5. Tersedia dalam berbagai pilihan ketebalan kertas premium dan format isi: bergaris, kotak, polos, dan daily planner.",
    category: "A5",
    imageUrls: [
      "https://placehold.co/800x800/1F3A2E/FBF9F4?text=Loose+Leaf+A5",
    ],
    formatOptions: null,
    sortOrder: 0,
    isActive: true,
  },
  {
    name: "Notebook custom",
    description:
      "Abadikan ide dan catatan pentingmu dalam notebook jilid spiral eksklusif. Tersedia dalam berbagai ukuran dan bebas custom desain cover sesukamu!",
    category: "Custom",
    imageUrls: [
      "https://placehold.co/800x800/1F3A2E/FBF9F4?text=Notebook+Custom",
    ],
    formatOptions: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "Buku Tulis custom",
    description:
      "Buku tulis jilid steples tengah dengan desain cover yang unik dan personal. Cocok untuk buku catatan sekolah, seminar, suvenir acara, atau media promosi bisnismu.",
    category: "Custom",
    imageUrls: [
      "https://placehold.co/800x800/1F3A2E/FBF9F4?text=Buku+Tulis+Custom",
    ],
    formatOptions: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    name: "Kalender duduk",
    description:
      "Hias meja kerjamu dengan kalender duduk personal. Cetak dengan foto, quotes, atau desain buatanmu sendiri. Tersedia dalam ukuran populer A5 dan A6 dengan dudukan (hard cover) yang kokoh dan rapi.",
    category: "A5/A6",
    imageUrls: [
      "https://placehold.co/800x800/1F3A2E/FBF9F4?text=Kalender+Duduk",
    ],
    formatOptions: null,
    sortOrder: 3,
    isActive: true,
  },
  {
    name: "Sticker custom",
    description:
      "Cetak stiker custom dengan logo jualan, ilustrasi lucu, atau label nama sesuai kebutuhanmu dengan berbagai macam jenis bahan (vinyl, glossy, transparan).",
    category: "Sticker",
    imageUrls: [
      "https://placehold.co/800x800/1F3A2E/FBF9F4?text=Sticker+Custom",
    ],
    formatOptions: null,
    sortOrder: 4,
    isActive: true,
  },
  {
    name: "Produk cetak lainnya",
    description:
      "Butuh produk cetak custom lainnya? Kami juga melayani pembuatan amplop custom, buku mewarnai anak, dll. Punya ide produk cetak lain? Hubungi tim kami untuk konsultasi desain dan harga!",
    category: "Lainnya",
    imageUrls: [
      "https://placehold.co/800x800/1F3A2E/FBF9F4?text=Produk+Lainnya",
    ],
    formatOptions: null,
    sortOrder: 5,
    isActive: true,
  },
];

const SEED_FAQ = [
  {
    question: "Apakah bisa cetak dengan desain sendiri?",
    answer:
      "Tentu saja bisa! Kami siap membantu mewujudkan desain kreatifmu ke dalam berbagai produk cetak yang tersedia di PRGaleri.",
    sortOrder: 0,
  },
  {
    question: "Apakah bisa pesan satuan?",
    answer:
      "Bisa banget! Kami melayani pemesanan satuan tanpa minimal order, sangat cocok untuk koleksi pribadi atau hadiah spesial.",
    sortOrder: 1,
  },
];

const SEED_CONTACT = {
  whatsappNumber: "085117046472",
  email: "pr.galeri@gmail.com",
  instagramHandle: "prgaleri",
  shopeeUrl: "https://shopee.co.id/prgaleri",
};

async function seedProducts() {
  const names = SEED_PRODUCTS.map((p) => p.name);
  // Delete any existing rows that match the seed set's names, then
  // re-insert fresh — keeps the script idempotent without creating
  // duplicates on repeat runs.
  await db.delete(products).where(inArray(products.name, names));
  await db.insert(products).values(SEED_PRODUCTS);
  console.log(`Seeded ${SEED_PRODUCTS.length} products.`);
}

async function seedFaq() {
  const questions = SEED_FAQ.map((f) => f.question);
  await db.delete(faqItems).where(inArray(faqItems.question, questions));
  await db.insert(faqItems).values(SEED_FAQ);
  console.log(`Seeded ${SEED_FAQ.length} FAQ items.`);
}

async function seedContact() {
  await db
    .insert(contactInfo)
    .values({ ...SEED_CONTACT, singleton: true })
    .onConflictDoUpdate({
      target: contactInfo.singleton,
      set: { ...SEED_CONTACT, updatedAt: new Date() },
    });
  console.log("Seeded contact info (upsert).");
}

async function main() {
  await seedProducts();
  await seedFaq();
  await seedContact();
  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
