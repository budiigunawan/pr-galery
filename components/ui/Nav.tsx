import Image from "next/image";
import Button from "@/components/ui/Button";

interface NavProps {
  whatsappLink: string | null;
}

const NAV_LINKS = [
  { href: "#produk", label: "Produk" },
  { href: "#cara-pesan", label: "Cara Pesan" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Kontak" },
];

/**
 * Sticky "letterhead" nav bar — logo + wordmark, anchor links to the page's
 * sections, and a WhatsApp CTA when contact info is available. Rendered
 * directly in `app/page.tsx`, not `app/layout.tsx`, so it never leaks into
 * `/admin/*`.
 */
export default function Nav({ whatsappLink }: NavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-kraft/95 shadow-card backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-w-0 shrink items-center gap-2">
          <Image src="/logo-mark.png" alt="PRGaleri HomePrinting" width={40} height={40} className="h-10 w-10 shrink-0" />
          <span className="truncate font-display text-base font-semibold text-ink sm:text-lg">PRGaleri HomePrinting</span>
        </a>

        <nav className="hidden items-center gap-6 sm:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="font-sans text-sm font-medium text-ink/70 transition-colors hover:text-pine">
              {link.label}
            </a>
          ))}
        </nav>

        {whatsappLink && (
          <Button href={whatsappLink} variant="primary" target="_blank" rel="noopener noreferrer" className="shrink-0 px-4 py-2 text-sm sm:px-6 sm:py-2.5">
            WhatsApp
          </Button>
        )}
      </div>
    </header>
  );
}
