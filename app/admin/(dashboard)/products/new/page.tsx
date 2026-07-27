import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Produk Baru</h1>
      <ProductForm action={createProductAction} submitLabel="Buat Produk" />
    </div>
  );
}
