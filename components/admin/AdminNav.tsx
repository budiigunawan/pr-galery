"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/products", label: "Produk" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/contact", label: "Kontak" },
] as const;

/**
 * Nav between the three admin sections. Active-section detection is a
 * prefix match so /admin/products/new and /admin/products/[id]/edit still
 * highlight "Produk".
 */
export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 font-sans text-sm">
      {LINKS.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={
              isActive
                ? "font-semibold text-ink"
                : "text-ink/60 hover:text-ink"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
