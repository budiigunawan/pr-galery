import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import AdminNav from "@/components/admin/AdminNav";
import { logoutAction } from "@/lib/actions/auth";

/**
 * Minimal admin chrome, reached only once middleware.ts has verified a
 * session. Lives in a (dashboard) route group so it does NOT wrap
 * app/admin/login/page.tsx — the unauthenticated login screen has no
 * business showing a "Keluar" button or the authenticated nav. Feature 06
 * adds the actual Produk/FAQ/Kontak pages under this same group, which will
 * inherit this chrome (e.g. app/admin/(dashboard)/products/page.tsx).
 */
export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-kraft text-ink">
      <header className="border-b border-ink/10 bg-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-stamp">Admin</p>
            <h1 className="font-display text-xl font-semibold text-ink">PR Galeri</h1>
          </div>

          <AdminNav />

          <form action={logoutAction}>
            <Button type="submit" variant="secondary">
              Keluar
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
