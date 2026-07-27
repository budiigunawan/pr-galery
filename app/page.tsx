import { listActiveProducts } from "@/lib/db/queries/products";
import { listFaqItems } from "@/lib/db/queries/faq";
import { getContactInfo } from "@/lib/db/queries/contact";
import { toWhatsAppLink } from "@/lib/utils/whatsapp";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import DocketCard from "@/components/ui/DocketCard";
import WashiTapeFrame from "@/components/ui/WashiTapeFrame";
import Button from "@/components/ui/Button";
import Nav from "@/components/ui/Nav";
import CatalogTag from "@/components/ui/CatalogTag";

export const revalidate = 3600;

// Placeholder monogram art until real brand photography/logo art is supplied.
const HERO_IMAGE_URL =
  "https://placehold.co/480x600/1F3A2E/FBF9F4.png?text=PR+Galeri";

const FALLBACK_PRODUCT_IMAGE_URL =
  "https://placehold.co/800x800/1F3A2E/FBF9F4.png?text=Produk";

function safeWhatsAppLink(rawNumber: string): string | null {
  try {
    return toWhatsAppLink(rawNumber);
  } catch {
    return null;
  }
}

export default async function Home() {
  const [products, faqItems, contactInfo] = await Promise.all([
    listActiveProducts(),
    listFaqItems(),
    getContactInfo(),
  ]);

  const whatsappLink = contactInfo
    ? safeWhatsAppLink(contactInfo.whatsappNumber)
    : null;

  return (
    <>
      <div id="top" className="docket-edge-top h-4 bg-paper" aria-hidden="true" />
      <Nav whatsappLink={whatsappLink} />

      {/* Hero */}
      <Section tone="kraft" className="grid-dots overflow-hidden">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-xl flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <CatalogTag label="HOME PRINTING · SATUAN & CUSTOM" />
            <SectionHeading
              heading="PRGaleri HomePrinting"
              tagline="Crafted with Passion."
              taglinePosition="below"
              tone="light"
              className="[&_h2]:text-4xl sm:[&_h2]:text-6xl lg:[&_h2]:text-7xl"
            />
            <p className="font-sans text-base text-ink/70 sm:text-lg">
              Refill loose leaf, notebook custom, buku tulis, kalender duduk,
              hingga stiker custom — dicetak dan dijilid langsung di rumah,
              dengan perhatian penuh di setiap detail.
            </p>
            <Button href="#contact" variant="primary">
              Hubungi Kami
            </Button>
          </div>
          <WashiTapeFrame
            src={HERO_IMAGE_URL}
            alt="Monogram PRGaleri HomePrinting"
            className="w-64 shrink-0 sm:w-80"
          />
        </div>
      </Section>

      {/* Product grid */}
      <Section tone="paper" id="produk">
        <SectionHeading
          heading="Produk Kami"
          tagline="Katalog"
          taglinePosition="above"
          tone="light"
          className="mb-10"
        />
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description}
                imageUrl={product.imageUrls[0] ?? FALLBACK_PRODUCT_IMAGE_URL}
                category={product.category}
                index={index + 1}
              />
            ))}
          </div>
        ) : (
          <p className="font-sans text-ink/70">
            Belum ada produk saat ini. Silakan hubungi kami untuk info produk
            terbaru.
          </p>
        )}
      </Section>

      {/* Feature / CTA band */}
      <Section tone="pine-deep">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <SectionHeading
            heading="Ingin punya produk cetak unik dengan ciri khasmu sendiri?"
            tone="dark"
          />
          <p className="font-sans text-base text-paper/80 sm:text-lg">
            Kami melayani cetak satuan tanpa minimum order maupun pesanan
            grosir dalam jumlah besar, dengan harga yang bersaing dan hasil
            yang tetap rapi di setiap ukuran pesanan.
          </p>
          <p className="font-display text-xl italic text-paper">
            Yuk, buat produk impianmu sekarang!
          </p>
          <Button
            href="#contact"
            variant="secondary"
            className="border-paper! text-paper! hover:bg-paper! hover:text-pine-deep!"
          >
            Yuk, Pesan Sekarang
          </Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="kraft" id="faq">
        <SectionHeading
          heading="Pertanyaan Umum"
          tagline="FAQ"
          taglinePosition="above"
          tone="light"
          className="mb-10"
        />
        {faqItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {faqItems.map((item, index) => (
              <DocketCard
                key={item.id}
                question={item.question}
                answer={item.answer}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="font-sans text-ink/70">
            Belum ada pertanyaan yang tercatat.
          </p>
        )}
      </Section>

      {/* Contact / footer */}
      <Section tone="pine-deep" id="contact">
        <div className="flex flex-col gap-8">
          <SectionHeading heading="Pesan Sekarang" tone="dark" />
          {contactInfo ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {whatsappLink && (
                <Button
                  href={whatsappLink}
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-paper! text-paper! hover:bg-paper! hover:text-pine-deep!"
                >
                  WhatsApp
                </Button>
              )}
              <Button
                href={`mailto:${contactInfo.email}`}
                variant="secondary"
                className="border-paper! text-paper! hover:bg-paper! hover:text-pine-deep!"
              >
                Email
              </Button>
              <Button
                href={`https://instagram.com/${contactInfo.instagramHandle}`}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
                className="border-paper! text-paper! hover:bg-paper! hover:text-pine-deep!"
              >
                Instagram
              </Button>
              <Button
                href={contactInfo.shopeeUrl}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
                className="border-paper! text-paper! hover:bg-paper! hover:text-pine-deep!"
              >
                Shopee
              </Button>
            </div>
          ) : (
            <p className="font-sans text-paper/70">
              Info kontak akan segera hadir. Silakan pantau media sosial kami.
            </p>
          )}
          <p className="font-mono text-xs text-paper/50">
            © 2026 PRGaleri HomePrinting
          </p>
        </div>
      </Section>
    </>
  );
}
