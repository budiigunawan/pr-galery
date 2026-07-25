import type { ReactNode } from "react";

export interface CatalogTagProps {
  children: ReactNode;
  className?: string;
}

export default function CatalogTag({ children, className }: CatalogTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-stamp bg-paper px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide text-stamp ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
