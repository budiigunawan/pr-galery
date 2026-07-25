import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { faqItems } from "@/lib/db/schema";

export type FaqItemRow = typeof faqItems.$inferSelect;
export type NewFaqItem = typeof faqItems.$inferInsert;

/** All FAQ entries in display order (no active/inactive flag for FAQ). */
export function listFaqItems() {
  return db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
}

export async function getFaqItemById(id: string) {
  const rows = await db.select().from(faqItems).where(eq(faqItems.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createFaqItem(input: Omit<NewFaqItem, "id" | "createdAt" | "updatedAt">) {
  const rows = await db.insert(faqItems).values(input).returning();
  return rows[0];
}

export async function updateFaqItem(
  id: string,
  input: Partial<Omit<NewFaqItem, "id" | "createdAt" | "updatedAt">>
) {
  const rows = await db
    .update(faqItems)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(faqItems.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteFaqItem(id: string) {
  const rows = await db.delete(faqItems).where(eq(faqItems.id, id)).returning();
  return rows[0] ?? null;
}

/**
 * Persists a new display order for `ids`, where the array index becomes the
 * `sortOrder`. Applied as individual sequential updates (see note in
 * `products.ts#reorderProducts` — same rationale applies here).
 */
export async function reorderFaqItems(ids: string[]) {
  for (let index = 0; index < ids.length; index++) {
    await db
      .update(faqItems)
      .set({ sortOrder: index, updatedAt: new Date() })
      .where(eq(faqItems.id, ids[index]));
  }
}
