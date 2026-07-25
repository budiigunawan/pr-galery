import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";

export type ProductRow = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

/** Products visible on the public landing page, active only, in display order. */
export function listActiveProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sortOrder));
}

/** All products (active + inactive) for the admin CMS, in display order. */
export function listAllProductsAdmin() {
  return db.select().from(products).orderBy(asc(products.sortOrder));
}

export async function getProductById(id: string) {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createProduct(input: Omit<NewProduct, "id" | "createdAt" | "updatedAt">) {
  const rows = await db.insert(products).values(input).returning();
  return rows[0];
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<NewProduct, "id" | "createdAt" | "updatedAt">>
) {
  const rows = await db
    .update(products)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteProduct(id: string) {
  const rows = await db.delete(products).where(eq(products.id, id)).returning();
  return rows[0] ?? null;
}

/**
 * Persists a new display order for `ids`, where the array index becomes the
 * `sortOrder`. Applied as individual sequential updates — the neon-http
 * driver doesn't support interactive transactions, and this is a low-volume
 * admin-only operation, so a single-statement CASE isn't necessary.
 */
export async function reorderProducts(ids: string[]) {
  for (let index = 0; index < ids.length; index++) {
    await db
      .update(products)
      .set({ sortOrder: index, updatedAt: new Date() })
      .where(eq(products.id, ids[index]));
  }
}
