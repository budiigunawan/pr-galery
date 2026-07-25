import { asc, eq, sql } from "drizzle-orm";
import { db } from "../client";
import { products, type NewProduct, type Product } from "../schema";

export type CreateProductInput = Omit<
  NewProduct,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateProductInput = Partial<CreateProductInput>;

export function listActiveProducts(): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sortOrder));
}

export function listAllProductsAdmin(): Promise<Product[]> {
  return db.select().from(products).orderBy(asc(products.sortOrder));
}

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const rows = await db.insert(products).values(input).returning();
  return rows[0];
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product | null> {
  const rows = await db
    .update(products)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteProduct(id: string): Promise<void> {
  await db.delete(products).where(eq(products.id, id));
}

export async function reorderProducts(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id, index) =>
      db
        .update(products)
        .set({ sortOrder: index, updatedAt: sql`now()` })
        .where(eq(products.id, id)),
    ),
  );
}
