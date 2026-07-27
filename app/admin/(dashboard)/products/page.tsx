import Link from "next/link";
import Button from "@/components/ui/Button";
import DeleteButton from "@/components/admin/DeleteButton";
import SortOrderControls from "@/components/admin/SortOrderControls";
import { listAllProductsAdmin } from "@/lib/db/queries/products";
import { deleteProductAction, reorderProductsAction } from "@/lib/actions/products";

/**
 * Admin product list. Ordered by sortOrder (ascending, as returned by
 * listAllProductsAdmin) with inline up/down/edit/delete controls.
 */
export default async function AdminProductsPage() {
  const products = await listAllProductsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Produk</h1>
        <Button href="/admin/products/new">Produk Baru</Button>
      </div>

      {products.length === 0 ? (
        <p className="font-sans text-sm text-ink/60">Belum ada produk.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product, index) => (
            <li
              key={product.id}
              className="docket-edge flex flex-wrap items-center justify-between gap-4 rounded-b-card bg-paper px-6 py-4 shadow-card"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-base font-semibold text-ink">
                    {product.name}
                  </span>
                  <span
                    className={
                      "rounded-full px-2 py-0.5 font-sans text-xs font-semibold " +
                      (product.isActive ? "bg-pine/10 text-pine" : "bg-stamp/10 text-stamp")
                    }
                  >
                    {product.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <span className="font-sans text-sm text-ink/60">{product.category}</span>
              </div>

              <div className="flex items-center gap-4">
                <SortOrderControls
                  id={product.id}
                  action={reorderProductsAction}
                  isFirst={index === 0}
                  isLast={index === products.length - 1}
                />
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="font-sans text-sm font-semibold text-pine hover:underline"
                >
                  Edit
                </Link>
                <DeleteButton
                  id={product.id}
                  action={deleteProductAction}
                  confirmMessage="Yakin ingin menghapus produk ini?"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
