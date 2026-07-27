import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/db/queries/products";
import { updateProductAction } from "@/lib/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Edit Produk</h1>
      <ProductForm
        action={updateProductAction.bind(null, id)}
        initialValues={{
          name: product.name,
          description: product.description,
          category: product.category,
          imageUrls: product.imageUrls,
          formatOptions: product.formatOptions,
          isActive: product.isActive,
        }}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
