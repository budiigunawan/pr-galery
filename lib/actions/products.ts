"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { safeParseProductInput } from "@/lib/validation/products";
import {
  createProduct,
  deleteProduct,
  listAllProductsAdmin,
  reorderProducts,
  updateProduct,
} from "@/lib/db/queries/products";

export interface ProductFormState {
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
}

/**
 * Reads the raw product fields off a FormData object field-by-field.
 * `isActive` MUST be read explicitly as `=== "on"` rather than spread from
 * `Object.fromEntries` — an unchecked checkbox is simply absent from
 * FormData, and the schema's `.default(true)` would silently turn an
 * intended "inactive" into "active" if we relied on the default instead.
 */
function readRawProductFields(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    imageUrls: formData.get("imageUrls"),
    formatOptions: formData.get("formatOptions"),
    isActive: formData.get("isActive") === "on",
  };
}

/**
 * Coerces the raw FormData fields back into strings for controlled-input
 * redisplay after a validation error (the checkbox is excluded — checkboxes
 * are redisplayed via defaultChecked, not defaultValue).
 */
function rawFieldsToValues(formData: FormData): Record<string, string> {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    imageUrls: String(formData.get("imageUrls") ?? ""),
    formatOptions: String(formData.get("formatOptions") ?? ""),
  };
}

/**
 * Bound to ProductForm via useActionState from app/admin/(dashboard)/products/new/page.tsx.
 * New products are appended to the end of the sort order.
 */
export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireSession();

  const raw = readRawProductFields(formData);
  const parsed = safeParseProductInput(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values: rawFieldsToValues(formData) };
  }

  const existing = await listAllProductsAdmin();
  await createProduct({ ...parsed.data, sortOrder: existing.length });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

/**
 * Bound to ProductForm via `updateProductAction.bind(null, id)` from
 * app/admin/(dashboard)/products/[id]/edit/page.tsx before being passed to
 * useActionState. `sortOrder` is stripped from the parsed data before the
 * DB call so an edit never resets the row's sort position.
 */
export async function updateProductAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireSession();

  const raw = readRawProductFields(formData);
  const parsed = safeParseProductInput(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values: rawFieldsToValues(formData) };
  }

  const { sortOrder, ...updateFields } = parsed.data;
  void sortOrder; // intentionally excluded: editing a product never changes its sort position
  await updateProduct(id, updateFields);

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

/**
 * Called directly as a list-page form action (via DeleteButton), not
 * through useActionState — no redirect needed.
 */
export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await deleteProduct(id);

  revalidatePath("/admin/products");
  revalidatePath("/");
}

/**
 * Called directly as a list-page form action (via SortOrderControls), not
 * through useActionState. Swaps the target row with its neighbor in the
 * current sort order and persists the full reordered id list.
 */
export async function reorderProductsAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = formData.get("id");
  const direction = formData.get("direction");
  if (typeof id !== "string" || !id) return;
  if (direction !== "up" && direction !== "down") return;

  const items = await listAllProductsAdmin();
  const index = items.findIndex((p) => p.id === id);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return;

  const ids = items.map((p) => p.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorderProducts(ids);

  revalidatePath("/admin/products");
  revalidatePath("/");
}
