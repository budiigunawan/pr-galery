import { asc, eq, sql } from "drizzle-orm";
import { db } from "../client";
import { faqItems, type NewFaqItem, type FaqItem } from "../schema";

export type CreateFaqInput = Omit<NewFaqItem, "id" | "createdAt" | "updatedAt">;

export type UpdateFaqInput = Partial<CreateFaqInput>;

export function listFaqItems(): Promise<FaqItem[]> {
  return db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
}

export async function getFaqItemById(id: string): Promise<FaqItem | null> {
  const rows = await db
    .select()
    .from(faqItems)
    .where(eq(faqItems.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createFaqItem(input: CreateFaqInput): Promise<FaqItem> {
  const rows = await db.insert(faqItems).values(input).returning();
  return rows[0];
}

export async function updateFaqItem(
  id: string,
  input: UpdateFaqInput,
): Promise<FaqItem | null> {
  const rows = await db
    .update(faqItems)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(faqItems.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteFaqItem(id: string): Promise<void> {
  await db.delete(faqItems).where(eq(faqItems.id, id));
}

export async function reorderFaqItems(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id, index) =>
      db
        .update(faqItems)
        .set({ sortOrder: index, updatedAt: sql`now()` })
        .where(eq(faqItems.id, id)),
    ),
  );
}
