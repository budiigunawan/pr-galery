/**
 * One-off seed script — populates the catalog content migrated from the
 * existing Canva site (products, FAQ, contact info).
 *
 * Run via: npm run db:seed
 *
 * Not idempotent for products/FAQ (re-running creates duplicates — not a
 * stated requirement). Contact info IS idempotent: `upsertContactInfo` relies
 * on the `contact_info_singleton_unique` constraint, so running this twice
 * never creates a second contact row.
 */
import { createProduct } from "@/lib/db/queries/products";
import { createFaqItem } from "@/lib/db/queries/faq";
import { upsertContactInfo } from "@/lib/db/queries/contact";

// Placeholder product photography — tinted placehold.co images standing in
// for real product photos until an admin replaces them via the CMS.
const products = [
  {
    name: "Loose Leaf A5",
    description:
      "Isi ulang (refill) loose leaf ukuran A5. Tersedia dalam berbagai pilihan ketebalan kertas premium dan format isi: bergaris, kotak, polos, dan daily planner.",
    category: "Loose Leaf",
    imageUrls: ["https://placehold.co/800x800/1F3A2E/FBF9F4?text=Loose+Leaf+A5"],
    formatOptions: "Bergaris, kotak, polos, daily planner",
    sortOrder: 0,
    isActive: true,
  },
  {
    name: "Notebook custom",
    description:
      "Abadikan ide dan catatan pentingmu dalam notebook jilid spiral eksklusif. Tersedia dalam berbagai ukuran dan bebas custom desain cover sesukamu!",
    category: "Notebook",
    imageUrls: ["https://placehold.co/800x800/1F3A2E/FBF9F4?text=Notebook+Custom"],
    formatOptions: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "Buku Tulis custom",
    description:
      "Buku tulis jilid steples tengah dengan desain cover yang unik dan personal. Cocok untuk buku catatan sekolah, seminar, suvenir acara, atau media promosi bisnismu.",
    category: "Buku Tulis",
    imageUrls: ["https://placehold.co/800x800/1F3A2E/FBF9F4?text=Buku+Tulis+Custom"],
    formatOptions: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    name: "Kalender duduk",
    description:
      "Hias meja kerjamu dengan kalender duduk personal. Cetak dengan foto, quotes, atau desain buatanmu sendiri. Tersedia dalam ukuran populer A5 dan A6 dengan dudukan (hard cover) yang kokoh dan rapi.",
    category: "Kalender",
    imageUrls: ["https://placehold.co/800x800/1F3A2E/FBF9F4?text=Kalender+Duduk"],
    formatOptions: "A5, A6",
    sortOrder: 3,
    isActive: true,
  },
  {
    name: "Sticker custom",
    description:
      "Cetak stiker custom dengan logo jualan, ilustrasi lucu, atau label nama sesuai kebutuhanmu dengan berbagai macam jenis bahan (vinyl, glossy, transparan).",
    category: "Sticker",
    imageUrls: ["https://placehold.co/800x800/1F3A2E/FBF9F4?text=Sticker+Custom"],
    formatOptions: "Vinyl, glossy, transparan",
    sortOrder: 4,
    isActive: true,
  },
  {
    name: "Produk cetak lainnya",
    description:
      "Butuh produk cetak custom lainnya? Kami juga melayani pembuatan amplop custom, buku mewarnai anak, dll. Punya ide produk cetak lain? Hubungi tim kami untuk konsultasi desain dan harga!",
    category: "Lainnya",
    imageUrls: ["https://placehold.co/800x800/1F3A2E/FBF9F4?text=Produk+Cetak+Lainnya"],
    formatOptions: null,
    sortOrder: 5,
    isActive: true,
  },
];

const faqEntries = [
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

const contact = {
  whatsappNumber: "085117046472",
  email: "pr.galeri@gmail.com",
  instagramHandle: "prgaleri",
  shopeeUrl: "https://shopee.co.id/prgaleri",
};

async function main() {
  console.log("Seeding products...");
  for (const product of products) {
    const row = await createProduct(product);
    console.log(`  + product: ${row.name} (${row.id})`);
  }

  console.log("Seeding FAQ entries...");
  for (const faq of faqEntries) {
    const row = await createFaqItem(faq);
    console.log(`  + faq: ${row.question} (${row.id})`);
  }

  console.log("Upserting contact info...");
  const contactRow = await upsertContactInfo(contact);
  console.log(`  = contact: ${contactRow.email} / ${contactRow.whatsappNumber} (${contactRow.id})`);

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
